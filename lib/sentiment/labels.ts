// Pure helpers only: this module is imported by client components too.

export const SENTIMENT_LABELS = ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'] as const

// Tailwind classes per star rating, red (1) through green (5)
export const SENTIMENT_COLORS = [
  'bg-red-600',
  'bg-red-400',
  'bg-gray-400',
  'bg-green-400',
  'bg-green-600',
] as const

export function sentimentLabel(stars: number): string {
  return SENTIMENT_LABELS[Math.min(Math.max(Math.round(stars), 1), 5) - 1]
}

export type FeedbackSource = 'TEXT' | 'VOICE'

/** Shape returned by /api/courses/[id]/feedback. */
export interface CourseFeedbackView {
  id: number
  text: string
  source: FeedbackSource
  stars: number
  confidence: number
  scores: number[]
  updatedAt: string
}
