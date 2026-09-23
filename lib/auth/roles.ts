import type { UserRole } from '../types/roles'

// Pure helpers only: this module is imported by client components too.

/** Derives a role from the user's Teacher/Admin relations (loaded via `include`/`select`). */
export function roleFrom(user: { teacher: unknown; admin: unknown }): UserRole {
  if (user.admin) return 'ADMIN'
  if (user.teacher) return 'TEACHER'
  return 'STUDENT'
}

/** Admins can do anything a teacher can. */
export function canTeach(role: UserRole): boolean {
  return role === 'TEACHER' || role === 'ADMIN'
}
