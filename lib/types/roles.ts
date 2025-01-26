export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

import { User } from '@prisma/client';

export interface UserWithRole extends User {
  role: UserRole;
}