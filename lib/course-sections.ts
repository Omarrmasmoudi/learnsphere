import type { Prisma } from '@prisma/client'

export interface VideoInput {
  id?: number
  title: string
  url: string
}

export interface SectionInput {
  id?: number
  title: string
  videos: VideoInput[]
}

const MAX_SECTIONS = 100
const MAX_VIDEOS_PER_SECTION = 200

function isId(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Validates a sections payload from a request body and copies only the known fields,
 * so clients can't smuggle columns like `sectionId` into Prisma writes.
 * Returns an error message instead when the payload is invalid.
 */
export function parseSections(value: unknown): SectionInput[] | string {
  if (!Array.isArray(value)) return 'sections must be an array'
  if (value.length > MAX_SECTIONS) return `A course can have at most ${MAX_SECTIONS} sections`

  const sections: SectionInput[] = []
  for (const [i, raw] of value.entries()) {
    const section = raw as Record<string, unknown> | null
    if (!section || typeof section.title !== 'string' || !section.title.trim()) {
      return `Section ${i + 1} needs a title`
    }
    if (section.id !== undefined && !isId(section.id)) return `Section ${i + 1} has an invalid id`
    const rawVideos = section.videos ?? []
    if (!Array.isArray(rawVideos)) return `Section ${i + 1} videos must be an array`
    if (rawVideos.length > MAX_VIDEOS_PER_SECTION) {
      return `A section can have at most ${MAX_VIDEOS_PER_SECTION} videos`
    }

    const videos: VideoInput[] = []
    for (const [j, rawVideo] of rawVideos.entries()) {
      const video = rawVideo as Record<string, unknown> | null
      const label = `Video ${j + 1} in section ${i + 1}`
      if (!video || typeof video.title !== 'string' || !video.title.trim()) return `${label} needs a title`
      if (!isHttpUrl(video.url)) return `${label} needs an uploaded file`
      if (video.id !== undefined && !isId(video.id)) return `${label} has an invalid id`
      videos.push({ ...(video.id !== undefined && { id: video.id as number }), title: video.title.trim(), url: video.url })
    }

    sections.push({
      ...(section.id !== undefined && { id: section.id as number }),
      title: section.title.trim(),
      videos,
    })
  }
  return sections
}

/** Nested-create input for a new course. Ids are ignored: everything is new. */
export function sectionsCreateInput(sections: SectionInput[]): Prisma.SectionCreateWithoutCourseInput[] {
  return sections.map((section) => ({
    title: section.title,
    videos: { create: section.videos.map(({ title, url }) => ({ title, url })) },
  }))
}

/**
 * Makes a course's sections match `sections` exactly, keeping the ids of rows that
 * still exist: rows with an id are updated, rows without one are created, and rows
 * missing from the list are deleted (videos cascade with their section).
 * Ids that don't belong to this course are rejected rather than touched.
 */
export async function syncCourseSections(
  tx: Prisma.TransactionClient,
  courseId: string,
  sections: SectionInput[]
): Promise<string | null> {
  const existing = await tx.section.findMany({
    where: { courseId },
    select: { id: true, videos: { select: { id: true } } },
  })
  const videoIdsBySection = new Map(existing.map((s) => [s.id, new Set(s.videos.map((v) => v.id))]))

  for (const section of sections) {
    if (section.id === undefined) continue
    const ownVideoIds = videoIdsBySection.get(section.id)
    if (!ownVideoIds) return 'A section does not belong to this course'
    if (section.videos.some((v) => v.id !== undefined && !ownVideoIds.has(v.id))) {
      return 'A video does not belong to its section'
    }
  }

  const keptSectionIds = sections.flatMap((s) => (s.id === undefined ? [] : [s.id]))
  await tx.section.deleteMany({ where: { courseId, id: { notIn: keptSectionIds } } })

  for (const section of sections) {
    if (section.id === undefined) {
      await tx.section.create({
        data: {
          courseId,
          title: section.title,
          videos: { create: section.videos.map(({ title, url }) => ({ title, url })) },
        },
      })
      continue
    }

    const keptVideoIds = section.videos.flatMap((v) => (v.id === undefined ? [] : [v.id]))
    await tx.section.update({ where: { id: section.id }, data: { title: section.title } })
    await tx.video.deleteMany({ where: { sectionId: section.id, id: { notIn: keptVideoIds } } })
    for (const video of section.videos) {
      if (video.id === undefined) {
        await tx.video.create({ data: { sectionId: section.id, title: video.title, url: video.url } })
      } else {
        await tx.video.update({ where: { id: video.id }, data: { title: video.title, url: video.url } })
      }
    }
  }
  return null
}
