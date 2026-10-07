// Server-only client for sentiment-service/ (FastAPI). Browsers never talk to the service directly.

const SERVICE_URL = (process.env.SENTIMENT_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

// Whisper on CPU can take a while for a long voice note
const TIMEOUT_MS = 120_000

export interface SentimentResult {
  /** The analyzed text: what was typed, or the transcript of the recording */
  text: string
  stars: number
  confidence: number
  scores: number[]
}

export class SentimentServiceError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function callService(path: string, init: RequestInit): Promise<SentimentResult> {
  let response: Response
  try {
    response = await fetch(`${SERVICE_URL}${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    console.error('Sentiment service unreachable:', error)
    throw new SentimentServiceError('Feedback analysis is unavailable right now. Please try again later.', 503)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    // The service puts user-facing messages in `detail`; validation errors carry a list there instead
    const detail = typeof body?.detail === 'string' ? body.detail : null
    if (response.status >= 400 && response.status < 500) {
      throw new SentimentServiceError(detail ?? 'This feedback could not be analyzed.', response.status)
    }
    console.error('Sentiment service failed:', response.status, body)
    throw new SentimentServiceError('Feedback analysis failed. Please try again.', 502)
  }

  return response.json()
}

export function analyzeText(text: string) {
  return callService('/analyze/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

/**
 * `wav` must be 16-bit PCM WAV; the client records 16 kHz mono (see lib/utils/wav.ts).
 * Without `language` (a Whisper code such as "fr"), Whisper detects the spoken language.
 */
export function analyzeAudio(wav: ArrayBuffer, language?: string | null) {
  const query = language && /^[a-z]{2,3}$/.test(language) ? `?language=${language}` : ''
  return callService(`/analyze/audio${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'audio/wav' },
    body: wav,
  })
}
