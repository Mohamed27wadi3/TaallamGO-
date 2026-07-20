import { NextRequest, NextResponse } from 'next/server'

/**
 * Safe API response helper
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details !== undefined ? { details } : {}) },
    { status },
  )
}

/**
 * Parse JSON body safely
 */
export async function parseRequestBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    throw new Error('Invalid JSON body')
  }
}

/**
 * Extract query parameters
 */
export function getQueryParams(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams)
}

/**
 * Rate limit check
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000,
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count < limit) {
    entry.count++
    return true
  }

  return false
}
