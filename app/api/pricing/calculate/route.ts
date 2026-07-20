import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pricingCalculateSchema } from '@/lib/validators'
import { calculatePrice } from '@/lib/services'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = pricingCalculateSchema.parse(body)

    // Get product with latest price
    const product = await db.product.findUnique({
      where: { id: input.productId },
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!product || !product.prices.length) {
      return NextResponse.json(
        { success: false, error: 'Product or price not found' },
        { status: 404 },
      )
    }

    const price = product.prices[0]

    // Calculate pricing
    const result = calculatePrice({
      priceUsd: price.amountUsd / 100, // Convert from cents
      exchangeRate: price.exchangeRate.toNumber(),
      exchangeMargin: price.exchangeMargin.toNumber(),
      feePercentage: price.feePercentage.toNumber(),
      commissionPercentage: price.commissionPercentage.toNumber(),
      discountPercentage: 0, // Handle coupons separately
    })

    // Apply quantity multiplier
    if (input.quantity && input.quantity > 1) {
      result.totalDzd = result.totalDzd * input.quantity
      result.breakdown[result.breakdown.length - 1].amount = result.totalDzd
    }

    return NextResponse.json({
      success: true,
      data: {
        productId: input.productId,
        quantity: input.quantity || 1,
        ...result,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to calculate pricing' },
      { status: 500 },
    )
  }
}
