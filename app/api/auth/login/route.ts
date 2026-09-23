import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Case-insensitive so accounts registered before emails were normalized still match
    const user = await prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
       return NextResponse.json(
         { error: 'Invalid credentials' },
         { status: 401 }
       )
     }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
    response.cookies.set(SESSION_COOKIE, await signSession(user.id), sessionCookieOptions)
    return response
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
