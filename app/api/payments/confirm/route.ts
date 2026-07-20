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

    // Verify order and payment exist
    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { payment: true },
    })

    if (!order || !order.payment) {
      return NextResponse.json(
        { success: false, error: 'Order or payment not found' },
        { status: 404 },
      )
    }

    if (order.status === 'paid' || order.payment.status === 'succeeded') {
      return NextResponse.json(
        { success: false, error: 'Order already paid' },
        { status: 409 },
      )
    }

    if (!['awaiting_payment', 'payment_review'].includes(order.status)) {
      return NextResponse.json(
        { success: false, error: 'Order is not payable' },
        { status: 409 },
      )
    }

    const confirmed = await paymentProvider.confirmPayment(
      order.payment.id,
      order.payment.referenceExternal || '',
    )

    if (!confirmed) {
      await db.payment.update({
        where: { id: order.payment.id },
        data: { status: 'failed' },
      })

      await db.paymentAttempt.create({
        data: {
          paymentId: order.payment.id,
          status: 'failed',
          errorMessage: 'Mock payment refused',
        },
      })

      return NextResponse.json(
        { success: false, error: 'Payment refused' },
        { status: 402 },
      )
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id: order.payment.id },
      data: { status: 'succeeded' },
    })

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: 'paid' },
    })

    // Create order event
    await db.orderEvent.create({
      data: {
        orderId,
        type: 'payment_confirmed',
        data: { paymentId: updatedPayment.id },
      },
    })

    await db.paymentAttempt.create({
      data: {
        paymentId: updatedPayment.id,
        status: 'succeeded',
        metadata: { provider: updatedPayment.provider },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        payment: updatedPayment,
        order: updatedOrder,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to confirm payment' },
      { status: 500 },
    )
  }
}
