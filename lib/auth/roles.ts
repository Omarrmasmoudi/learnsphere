import { prisma } from '../prisma'
import type { UserRole } from '../types/roles'

export async function isTeacher(userId: number) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId }
  });
  return !!teacher;
}

export async function isAdmin(userId: number) {
  const admin = await prisma.admin.findUnique({
    where: { userId }
  });
  return !!admin;
}

export async function getUserRole(userId: number): Promise<UserRole> {
  if (await isAdmin(userId)) return 'ADMIN';
  if (await isTeacher(userId)) return 'TEACHER';
  return 'STUDENT';
}