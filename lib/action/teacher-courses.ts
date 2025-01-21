'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function getTeacherCourses() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check if the user is a teacher
  const teacher = await prisma.teacher.findFirst({
    where: {
      userId: user.id
    }
  })

  if (!teacher) {
    throw new Error('User is not a teacher')
  }

  // Get all courses created by this teacher
  const courses = await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    include: {
      enrollments: {
        select: {
          _count: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return courses
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