import { NavBar } from '@/components/layout/nav-bar'
import { CourseCard } from '@/components/courses/course-card'
import { CourseFilters } from '@/components/courses/course-filters'
import { courses } from '@/lib/data/courses'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="pt-16 flex">
        {/* Fixed sidebar */}
        <div className="w-64 fixed left-0 top-16 bottom-0 bg-black/95 border-r border-purple-500/20">
          <CourseFilters />
        </div>
        
        {/* Main content with left margin to account for fixed sidebar */}
        <main className="flex-1 ml-64 p-8">
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
        </main>
      </div>
    </div>
  )
}

