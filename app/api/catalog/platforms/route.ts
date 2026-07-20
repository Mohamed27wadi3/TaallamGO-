import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const platforms = await db.platform.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: platforms,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platforms' },
      { status: 500 },
    )
  }
}
