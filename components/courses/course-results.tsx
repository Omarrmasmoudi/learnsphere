import Link from 'next/link'
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseCard } from '@/components/courses/course-card'
import { searchCourses, type CourseSearchParams } from '@/lib/data/course-search'
import { buildCoursesHref, describeFilters, hasActiveFilters } from '@/lib/utils/course-filters'

interface CourseResultsProps {
  params: CourseSearchParams & { page: number; limit: number }
  /** The raw URL params, used to build pagination links that keep the filters. */
  query: string
}

export async function CourseResults({ params, query }: CourseResultsProps) {
  let result
  try {
    result = await searchCourses(params)
  } catch (error) {
    console.error('Error searching courses:', error)
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-red-500 text-xl">Something went wrong. Please try again later.</p>
      </div>
    )
  }

  const { courses, total } = result
  const filtered = hasActiveFilters(params)
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const current = new URLSearchParams(query)

  if (!courses.length) {
    if (!filtered && total === 0) {
      return (
        <div className="flex justify-center items-center py-24">
          <p className="text-white text-xl">No courses available yet</p>
        </div>
      )
    }

    // Filters match something, but the page number is past the end
    const pastLastPage = total > 0
    return (
      <div className="flex flex-col items-center text-center py-24 px-4 border border-dashed border-purple-500/20 rounded-lg">
        <SearchX className="h-12 w-12 text-purple-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          {pastLastPage
            ? 'There are no courses on this page'
            : `No courses match ${describeFilters(params)}`}
        </h2>
        <p className="text-gray-400 mb-6 max-w-md">
          {pastLastPage
            ? 'Go back to the first page of results.'
            : 'Try a different keyword, widen the price range or pick another category.'}
        </p>
        <Button asChild className="bg-purple-600 hover:bg-purple-500 text-white">
          <Link href={pastLastPage ? buildCoursesHref(current, { page: null }) : '/courses'}>
            {pastLastPage ? 'Back to first page' : 'Clear filters'}
          </Link>
        </Button>
      </div>
    )
  }

  const first = (params.page - 1) * params.limit + 1
  const last = first + courses.length - 1

  return (
    <div>
      <p className="text-gray-400 mb-6" aria-live="polite">
        {total === 1 ? '1 course' : `${total} courses`}
        {filtered && ` matching ${describeFilters(params)}`}
        {totalPages > 1 && ` · showing ${first}-${last}`}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-4 mt-10 text-gray-300"
        >
          <PageLink
            href={buildCoursesHref(current, { page: params.page - 1 > 1 ? params.page - 1 : null })}
            disabled={params.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </PageLink>
          <span className="text-sm">
            Page {params.page} of {totalPages}
          </span>
          <PageLink
            href={buildCoursesHref(current, { page: params.page + 1 })}
            disabled={params.page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </PageLink>
        </nav>
      )}
    </div>
  )
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string
  disabled: boolean
  children: React.ReactNode
}) {
  const className = 'border-purple-500/20 bg-transparent text-gray-300 hover:bg-purple-500/10 hover:text-white'
  if (disabled) {
    return (
      <Button variant="outline" disabled className={className}>
        {children}
      </Button>
    )
  }
  return (
    <Button variant="outline" asChild className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export function CourseResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading courses">
      <Skeleton className="h-5 w-40 mb-6 bg-purple-500/10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-purple-500/20 overflow-hidden">
            <Skeleton className="aspect-video rounded-none bg-purple-500/10" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4 bg-purple-500/10" />
              <Skeleton className="h-4 w-1/2 bg-purple-500/10" />
              <Skeleton className="h-6 w-1/4 bg-purple-500/10" />
              <Skeleton className="h-10 w-full bg-purple-500/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
