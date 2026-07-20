import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { customRequestSchema } from '@/lib/validators'
import { getSession } from '@/lib/auth'
import { validateUrlForSSRF } from '@/lib/services'
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
    const input = customRequestSchema.parse(body)

    // Validate URL for SSRF
    const urlValidation = validateUrlForSSRF(input.url)
    if (!urlValidation.valid) {
      return NextResponse.json(
        { success: false, error: urlValidation.error },
        { status: 400 },
      )
    }

    // Detect platform from URL
    let platformId: string | undefined
    const urlLower = input.url.toLowerCase()
    if (urlLower.includes('udemy.com')) {
      const platform = await db.platform.findFirst({
        where: { slug: 'udemy' },
      })
      platformId = platform?.id
    } else if (urlLower.includes('coursera.com')) {
      const platform = await db.platform.findFirst({
        where: { slug: 'coursera' },
      })
      platformId = platform?.id
    } else if (urlLower.includes('hackthebox.com')) {
      const platform = await db.platform.findFirst({
        where: { slug: 'htb' },
      })
      platformId = platform?.id
    }

    const customRequest = await db.customRequest.create({
      data: {
        userId: session.user.id,
        url: input.url,
        title: input.title,
        description: input.description,
        platformId,
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: customRequest,
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
      { success: false, error: 'Failed to create custom request' },
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

    const customRequests = await db.customRequest.findMany({
      where: { userId: session.user.id },
      include: {
        platform: true,
        quote: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: customRequests,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch custom requests' },
      { status: 500 },
    )
  }
}
