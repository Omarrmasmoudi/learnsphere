import { getCurrentUser } from '@/lib/action/auth'
import { getTeacherCourses } from '@/lib/action/teacher-courses'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Course } from '@prisma/client'

export default async function TeacherCoursesPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login') 
  }

  const role = user.teacher ? 'TEACHER' : user.admin ? 'ADMIN' : 'STUDENT';

  if (role !== 'TEACHER') {
    redirect('/')
  }

  // Now this is reachable
  const courses: Course[] = await getTeacherCourses()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link 
          href="/teacher/courses/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Course
        </Link>
      </div>

      <div className="grid gap-4 mt-6">
        {courses.length === 0 ? (
          <p>No courses yet. Create your first course!</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <div className="mt-2">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}