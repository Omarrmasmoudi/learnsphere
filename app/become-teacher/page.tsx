import { redirect } from 'next/navigation'
import { BookOpen, BarChart2, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SphereBackground } from '@/components/sphere-background'
import { BecomeTeacherButton } from '@/components/teacher/become-teacher-button'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'

const perks = [
  { icon: BookOpen, text: 'Build courses with sections and video lessons' },
  { icon: Upload, text: 'Upload images and videos straight from your browser' },
  { icon: BarChart2, text: 'Track enrollments from your teacher dashboard' },
]

export default async function BecomeTeacherPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?next=/become-teacher')
  if (canTeach(user.role)) redirect('/teacher')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative">
      <SphereBackground />

      <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg relative">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">Teach on LearnSphere</CardTitle>
          <p className="text-gray-300">
            {user.name}, share what you know with learners everywhere.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <ul className="space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-gray-300">
                <span className="w-9 h-9 shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-500" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <BecomeTeacherButton />
        </CardContent>
      </Card>
    </div>
  )
}
