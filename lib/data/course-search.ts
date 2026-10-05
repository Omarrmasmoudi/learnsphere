import type { Course, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const COURSE_SORTS = ['newest', 'price-asc', 'price-desc', 'rating'] as const
export type CourseSort = (typeof COURSE_SORTS)[number]

export const MAX_QUERY_LENGTH = 100
export const MAX_PAGE_SIZE = 100

export interface CourseSearchParams {
  q?: string
  category?: string
  level?: string
  minPrice?: number
  maxPrice?: number
  sort: CourseSort
  /** 1-based. Only set when the caller asked for pagination. */
  page?: number
  limit?: number
}

export type CourseWithRating = Course & {
  averageRating: number | null
  ratingCount: number
}

export interface CourseSearchResult {
  courses: CourseWithRating[]
  total: number
}

export interface CourseFilterOptions {
  categories: string[]
  levels: string[]
  price: { min: number; max: number }
}

type RawParams = URLSearchParams | Record<string, string | string[] | undefined>

function readParam(params: RawParams, key: string): string | undefined {
  const value = params instanceof URLSearchParams ? params.get(key) : params[key]
  const single = Array.isArray(value) ? value[0] : value
  const trimmed = single?.trim()
  return trimmed ? trimmed : undefined
}

function parseNonNegative(value: string | undefined): number | undefined {
  if (value === undefined) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (value === undefined || !/^\d+$/.test(value)) return undefined
  const n = Number(value)
  return Number.isSafeInteger(n) && n > 0 ? n : undefined
}

/**
 * Turns raw query params into a safe search. Anything invalid is dropped
 * (falls back to the default) instead of failing the request.
 */
export function parseCourseSearchParams(params: RawParams): CourseSearchParams {
  const q = readParam(params, 'q')?.slice(0, MAX_QUERY_LENGTH)
  const category = readParam(params, 'category')?.slice(0, MAX_QUERY_LENGTH)
  const level = readParam(params, 'level')?.slice(0, MAX_QUERY_LENGTH)

  let minPrice = parseNonNegative(readParam(params, 'minPrice'))
  let maxPrice = parseNonNegative(readParam(params, 'maxPrice'))
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    ;[minPrice, maxPrice] = [maxPrice, minPrice]
  }

  const rawSort = readParam(params, 'sort')
  const sort = COURSE_SORTS.includes(rawSort as CourseSort) ? (rawSort as CourseSort) : 'newest'

  const rawPage = parsePositiveInt(readParam(params, 'page'))
  const rawLimit = parsePositiveInt(readParam(params, 'limit'))
  const paginate = rawPage !== undefined || rawLimit !== undefined

  return {
    q,
    category,
    level,
    minPrice,
    maxPrice,
    sort,
    page: paginate ? rawPage ?? 1 : undefined,
    limit: paginate ? Math.min(rawLimit ?? 12, MAX_PAGE_SIZE) : undefined,
  }
}

export function buildCourseWhere(params: CourseSearchParams): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = { published: true }

  if (params.q) {
    const contains = { contains: params.q, mode: 'insensitive' as const }
    where.OR = [
      { title: contains },
      { description: contains },
      { instructorName: contains },
      { category: contains },
    ]
  }
  if (params.category) {
    where.category = { equals: params.category, mode: 'insensitive' }
  }
  if (params.level) {
    where.level = { equals: params.level, mode: 'insensitive' }
  }
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    // price is an Int column, so round the bounds inwards
    where.price = {
      ...(params.minPrice !== undefined && { gte: Math.ceil(params.minPrice) }),
      ...(params.maxPrice !== undefined && { lte: Math.floor(params.maxPrice) }),
    }
  }

  return where
}

async function getRatingStats(courseIds: string[]) {
  if (!courseIds.length) return new Map<string, { avg: number | null; count: number }>()
  const groups = await prisma.rating.groupBy({
    by: ['courseId'],
    where: { courseId: { in: courseIds } },
    _avg: { rating: true },
    _count: { _all: true },
  })
  return new Map(
    groups.map((g) => [g.courseId, { avg: g._avg.rating, count: g._count._all }])
  )
}

function withRatings(
  courses: Course[],
  stats: Map<string, { avg: number | null; count: number }>
): CourseWithRating[] {
  return courses.map((course) => {
    const stat = stats.get(course.id)
    return {
      ...course,
      averageRating: stat?.avg != null ? Math.round(stat.avg * 10) / 10 : null,
      ratingCount: stat?.count ?? 0,
    }
  })
}

export async function searchCourses(params: CourseSearchParams): Promise<CourseSearchResult> {
  const where = buildCourseWhere(params)
  const skip = params.page && params.limit ? (params.page - 1) * params.limit : undefined
  const take = params.limit

  if (params.sort === 'rating') {
    // Prisma can't order by an aggregate of a relation, so rank the matching
    // ids by average rating here and only load the rows for the current page.
    const candidates = await prisma.course.findMany({
      where,
      select: { id: true, createdAt: true },
    })
    const stats = await getRatingStats(candidates.map((c) => c.id))
    const ranked = candidates.sort((a, b) => {
      const ra = stats.get(a.id)?.avg ?? -1
      const rb = stats.get(b.id)?.avg ?? -1
      if (rb !== ra) return rb - ra
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    const start = skip ?? 0
    const pageIds = ranked
      .slice(start, take !== undefined ? start + take : undefined)
      .map((c) => c.id)
    const rows = await prisma.course.findMany({ where: { id: { in: pageIds } } })
    const byId = new Map(rows.map((row) => [row.id, row]))
    const ordered = pageIds.flatMap((id) => byId.get(id) ?? [])
    return { courses: withRatings(ordered, stats), total: candidates.length }
  }

  const orderBy: Prisma.CourseOrderByWithRelationInput[] =
    params.sort === 'price-asc'
      ? [{ price: 'asc' }, { createdAt: 'desc' }]
      : params.sort === 'price-desc'
        ? [{ price: 'desc' }, { createdAt: 'desc' }]
        : [{ createdAt: 'desc' }]

  const [courses, total] = await Promise.all([
    prisma.course.findMany({ where, orderBy, skip, take }),
    prisma.course.count({ where }),
  ])
  const stats = await getRatingStats(courses.map((c) => c.id))
  return { courses: withRatings(courses, stats), total }
}

/** Distinct categories/levels and the price span of published courses. */
export async function getCourseFilterOptions(): Promise<CourseFilterOptions> {
  const published = { published: true }
  const [categories, levels, price] = await Promise.all([
    prisma.course.findMany({
      where: { ...published, category: { not: null } },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    }),
    prisma.course.findMany({
      where: { ...published, level: { not: null } },
      distinct: ['level'],
      select: { level: true },
      orderBy: { level: 'asc' },
    }),
    prisma.course.aggregate({
      where: published,
      _min: { price: true },
      _max: { price: true },
    }),
  ])

  const clean = (values: (string | null)[]) =>
    Array.from(new Set(values.map((v) => v?.trim()).filter((v): v is string => !!v)))

  return {
    categories: clean(categories.map((c) => c.category)),
    levels: clean(levels.map((l) => l.level)),
    price: { min: price._min.price ?? 0, max: price._max.price ?? 0 },
  }
}
