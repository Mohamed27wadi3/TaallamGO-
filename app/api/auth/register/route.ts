import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/validators'

const registerRequestSchema = registerSchema.extend({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  language: z.enum(['fr', 'ar']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const input = registerRequestSchema.parse(await request.json())
    const email = input.email.toLowerCase()

    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Un compte existe déjà avec cet email.' },
        { status: 409 },
      )
    }

    const password = await bcrypt.hash(input.password, 10)
    const [firstName, ...lastNameParts] = (input.name || '').trim().split(/\s+/).filter(Boolean)

    const user = await db.user.create({
      data: {
        email,
        name: input.name,
        password,
        profile: {
          create: {
            firstName,
            lastName: lastNameParts.join(' ') || undefined,
            phone: input.phone || undefined,
            language: input.language || 'fr',
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Données invalides.' },
        { status: 400 },
      )
    }

    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Impossible de créer le compte.' },
      { status: 500 },
    )
  }
}
