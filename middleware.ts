import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

// Middleware to check authentication on protected routes
export function middleware(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some(name =>
    request.cookies.has(name),
  )

  // If no session and route is protected, redirect to login
  if (!hasSessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/orders/:path*',
    '/api/payments/:path*',
    '/api/refunds/:path*',
    '/api/support/:path*',
    '/api/custom-requests/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
  ],
}
