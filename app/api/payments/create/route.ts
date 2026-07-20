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

    // Verify order belongs to user
    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user.id },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      )
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
