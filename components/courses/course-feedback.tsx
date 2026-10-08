'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Keyboard, Loader2, Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SentimentBreakdown } from '@/components/courses/sentiment-breakdown'
import { sentimentLabel, type CourseFeedbackView } from '@/lib/sentiment/labels'
import { blobToMonoSamples, encodeWav } from '@/lib/utils/wav'

const MAX_RECORDING_SECONDS = 60

type Access = 'loading' | 'signed-out' | 'not-allowed' | 'allowed'
type Mode = 'text' | 'voice'

export function CourseFeedback({ courseId }: { courseId: string }) {
  const [access, setAccess] = useState<Access>('loading')
  const [feedback, setFeedback] = useState<CourseFeedbackView | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/courses/${courseId}/feedback`)
        if (cancelled) return
        if (response.status === 401) return setAccess('signed-out')
        if (!response.ok) throw new Error('Failed to load feedback')
        const data = await response.json()
        if (cancelled) return
        setFeedback(data.feedback)
        setAccess(data.canLeaveFeedback ? 'allowed' : 'not-allowed')
      } catch (err) {
        console.error('Error:', err)
        if (!cancelled) setAccess('not-allowed')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [courseId])

  // Stop the microphone if the user navigates away mid-recording
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null
        recorder.stop()
        recorder.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  async function submit(body: BodyInit, contentType: string) {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch(`/api/courses/${courseId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body,
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error ?? 'Failed to submit feedback')
      setFeedback(data.feedback)
      setIsEditing(false)
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function startRecording() {
    setError(null)
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError('Microphone access was denied. Allow it in your browser, or type your feedback instead.')
      return
    }

    const chunks: Blob[] = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }
    recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop())
      try {
        const samples = await blobToMonoSamples(new Blob(chunks, { type: recorder.mimeType }))
        await submit(encodeWav(samples), 'audio/wav')
      } catch (err) {
        console.error('Error processing recording:', err)
        setError("Couldn't process the recording. Please try again.")
      }
    }

    recorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed((seconds) => seconds + 1), 1000)
  }

  /** Stops the microphone; the recording is submitted unless `discard` is set. */
  function stopRecording({ discard = false } = {}) {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      if (discard) {
        recorder.onstop = () => recorder.stream.getTracks().forEach((track) => track.stop())
      }
      recorder.stop()
    }
    recorderRef.current = null
    setIsRecording(false)
  }

  useEffect(() => {
    if (isRecording && elapsed >= MAX_RECORDING_SECONDS) stopRecording()
  }, [isRecording, elapsed])

  if (access === 'loading' || access === 'not-allowed') return null

  const showForm = access === 'allowed' && (!feedback || isEditing)

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Your Feedback</h2>
      <Card className="bg-purple-50/5 border-purple-500/20 backdrop-blur-sm p-6 space-y-4">
        {access === 'signed-out' && (
          <p className="text-gray-300">
            <Link href="/login" className="text-purple-500 hover:text-purple-400">
              Log in
            </Link>{' '}
            to tell the instructor what you think of this course.
          </p>
        )}

        {feedback && !isEditing && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">
                  {sentimentLabel(feedback.stars)} · {feedback.stars}/5
                </p>
                <p className="text-sm text-gray-400">
                  {Math.round(feedback.confidence * 100)}% confidence ·{' '}
                  {feedback.source === 'VOICE' ? 'from your voice note' : 'from your written feedback'}
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-purple-500/10"
                onClick={() => setIsEditing(true)}
              >
                Update
              </Button>
            </div>
            <blockquote className="border-l-2 border-purple-500/40 pl-4 text-gray-300 italic">
              {feedback.text}
            </blockquote>
            <SentimentBreakdown values={feedback.scores} />
          </>
        )}

        {showForm && (
          <>
            <p className="text-gray-300">
              Write or record a few sentences about this course. We&apos;ll analyze the overall sentiment and share
              it with the instructor.
            </p>

            <div className="flex gap-2">
              <Button
                variant={mode === 'text' ? 'default' : 'ghost'}
                className={mode === 'text' ? 'bg-purple-600 hover:bg-purple-500' : 'text-gray-300 hover:text-white hover:bg-purple-500/10'}
                onClick={() => setMode('text')}
                disabled={isRecording || isSubmitting}
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Write
              </Button>
              <Button
                variant={mode === 'voice' ? 'default' : 'ghost'}
                className={mode === 'voice' ? 'bg-purple-600 hover:bg-purple-500' : 'text-gray-300 hover:text-white hover:bg-purple-500/10'}
                onClick={() => setMode('voice')}
                disabled={isSubmitting}
              >
                <Mic className="w-4 h-4 mr-2" />
                Record
              </Button>
            </div>

            {mode === 'text' ? (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit(JSON.stringify({ text }), 'application/json')
                }}
              >
                <Textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="What did you like? What could be better?"
                  maxLength={2000}
                  rows={4}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500"
                  disabled={isSubmitting || text.trim().length < 3}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? 'Analyzing...' : 'Submit feedback'}
                </Button>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  Speak in any language, up to {MAX_RECORDING_SECONDS} seconds. Your recording is transcribed and
                  only the text is kept.
                </p>
                {isSubmitting ? (
                  <Button className="bg-purple-600" disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Transcribing and analyzing...
                  </Button>
                ) : isRecording ? (
                  <Button className="bg-red-600 hover:bg-red-500" onClick={() => stopRecording()}>
                    <Square className="w-4 h-4 mr-2" />
                    Stop and analyze ({elapsed}s)
                  </Button>
                ) : (
                  <Button className="bg-purple-600 hover:bg-purple-500" onClick={startRecording}>
                    <Mic className="w-4 h-4 mr-2" />
                    Start recording
                  </Button>
                )}
              </div>
            )}

            {feedback && (
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-purple-500/10"
                onClick={() => {
                  stopRecording({ discard: true })
                  setIsEditing(false)
                  setError(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </Card>
    </section>
  )
}
