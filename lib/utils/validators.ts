import { Course } from "@prisma/client";

export function isValidCourse(course:Partial<Course>): course is Course {
  return Boolean(
    course &&
    course.id &&
    course.title &&
    course.description &&
    course.instructorId &&
    course.price
  );
}