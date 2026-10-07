import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/** Updates the signed-in user's own profile. Email, password and role are not editable here. */
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data: { name?: string; age?: number | null; location?: string | null; interests?: string | null } = {}

    if ('name' in body) {
      if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 100) {
        return NextResponse.json({ error: 'Name is required (up to 100 characters)' }, { status: 400 })
      }
      data.name = body.name.trim()
    }
    if ('age' in body) {
      if (body.age !== null && !(Number.isInteger(body.age) && body.age >= 1 && body.age <= 120)) {
        return NextResponse.json({ error: 'Age must be a whole number from 1 to 120' }, { status: 400 })
      }
      data.age = body.age
    }
    for (const field of ['location', 'interests'] as const) {
      if (!(field in body)) continue
      const value = body[field]
      if (value !== null && (typeof value !== 'string' || value.length > 500)) {
        return NextResponse.json({ error: `${field} must be text (up to 500 characters)` }, { status: 400 })
      }
      data[field] = value === null || !value.trim() ? null : value.trim()
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, email: true, name: true, age: true, location: true, interests: true }
    })
    return NextResponse.json({ ...updated, role: user.role })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
