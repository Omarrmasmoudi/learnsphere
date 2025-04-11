import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/lib/action/auth'

export async function POST(request: Request) {
  try {
    // Get and verify token
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      console.log('No token provided')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify JWT and get user ID
    const payload = await verifyJwt(token)
    if (!payload) {
      console.log('Invalid token')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user directly from payload
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Get request body and validate
    const body = await request.json()
    const { title, description, price, image, category, duration, level, priceRange, sections, published } = body

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
          create: sections.map((section: any) => ({
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


// Check if user is a teacher
    // const teacher = await prisma.teacher.findFirst({
    //   where: {
    //     userId: user.id
    //   }
    // })

    // if (!teacher) {
    //   return NextResponse.json({ error: 'User is not a teacher' }, { status: 403 })
    // }
