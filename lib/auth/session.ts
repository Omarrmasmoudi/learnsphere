import { jwtVerify, SignJWT } from 'jose'

// Edge-safe: no Node APIs, no Prisma. Imported by middleware as well as route handlers.

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

const ISSUER = 'LearnSphere'
const AUDIENCE = 'LearnSphere'

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  return new TextEncoder().encode(secret)
}

export async function signSession(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

/** Returns the user id carried by a valid session token, or null. */
export async function verifySession(token: string | undefined): Promise<number | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['HS256'],
    })
    const userId = Number(payload.sub)
    return Number.isInteger(userId) && userId > 0 ? userId : null
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
}
