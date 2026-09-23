import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { getUserRole } from '@/lib/auth/roles'
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session'

/** Id of the signed-in user, from the session cookie. Does not hit the database. */
export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value)
}

/** The signed-in user with their role, or null if there is no valid session. */
export async function getCurrentUser() {
  const userId = await getSessionUserId()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  })
  if (!user) return null

  return { ...user, role: await getUserRole(user.id) }
}
