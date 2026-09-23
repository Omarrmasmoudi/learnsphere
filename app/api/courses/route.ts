import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request) {
  try {
    // const url = new URL(request.url)
    // const showUnpublished = url.searchParams.get('unpublished') === 'true'
    const courses = await prisma.course.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}