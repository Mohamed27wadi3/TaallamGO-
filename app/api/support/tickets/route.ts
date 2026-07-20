import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { supportTicketSchema } from '@/lib/validators'
import { z } from 'zod'

function generatePublicTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TKT-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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
    const input = supportTicketSchema.parse(body)

    const ticket = await db.supportTicket.create({
      data: {
        publicId: generatePublicTicketId(),
        userId: session.user.id,
        orderId: input.orderId,
        category: input.category,
        priority: input.priority || 'normal',
        subject: input.subject,
        status: 'open',
        messages: {
          create: {
            senderId: session.user.id,
            content: input.message,
          },
        },
      },
      include: {
        messages: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: ticket,
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
      { success: false, error: 'Failed to create support ticket' },
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

    const tickets = await db.supportTicket.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: tickets,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 },
    )
  }
}
