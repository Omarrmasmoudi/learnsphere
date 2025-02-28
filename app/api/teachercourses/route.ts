import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/utils/userId'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      console.error('Authorization header not found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('Token not found in Authorization header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = Number(getUserIdFromToken(token))
    if (!userId) {
      console.error('Invalid token or user ID not found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const showUnpublished = url.searchParams.get('unpublished') === 'true'

    await prisma.$connect()
    const courses = await prisma.course.findMany({
      where: {
        instructorId: userId,
        ...(showUnpublished ? {} : { published: true })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log('Fetched courses:', courses)

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}