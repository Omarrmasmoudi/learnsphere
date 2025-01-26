import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Course } from '@/lib/types/course';

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:border-purple-500/50 bg-black/50 border-purple-500/20 backdrop-blur-sm">
      <Link href={`/courses/${course.id}`}>
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            <Image
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4">Instructor ID: {course.instructorId}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">${course.price} USD</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-500">
            Enroll now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

