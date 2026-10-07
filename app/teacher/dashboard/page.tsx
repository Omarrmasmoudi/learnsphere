import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen, CheckCircle2, GraduationCap, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CourseEnrollmentsChart, MonthlyEnrollmentsChart } from "@/components/teacher/dashboard-charts"
import { getCurrentUser } from "@/lib/action/auth"
import { prisma } from "@/lib/prisma"

const MONTHS_SHOWN = 6
const COURSES_SHOWN = 8

/** The last `count` calendar months (UTC), oldest first, each with zero enrollments. */
function recentMonths(count: number, now = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - i), 1))
    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      month: date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      label: date.toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" }),
      enrollments: 0,
    }
  })
}

export default async function TeacherDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/teacher/dashboard")

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    select: {
      id: true,
      title: true,
      published: true,
      enrollments: { select: { userId: true, enrolledAt: true, completedAt: true, status: true } },
    },
  })

  const enrollments = courses.flatMap((course) => course.enrollments)
  const students = new Set(enrollments.map((e) => e.userId)).size
  const completed = enrollments.filter((e) => e.completedAt || e.status === "COMPLETED").length
  const completionRate = enrollments.length ? Math.round((completed / enrollments.length) * 100) : null

  const months = recentMonths(MONTHS_SHOWN)
  const byKey = new Map(months.map((m) => [m.key, m]))
  for (const { enrolledAt } of enrollments) {
    const bucket = byKey.get(`${enrolledAt.getUTCFullYear()}-${enrolledAt.getUTCMonth()}`)
    if (bucket) bucket.enrollments++
  }

  const perCourse = courses
    .map((course) => ({ course: course.title, enrollments: course.enrollments.length }))
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, COURSES_SHOWN)

  const stats = [
    { label: "Students", value: students.toLocaleString(), icon: Users },
    {
      label: "Published courses",
      value: `${courses.filter((c) => c.published).length.toLocaleString()} of ${courses.length.toLocaleString()}`,
      icon: BookOpen,
    },
    { label: "Enrollments", value: enrollments.length.toLocaleString(), icon: GraduationCap },
    { label: "Completion rate", value: completionRate === null ? "–" : `${completionRate}%`, icon: CheckCircle2 },
  ]

  return (
    <div className="page-container">
      <main className="container-padding pt-24">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="heading-1 mb-0">Teacher Dashboard</h1>
          <Button className="btn-primary" asChild>
            <Link href="/teacher/course-creation">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="card-base p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-purple-500/10">
                  <Icon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="text-2xl font-semibold text-white">{value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {courses.length === 0 ? (
          <Card className="card-base p-10 text-center">
            <p className="text-gray-300 mb-4">You haven&apos;t created any courses yet.</p>
            <Button className="btn-primary" asChild>
              <Link href="/teacher/course-creation">Create your first course</Link>
            </Button>
          </Card>
        ) : enrollments.length === 0 ? (
          <Card className="card-base p-10 text-center">
            <p className="text-gray-300">No enrollments yet. Charts will appear here once students enroll.</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-base p-6">
              <h2 className="heading-2">Enrollments per month</h2>
              <MonthlyEnrollmentsChart data={months.map(({ month, label, enrollments }) => ({ month, label, enrollments }))} />
            </Card>
            <Card className="card-base p-6">
              <h2 className="heading-2">
                Enrollments by course
                {courses.length > COURSES_SHOWN && (
                  <span className="ml-2 text-sm font-normal text-gray-400">top {COURSES_SHOWN}</span>
                )}
              </h2>
              <CourseEnrollmentsChart data={perCourse} />
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
