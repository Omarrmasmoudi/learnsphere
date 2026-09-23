import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!canTeach(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const showUnpublished = url.searchParams.get('unpublished') === 'true'

    const courses = await prisma.course.findMany({
      where: {
        instructorId: user.id,
        ...(showUnpublished ? {} : { published: true })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}