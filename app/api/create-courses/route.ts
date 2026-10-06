import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'
import { parseSections, sectionsCreateInput } from '@/lib/course-sections'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!canTeach(user.role)) {
      return NextResponse.json({ error: 'Only teachers can create courses' }, { status: 403 })
    }

    // Get request body and validate
    const body = await request.json()
    const { title, description, price, image, category, duration, level, priceRange, sections, published } = body

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parsedSections = sections === undefined ? [] : parseSections(sections)
    if (typeof parsedSections === 'string') {
      return NextResponse.json({ error: parsedSections }, { status: 400 })
    }

    // Create course with sections if provided
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: Number(price),
        image,
        category,
        duration,
        level,
        priceRange,
        instructorName: user.name,
        instructorId: user.id,
        published: published || false,
        sections: { create: sectionsCreateInput(parsedSections) }
      },
      include: {
        sections: true
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error in course creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

