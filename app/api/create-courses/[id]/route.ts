import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const body = await req.json()
    
    const course = await prisma.course.update({
      where: { id: courseId },
      data: body
    })

    return NextResponse.json(course)
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}