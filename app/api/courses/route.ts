import { NextResponse } from 'next/server'
import { parseCourseSearchParams, searchCourses } from '@/lib/data/course-search'

// GET /api/courses
//   ?q=        case-insensitive match on title, description, instructor and category
//   ?category= ?level=   exact (case-insensitive) match
//   ?minPrice= ?maxPrice=
//   ?sort=     newest (default) | price-asc | price-desc | rating
//   ?page= ?limit=   optional pagination (limit is capped at 100)
//
// Invalid params are ignored rather than rejected. The body stays a plain array
// of courses so existing callers keep working; the total number of matches is
// sent in the X-Total-Count header.
export async function GET(request: Request) {
  try {
    const params = parseCourseSearchParams(new URL(request.url).searchParams)
    const { courses, total } = await searchCourses(params)

    const response = NextResponse.json(courses)
    response.headers.set('X-Total-Count', String(total))
    if (params.page !== undefined && params.limit !== undefined) {
      response.headers.set('X-Page', String(params.page))
      response.headers.set('X-Limit', String(params.limit))
    }
    return response
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
