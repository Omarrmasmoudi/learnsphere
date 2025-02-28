import { CoursesNav } from '@/components/courses/courses-nav'
import { CourseCard } from '@/components/courses/course-card'
import { CourseFilters } from '@/components/courses/course-filters'
import { Course } from '@/lib/types/course'
import { Suspense } from 'react'

export default async function CoursesPage() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('server response not JSON')
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData)
      throw new Error('Failed to fetch courses: ${response.statusText}')
    }

    const courses = await response.json() as Course[]

    if (!courses.length) {
      console.error('Error:', Error)
      return (
        <div className="min-h-screen bg-black">
          <CoursesNav />
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <p className="text-white text-xl">No courses available yet</p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-black">
        <CoursesNav />
        <div className="flex pt-16">
          <aside className="w-[250px] fixed left-0 top-16 bottom-0 bg-black border-r border-purple-500/20 overflow-y-auto z-40">
            <CourseFilters />
          </aside>
          
          <main className="flex-1 ml-[250px] p-8">
            <Suspense fallback={<div className="text-white">Loading courses...</div>}>
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">
                  Courses to get you started
                </h1>
  
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Recommended For You
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.slice(0, 4).map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Most Popular Courses
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.slice(4, 6).map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="min-h-screen bg-black">
        <CoursesNav />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <p className="text-red-500 text-xl">Something went wrong. Please try again later.</p>
        </div>
      </div>
    )
  }
}
