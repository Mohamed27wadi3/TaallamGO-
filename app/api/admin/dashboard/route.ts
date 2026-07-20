import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession, hasPermission } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Check admin permission
    const isAdmin = await hasPermission(session.user.id, 'admin', 'read')
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    // Get KPIs
    const [
      totalOrders,
      totalRevenue,
      ordersThisMonth,
      revenueThisMonth,
      ordersThisDay,
      openTickets,
      pendingRefunds,
    ] = await Promise.all([
      db.order.count(),
      db.order.aggregate({
        _sum: { totalDzd: true },
      }),
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setDate(new Date().getDate() + 1)),
          },
        },
      }),
      db.order.aggregate({
        _sum: { totalDzd: true },
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      db.supportTicket.count({
        where: { status: 'open' },
      }),
      db.refund.count({
        where: { status: 'pending' },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalDzd || 0,
        ordersThisMonth,
        revenueThisMonth: revenueThisMonth._sum.totalDzd || 0,
        ordersThisDay,
        openTickets,
        pendingRefunds,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin dashboard' },
      { status: 500 },
    )
  }
}
