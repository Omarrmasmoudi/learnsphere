import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session'

// Pages that require a signed-in user. API routes check the session themselves
// so they can answer with a 401 instead of a redirect.
export async function middleware(request: NextRequest) {
  const userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  if (userId) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search)
  const response = NextResponse.redirect(loginUrl)
  // Drop a stale or tampered cookie so the client stops sending it
  response.cookies.delete(SESSION_COOKIE)
  return response
}

export const config = {
  matcher: ['/teacher/:path*'],
}
