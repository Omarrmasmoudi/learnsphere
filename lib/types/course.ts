import { Prisma } from '@prisma/client'

export interface Course extends Prisma.CourseGetPayload<null> {
  id: string
  title: string
  description: string | null;
  instructorId: number
  price: number
  image: string | null
  video: string | null
  category: string | null
  duration: string | null
  level: string | null
  priceRange: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// export type CourseWithInstructor = Prisma.CourseGetPayload<{
//   include: { instructor: true }
// }>

