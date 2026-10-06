import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'
import { parseSections, syncCourseSections } from '@/lib/course-sections'

const EDITABLE_FIELDS = [
  'title',
  'description',
  'price',
  'image',
  'category',
  'duration',
  'level',
  'priceRange',
  'video',
  'published',
] as const

class SectionsError extends Error {}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!canTeach(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: courseId } = await params
    const existing = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true }
    })
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    // Teachers edit their own courses; admins can edit any
    if (existing.instructorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const data = Object.fromEntries(
      EDITABLE_FIELDS.filter((field) => field in body).map((field) => [field, body[field]])
    )
    if ('price' in data) data.price = Number(data.price)

    const sections = 'sections' in body ? parseSections(body.sections) : undefined
    if (typeof sections === 'string') {
      return NextResponse.json({ error: sections }, { status: 400 })
    }

    const course = await prisma.$transaction(async (tx) => {
      if (sections) {
        const syncError = await syncCourseSections(tx, courseId, sections)
        // Thrown to roll back; turned into a 400 below
        if (syncError) throw new SectionsError(syncError)
      }
      return tx.course.update({
        where: { id: courseId },
        data,
        // Returned so the editor learns the ids of newly created sections and videos
        include: {
          sections: {
            orderBy: { id: 'asc' },
            select: {
              id: true,
              title: true,
              videos: { orderBy: { id: 'asc' }, select: { id: true, title: true, url: true } }
            }
          }
        }
      })
    })

    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof SectionsError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}
