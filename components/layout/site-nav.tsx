import { getCurrentUser } from '@/lib/action/auth'
import { NavBar } from '@/components/layout/nav-bar'
import { NavBarL } from '@/components/layout/nav-barLoggedin'

/** The site header for the current visitor, resolved on the server so it never flashes the wrong state. */
export async function SiteNav() {
  const user = await getCurrentUser()
  return user ? <NavBarL user={user} /> : <NavBar />
}
