import { getCurrentUser } from '@/lib/action/auth'
import { getTeacherCourses } from '@/lib/action/teacher-courses'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Main page component for teacher's courses
export default async function TeacherCoursesPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login') // or wherever your login page is
  }

  // Optional: Check if user is a teacher
  if (user.role !== 'TEACHER') {
    redirect('/') // redirect non-teachers
  }else{
    redirect('/teacher/courses')
  } 

  // Fetch teacher's courses
  const courses = await getTeacherCourses()

  return (
    // Main container with padding and margin
    <div className="container mx-auto p-6">
      {/* Header section with title and create button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link 
          href="/teacher/courses/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Course
        </Link>
      </div>

      {/* Grid layout for courses list */}
      <div className="grid gap-4 mt-6">
        {/* Show message if no courses, otherwise map through courses */}
        {courses.length === 0 ? (
          <p>No courses yet. Create your first course!</p>
        ) : (
          courses.map((course) => (
            // Individual course card
            <div key={course.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              {/* Course status badge */}
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