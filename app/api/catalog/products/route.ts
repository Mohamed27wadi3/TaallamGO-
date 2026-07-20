import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productFiltersSchema } from '@/lib/validators'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters
    const filters = productFiltersSchema.parse({
      platformId: searchParams.get('platformId') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      level: searchParams.get('level') || undefined,
      certificate: searchParams.get('certificate') === 'true' ? true : undefined,
      sortBy: searchParams.get('sortBy') as any,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
    })

    const skip = ((filters.page || 1) - 1) * (filters.limit || 12)
    const take = filters.limit || 12

    // Build query
    const where: any = {
      status: 'available',
    }

    if (filters.platformId) {
      where.platformId = filters.platformId
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.level) {
      where.level = filters.level
    }

    if (filters.certificate !== undefined) {
      where.certificate = filters.certificate
    }

    // Build sort
    let orderBy: any = { createdAt: 'desc' }
    if (filters.sortBy === 'price_asc') {
      orderBy = { prices: { _max: { amountDzd: 'asc' } } }
    } else if (filters.sortBy === 'price_desc') {
      orderBy = { prices: { _max: { amountDzd: 'desc' } } }
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          platform: true,
          category: true,
          prices: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy,
        skip,
        take,
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: filters.page || 1,
        limit: filters.limit || 12,
        pages: Math.ceil(total / (filters.limit || 12)),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid filters', details: error.issues },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}
