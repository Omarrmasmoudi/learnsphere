import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params
    const body = await req.json()
    
    const course = await prisma.course.update({
      where: { id: courseId },
      data: body
    })

    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}