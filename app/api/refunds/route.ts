import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { refundRequestSchema } from '@/lib/validators'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const input = refundRequestSchema.parse(body)

    // Verify order belongs to user and is eligible for refund
    const order = await db.order.findFirst({
      where: { id: input.orderId, userId: session.user.id },
      include: { payment: true, refund: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      )
    }

    if (order.refund) {
      return NextResponse.json(
        { success: false, error: 'Refund already exists for this order' },
        { status: 400 },
      )
    }

    if (!['delivered', 'paid', 'processing'].includes(order.status)) {
      return NextResponse.json(
        { success: false, error: 'Order not eligible for refund' },
        { status: 400 },
      )
    }

    // Create refund request
    const refund = await db.refund.create({
      data: {
        orderId: input.orderId,
        amountDzd: order.totalDzd,
        reason: input.reason,
        status: 'pending',
      },
    })

    // Create order event
    await db.orderEvent.create({
      data: {
        orderId: input.orderId,
        type: 'refund_requested',
        data: { refundId: refund.id, reason: input.reason },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: refund,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 },
      )
    }
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to create refund request' },
      { status: 500 },
    )
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const refunds = await db.refund.findMany({
      where: {
        order: {
          userId: session.user.id,
        },
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: refunds,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refunds' },
      { status: 500 },
    )
  }
}
