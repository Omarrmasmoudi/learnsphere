export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

import type { User } from '@prisma/client';

export interface UserWithRole extends User {
  role: UserRole;
}