'use server'

import { prisma } from '@/lib/prisma'
import {Course} from '@/lib/types/course'

export async function getCourses(): Promise<Course[]> {
  return prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      image: true,
      category: true,
      duration: true,
      level: true,
    }
  })
}


export async function getCoursesById(id: string): Promise<Course | null> {
  return prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
    }
  })
}

export async function enrollInCourse(courseId: string, userId: string) {
    return null
} 