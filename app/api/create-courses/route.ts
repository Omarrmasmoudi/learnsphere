import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/action/auth'

export async function POST(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a teacher
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId: user.id
      }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'User is not a teacher' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { title, description, price, image, category, duration, level, priceRange } = body

    // Validate required fields
    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create course
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
        instructorId: user.id
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}