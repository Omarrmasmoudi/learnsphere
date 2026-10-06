import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SiteNav } from '@/components/layout/site-nav'
import { ProfileForm } from '@/components/profile/profile-form'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'
import { prisma } from '@/lib/prisma'

const ROLE_LABEL = { ADMIN: 'Admin', TEACHER: 'Teacher', STUDENT: 'Student' } as const

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?next=/profile')

  const profile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      age: true,
      location: true,
      interests: true,
      createdAt: true,
      enrollments: {
        orderBy: { enrolledAt: 'desc' },
        select: {
          enrolledAt: true,
          completedAt: true,
          course: { select: { id: true, title: true, image: true, instructorName: true } }
        }
      }
    }
  })

  return (
    <div className="page-container">
      <SiteNav />
      <main className="container-padding pt-24 max-w-4xl">
        <h1 className="heading-1">Your Profile</h1>

        <div className="grid gap-8">
          <Card className="card-base p-6">
            <h2 className="heading-2">Account</h2>
            <dl className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-gray-400">Email</dt>
                <dd className="text-white break-all">{user.email}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Role</dt>
                <dd className="text-white">{ROLE_LABEL[user.role]}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Member since</dt>
                <dd className="text-white">
                  {profile.createdAt.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-300">
              {canTeach(user.role) ? (
                <>
                  Manage your courses in the{' '}
                  <Link href="/teacher" className="text-purple-400 hover:text-purple-300">teacher portal</Link>.
                </>
              ) : (
                <>
                  Want to share what you know?{' '}
                  <Link href="/become-teacher" className="text-purple-400 hover:text-purple-300">Start teaching</Link>.
                </>
              )}
            </div>
          </Card>

          <Card className="card-base p-6">
            <h2 className="heading-2">Profile details</h2>
            <ProfileForm
              profile={{
                name: user.name,
                age: profile.age,
                location: profile.location ?? '',
                interests: profile.interests ?? '',
              }}
            />
          </Card>

          <Card className="card-base p-6">
            <h2 className="heading-2">My courses</h2>
            {profile.enrollments.length === 0 ? (
              <div className="text-gray-300">
                <p className="mb-4">You haven&apos;t enrolled in any courses yet.</p>
                <Button className="btn-primary" asChild>
                  <Link href="/courses">Browse courses</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-800">
                {profile.enrollments.map(({ course, enrolledAt, completedAt }) => (
                  <li key={course.id}>
                    <Link href={`/courses/${course.id}`} className="flex items-center gap-4 py-3 group">
                      <Image
                        src={course.image || '/placeholder.svg'}
                        alt=""
                        width={96}
                        height={54}
                        className="h-[54px] w-24 shrink-0 rounded object-cover bg-gray-800"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-white truncate group-hover:text-purple-300">{course.title}</p>
                        <p className="text-sm text-gray-400">
                          {course.instructorName} · enrolled {enrolledAt.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-xs rounded-full px-2 py-1 ${completedAt ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-300'}`}>
                        {completedAt ? 'Completed' : 'In progress'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
