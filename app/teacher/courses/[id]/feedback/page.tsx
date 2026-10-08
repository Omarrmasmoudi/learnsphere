import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Mic, MessageSquare } from 'lucide-react'
import { NavBar } from '@/components/layout/nav-bar'
import { Card } from '@/components/ui/card'
import { SentimentBreakdown } from '@/components/courses/sentiment-breakdown'
import { getCurrentUser } from '@/lib/action/auth'
import { prisma } from '@/lib/prisma'
import { SENTIMENT_COLORS, sentimentLabel } from '@/lib/sentiment/labels'

export default async function CourseFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=/teacher/courses/${id}/feedback`)

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      instructorId: true,
      feedback: {
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          text: true,
          source: true,
          stars: true,
          confidence: true,
          updatedAt: true,
          user: { select: { name: true } },
        },
      },
    },
  })

  // Same rule as the edit page: owners, plus admins
  if (!course || (course.instructorId !== user.id && user.role !== 'ADMIN')) {
    notFound()
  }

  const { feedback } = course
  const counts = [0, 0, 0, 0, 0]
  for (const entry of feedback) counts[entry.stars - 1]++
  const average = feedback.length > 0 ? feedback.reduce((sum, entry) => sum + entry.stars, 0) / feedback.length : null
  const positiveShare = feedback.length > 0 ? (counts[3] + counts[4]) / feedback.length : null

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <NavBar />
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <Link href="/teacher/courses" className="text-sm text-gray-400 hover:text-white">
              ← My courses
            </Link>
            <h1 className="text-4xl font-bold text-white mt-2">Student Feedback</h1>
            <p className="text-gray-400 mt-1">{course.title}</p>
          </div>

          {feedback.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-6 text-gray-300">
              No feedback yet. Students can leave written or spoken feedback from the course page, and it will show up
              here with its sentiment.
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <p className="text-sm text-gray-400">Responses</p>
                  <p className="text-3xl font-bold text-white">{feedback.length}</p>
                </Card>
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <p className="text-sm text-gray-400">Average sentiment</p>
                  <p className="text-3xl font-bold text-white">{average!.toFixed(1)} / 5</p>
                  <p className="text-sm text-gray-400">{sentimentLabel(average!)}</p>
                </Card>
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <p className="text-sm text-gray-400">Positive or very positive</p>
                  <p className="text-3xl font-bold text-white">{Math.round(positiveShare! * 100)}%</p>
                </Card>
              </div>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sentiment breakdown</h2>
                <SentimentBreakdown values={counts} format={(count) => String(count)} />
              </Card>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">All feedback</h2>
                {feedback.map((entry) => (
                  <Card key={entry.id} className="bg-gray-800 border-gray-700 p-5 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className={`w-2.5 h-2.5 rounded-full ${SENTIMENT_COLORS[entry.stars - 1]}`} />
                      <span className="font-medium text-white">
                        {sentimentLabel(entry.stars)} · {entry.stars}/5
                      </span>
                      <span className="text-gray-400">{Math.round(entry.confidence * 100)}% confidence</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        {entry.source === 'VOICE' ? <Mic className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        {entry.source === 'VOICE' ? 'Voice note' : 'Written'}
                      </span>
                      <span className="text-gray-500 ml-auto">
                        {entry.user.name} · {entry.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{entry.text}</p>
                  </Card>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
