import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createOrderSchema } from '@/lib/validators'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

// Generate public order ID
function generatePublicOrderId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `TGO-${year}-${random}`
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
    const input = createOrderSchema.parse(body)

    // Get all products with prices
    const productIds = input.items.map(item => item.productId)
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (products.length !== input.items.length) {
      return NextResponse.json(
        { success: false, error: 'One or more products not found' },
        { status: 404 },
      )
    }

    // Calculate total
    let totalDzd = 0
    const orderItems = input.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product?.prices.length) {
        throw new Error(`No price found for product ${item.productId}`)
      }
      const price = product.prices[0]
      const itemTotal = price.amountDzd * item.quantity
      totalDzd += itemTotal
      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceDzd: price.amountDzd,
      }
    })

    // Create order
    const order = await db.order.create({
      data: {
        publicId: generatePublicOrderId(),
        userId: session.user.id,
        totalDzd,
        status: 'awaiting_payment',
        notes: input.notes,
        items: {
          create: orderItems,
        },
        events: {
          create: {
            type: 'order_created',
            data: { items: orderItems },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        events: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: order,
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
      { success: false, error: 'Failed to create order' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = { userId: session.user.id }
    if (status) {
      where.status = status
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        events: true,
        payment: true,
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 },
    )
  }
}
