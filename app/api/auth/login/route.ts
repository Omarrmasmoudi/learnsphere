import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '../../../../lib/prisma'
import { generateToken } from '../../../../lib/action/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
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

    const token = await generateToken({ userId: user.id })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}