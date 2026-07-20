import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { MockPaymentProvider } from '@/lib/services'

const paymentProvider = new MockPaymentProvider()

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 },
      )
    }

    // Verify order belongs to user and is still payable
    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { payment: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      )
    }

    if (['paid', 'processing', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return NextResponse.json(
        { success: false, error: 'Order is not payable' },
        { status: 409 },
      )
    }

    if (order.payment) {
      if (order.payment.status === 'succeeded') {
        return NextResponse.json(
          { success: false, error: 'Order already paid' },
          { status: 409 },
        )
      }

      const attempt = await db.paymentAttempt.create({
        data: {
          paymentId: order.payment.id,
          status: 'initiated',
          metadata: { provider: 'mock', retry: true },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          ...order.payment,
          attempts: [attempt],
          notice: 'Paiement de démonstration — aucune somme ne sera débitée.',
        },
      })
    }

    // Create payment intent
    const paymentIntent = await paymentProvider.createPaymentIntent(
      orderId,
      order.totalDzd,
    )

    // Create payment record
    const payment = await db.payment.create({
      data: {
        orderId,
        amountDzd: order.totalDzd,
        provider: 'mock',
        status: 'processing',
        referenceExternal: paymentIntent.id,
        metadata: {
          notice: 'Paiement de démonstration — aucune somme ne sera débitée.',
        },
      },
      include: {
        attempts: true,
      },
    })

    // Create payment attempt
    await db.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        status: 'initiated',
        metadata: { provider: 'mock' },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: payment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 },
    )
  }
}
