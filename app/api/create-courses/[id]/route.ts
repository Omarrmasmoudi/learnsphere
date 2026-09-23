import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/action/auth'

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId } = await params
    const existing = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true }
    })
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    if (existing.instructorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const data = Object.fromEntries(
      EDITABLE_FIELDS.filter((field) => field in body).map((field) => [field, body[field]])
    )
    if ('price' in data) data.price = Number(data.price)

    const course = await prisma.course.update({
      where: { id: courseId },
      data
    })

    return NextResponse.json(course)
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}
