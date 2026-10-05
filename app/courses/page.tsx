import { Suspense } from 'react'
import { CoursesNav } from '@/components/courses/courses-nav'
import { CourseFilters } from '@/components/courses/course-filters'
import { CourseResults, CourseResultsSkeleton } from '@/components/courses/course-results'
import { getCourseFilterOptions, parseCourseSearchParams } from '@/lib/data/course-search'
import type { CourseFilterOptions } from '@/lib/utils/course-filters'

const PAGE_SIZE = 12

interface CoursesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const rawParams = await searchParams
  const parsed = parseCourseSearchParams(rawParams)
  const params = { ...parsed, page: parsed.page ?? 1, limit: PAGE_SIZE }

  // Canonical query string: identifies the result set and keeps the filters
  // in pagination links
  const query = new URLSearchParams(
    Object.entries(rawParams).flatMap(([key, value]) =>
      value === undefined ? [] : [[key, Array.isArray(value) ? value[0] : value]]
    )
  ).toString()

  let filterOptions: CourseFilterOptions = { categories: [], levels: [], price: { min: 0, max: 0 } }
  try {
    filterOptions = await getCourseFilterOptions()
  } catch (error) {
    // Results render their own error; the sidebar still works without options
    console.error('Error fetching course filters:', error)
  }

  const heading = params.q ? `Results for "${params.q}"` : 'Courses to get you started'

  return (
    <div className="min-h-screen bg-black">
      <CoursesNav />
      <div className="flex flex-col md:flex-row pt-16">
        <aside className="w-full border-b md:w-[250px] md:fixed md:left-0 md:top-16 md:bottom-0 md:border-b-0 md:border-r bg-black border-purple-500/20 md:overflow-y-auto md:z-40">
          <CourseFilters options={filterOptions} />
        </aside>

        <main className="flex-1 md:ml-[250px] p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 break-words">{heading}</h1>
            {/* Re-keying on the query shows the skeleton while new results load */}
            <Suspense key={query} fallback={<CourseResultsSkeleton />}>
              <CourseResults params={params} query={query} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
