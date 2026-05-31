'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import type { Course } from '@prisma/client'

export async function getTeacherCourses(): Promise<Course[]> {
  const user = await getCurrentUser()
  
  if (!user) {
    return []
  }

  return await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      instructorId: true,
      instructorName: true,
      price: true,
      image: true,
      video: true,
      category: true,
      duration: true,
      level: true,
      published: true,
      priceRange: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

// Optional: Get a single course with detailed information
export async function getTeacherCourseById(courseId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      instructorId: user.id
    },
    include: {
      enrollments: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!course) {
    throw new Error('Course not found or unauthorized')
  }

  return course
}