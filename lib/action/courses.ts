'use server'

import { prisma } from '@/lib/prisma'
import { Course } from '@/lib/types'
import { revalidatePath } from 'next/cache'


// Course listing page
export async function getCourses() {
  const response = await fetch('/api/courses')
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  return response.json()
}


// Course detail page
export async function getCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course');
  }
}

export async function enrollInCourse(courseId: string, userId: number) {
  try {
    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'IN_PROGRESS',
        enrolledAt: new Date(),
      },
    });

    // Revalidate course page
    revalidatePath(`/courses/${courseId}`);
    
    return enrollment;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw new Error('Failed to enroll in course');
  }
}
