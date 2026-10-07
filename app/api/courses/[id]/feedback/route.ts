import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/action/auth'
import { analyzeAudio, analyzeText, SentimentServiceError, type SentimentResult } from '@/lib/sentiment/service'
import type { FeedbackSource } from '@/lib/sentiment/labels'

const MIN_TEXT_LENGTH = 3
const MAX_TEXT_LENGTH = 2000
const MAX_AUDIO_BYTES = 5 * 1024 * 1024 // ~2.5 minutes of 16 kHz mono WAV

const feedbackSelect = {
  id: true,
  text: true,
  source: true,
  stars: true,
  confidence: true,
  scores: true,
  updatedAt: true,
} as const

type Params = { params: Promise<{ id: string }> }

/** The signed-in user's own feedback for this course, and whether they may leave any. */
export async function GET(_request: Request, { params }: Params) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    select: { instructorId: true, published: true },
  })
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const feedback = await prisma.courseFeedback.findUnique({
    where: { userId_courseId: { userId, courseId: id } },
    select: feedbackSelect,
  })

  return NextResponse.json({
    feedback,
    canLeaveFeedback: course.published && course.instructorId !== userId,
  })
}

/**
 * Creates or replaces the user's feedback. Send either JSON `{ text }` or a 16-bit PCM WAV body
 * with `Content-Type: audio/wav` (optionally `?language=fr` to skip Whisper's language detection).
 */
export async function POST(request: Request, { params }: Params) {
  try {
    const userId = await getSessionUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
      select: { instructorId: true, published: true },
    })
    if (!course || !course.published) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    if (course.instructorId === userId) {
      return NextResponse.json({ error: "You can't leave feedback on your own course" }, { status: 403 })
    }

    let result: SentimentResult
    let source: FeedbackSource

    if (request.headers.get('content-type')?.startsWith('audio/wav')) {
      const audio = await request.arrayBuffer()
      if (audio.byteLength === 0) {
        return NextResponse.json({ error: 'Recording is empty' }, { status: 400 })
      }
      if (audio.byteLength > MAX_AUDIO_BYTES) {
        return NextResponse.json({ error: 'Recording is too long' }, { status: 413 })
      }
      const language = new URL(request.url).searchParams.get('language')
      result = await analyzeAudio(audio, language)
      source = 'VOICE'
    } else {
      const body = await request.json().catch(() => null)
      const text = typeof body?.text === 'string' ? body.text.trim() : ''
      if (text.length < MIN_TEXT_LENGTH || text.length > MAX_TEXT_LENGTH) {
        return NextResponse.json(
          { error: `Feedback must be between ${MIN_TEXT_LENGTH} and ${MAX_TEXT_LENGTH} characters` },
          { status: 400 }
        )
      }
      result = await analyzeText(text)
      source = 'TEXT'
    }

    const data = {
      text: result.text,
      source,
      stars: result.stars,
      confidence: result.confidence,
      scores: result.scores,
    }
    const feedback = await prisma.courseFeedback.upsert({
      where: { userId_courseId: { userId, courseId: id } },
      update: data,
      create: { ...data, userId, courseId: id },
      select: feedbackSelect,
    })

    return NextResponse.json({ feedback })
  } catch (error) {
    if (error instanceof SentimentServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error saving course feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
