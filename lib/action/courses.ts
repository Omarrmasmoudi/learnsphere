'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


// Course listing page
export async function getCourses() {
  const response = await fetch('/api/courses')
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  return response.json()
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
