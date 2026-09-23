import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canTeach(user.role)) {
      // upsert keeps this idempotent if two requests race
      await prisma.teacher.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      })
    }

    return NextResponse.json({ ...user, role: user.role === 'ADMIN' ? 'ADMIN' : 'TEACHER' })
  } catch (error) {
    console.error('Error granting teacher role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
