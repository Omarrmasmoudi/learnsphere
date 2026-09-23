import { notFound, redirect } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { EditCourseForm } from '@/components/teacher/edit-course-form'
import { getCurrentUser } from '@/lib/action/auth'
import { prisma } from '@/lib/prisma'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=/teacher/courses/${id}/edit`)

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      level: true,
      price: true,
      published: true,
      instructorId: true,
      sections: {
        orderBy: { id: 'asc' },
        select: { id: true, title: true, _count: { select: { videos: true } } }
      }
    }
  })

  // Same rule as PATCH /api/create-courses/[id]: owners, plus admins
  if (!course || (course.instructorId !== user.id && user.role !== 'ADMIN')) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <NavBar />
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Edit Course</h1>
          <EditCourseForm
            course={{
              id: course.id,
              title: course.title,
              description: course.description ?? '',
              category: course.category ?? '',
              level: course.level ?? '',
              price: course.price,
              published: course.published,
            }}
            sections={course.sections.map((section) => ({
              id: section.id,
              title: section.title,
              videoCount: section._count.videos,
            }))}
          />
        </div>
      </main>
    </div>
  )
}
