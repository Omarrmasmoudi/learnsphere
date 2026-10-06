import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: {
        id: id,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    })

    // Drafts are visible only to their author and admins; everyone else gets the same 404
    // as a missing course, so draft ids can't be probed.
    if (course && !course.published) {
      const user = await getCurrentUser()
      if (!user || (user.id !== course.instructorId && user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
