import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession, hasPermission } from '@/lib/auth'

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
    const isAdmin = await hasPermission(session.user.id, 'support', 'read')
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'open'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [tickets, total] = await Promise.all([
      db.supportTicket.findMany({
        where: { status },
        include: {
          user: true,
          order: true,
          messages: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      db.supportTicket.count({ where: { status } }),
    ])

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin support tickets' },
      { status: 500 },
    )
  }
}
