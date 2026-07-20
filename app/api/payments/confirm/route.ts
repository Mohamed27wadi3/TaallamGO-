import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

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
