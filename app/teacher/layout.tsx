import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/action/auth'
import { canTeach } from '@/lib/auth/roles'

// Middleware already guarantees a session; this adds the role check, which needs the database.
// The API routes enforce the same rule on their own, so this is navigation, not the security boundary.
export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?next=/teacher')
  if (!canTeach(user.role)) redirect('/become-teacher')

  return children
}
