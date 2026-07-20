import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

const profileUpdateSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(40).optional(),
  wilaya: z.string().trim().max(80).optional(),
  language: z.enum(['fr', 'ar']).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
})

export async function GET() {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      name: true,
      image: true,
      createdAt: true,
      profile: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          publicId: true,
          status: true,
          totalDzd: true,
          createdAt: true,
        },
      },
      sessions: {
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          expires: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: user })
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const input = profileUpdateSchema.parse(await request.json())

    if (input.newPassword) {
      if (!input.currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required' },
          { status: 400 },
        )
      }

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      })

      if (!user?.password || !(await bcrypt.compare(input.currentPassword, user.password))) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 },
        )
      }

      await db.user.update({
        where: { id: session.user.id },
        data: { password: await bcrypt.hash(input.newPassword, 10) },
      })
    }

    const profile = await db.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        wilaya: input.wilaya,
        language: input.language || 'fr',
      },
      update: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        wilaya: input.wilaya,
        language: input.language,
      },
    })

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
    if (displayName) {
      await db.user.update({
        where: { id: session.user.id },
        data: { name: displayName },
      })
    }

    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid profile data' },
        { status: 400 },
      )
    }

    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
