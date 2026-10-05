import { NextResponse } from 'next/server'
import { getCourseFilterOptions } from '@/lib/data/course-search'

// GET /api/courses/filters -> { categories, levels, price: { min, max } }
// Built from published courses, so the filter UI never offers dead options.
export async function GET() {
  try {
    return NextResponse.json(await getCourseFilterOptions())
  } catch (error) {
    console.error('Error fetching course filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course filters' },
      { status: 500 }
    )
  }
}
