// Client-safe helpers for the course search URL (no Prisma imports here).

export const COURSE_SORTS = ['newest', 'price-asc', 'price-desc', 'rating'] as const
export type CourseSort = (typeof COURSE_SORTS)[number]

export const COURSE_SORT_LABELS: Record<CourseSort, string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Highest Rated',
}

export interface CourseFilterOptions {
  categories: string[]
  levels: string[]
  price: { min: number; max: number }
}

/** URL params that narrow the result set (sort and page don't). */
export const COURSE_FILTER_KEYS = ['q', 'category', 'level', 'minPrice', 'maxPrice'] as const
export type CourseFilterKey = (typeof COURSE_FILTER_KEYS)[number]

export interface ActiveCourseFilters {
  q?: string
  category?: string
  level?: string
  minPrice?: number
  maxPrice?: number
}

export function hasActiveFilters(filters: ActiveCourseFilters) {
  return COURSE_FILTER_KEYS.some((key) => filters[key] !== undefined)
}

/** e.g. `"react" in Development at Beginner level between $10 and $50` */
export function describeFilters(filters: ActiveCourseFilters) {
  const parts: string[] = []
  if (filters.q) parts.push(`"${filters.q}"`)
  if (filters.category) parts.push(`in ${filters.category}`)
  if (filters.level) parts.push(`at ${filters.level} level`)
  const { minPrice: min, maxPrice: max } = filters
  if (min !== undefined && max !== undefined) parts.push(`between $${min} and $${max}`)
  else if (min !== undefined) parts.push(`from $${min}`)
  else if (max !== undefined) parts.push(`up to $${max}`)
  return parts.join(' ')
}

/** Builds a /courses URL from the current params with some keys replaced. */
export function buildCoursesHref(
  current: URLSearchParams,
  updates: Record<string, string | number | null | undefined>
) {
  const params = new URLSearchParams(current)
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '') params.delete(key)
    else params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `/courses?${qs}` : '/courses'
}
