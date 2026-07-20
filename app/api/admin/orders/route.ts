import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession, hasPermission } from '@/lib/auth'
import { z } from 'zod'

// For admin to update order status
const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    'awaiting_payment',
    'payment_review',
    'paid',
    'processing',
    'customer_action_required',
    'delivered',
    'cancelled',
    'refund_pending',
    'refunded',
    'disputed',
  ]),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Check admin permission
    const isAdmin = await hasPermission(session.user.id, 'orders', 'read')
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          refund: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin orders' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Check admin permission
    const isAdmin = await hasPermission(session.user.id, 'orders', 'update')
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const input = updateOrderStatusSchema.parse(body)

    const order = await db.order.update({
      where: { id: input.orderId },
      data: {
        status: input.status,
      },
    })

    // Log the change
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'update',
        resource: 'order',
        resourceId: input.orderId,
        dataAfter: { status: input.status },
        status: 'success',
      },
    })

    // Create event
    await db.orderEvent.create({
      data: {
        orderId: input.orderId,
        type: 'status_changed',
        data: { newStatus: input.status, notes: input.notes },
      },
    })

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 },
      )
    }
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 },
    )
  }
}
