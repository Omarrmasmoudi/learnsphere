import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'

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

    interface VideoInput {
      title: string;
      url: string;
    }
    interface SectionInput {
      title: string;
      videos?: VideoInput[];
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
        sections: sections ? {
          create: sections.map((section: SectionInput) => ({
            title: section.title,
            videos: {
              create: section.videos
            }
          }))
        } : undefined
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

