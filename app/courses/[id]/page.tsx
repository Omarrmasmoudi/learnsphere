'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, GraduationCap, Languages, Medal, PlayCircle, User } from 'lucide-react'
import { courses } from '@/data/courses'

export default function CourseDetailsPage() {
  const params = useParams()
  const course = courses.find(c => c.id === params.id)

  if (!course) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-24 text-center text-white">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <Link href="/courses" className="text-purple-500 hover:text-purple-400">
            Return to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      
      <main className="pt-16">
        <div className="relative bg-purple-900/20 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:24px_24px]" />
          
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-purple-800/20 mb-6">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {course.title}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-300 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>4,562 enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4" />
                    <span>4.7 (4602 Rating)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt={course.instructor}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{course.instructor}</p>
                    <p className="text-gray-400 text-sm">Course Instructor</p>
                  </div>
                </div>
              </div>

              <Card className="bg-purple-50/5 border-purple-500/20 backdrop-blur-sm p-6">
                <div className="text-3xl font-bold text-white mb-6">${course.price} USD</div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm">Instructor</p>
                      <p className="text-white">{course.instructor}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm">Duration</p>
                      <p className="text-white">{course.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <PlayCircle className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm">Lectures</p>
                      <p className="text-white">35</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm">Level</p>
                      <p className="text-white">{course.level}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Languages className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm">Language</p>
                      <p className="text-white">English</p>
                    </div>
                  </div>
                </div>

                <Link href={`/courses/${course.id}/payment`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 mb-4">
                    Enroll now
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">About This Course</h2>
                <p className="text-gray-300 leading-relaxed">
                  Master the art of {course.category} with our comprehensive course. Learn advanced techniques
                  and best practices. Perfect for designers looking to elevate their skills.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">What You&apos;ll Learn</h2>
                <ul className="grid gap-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    Create professional {course.category} projects
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    Master advanced techniques in your field
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    Develop a strong understanding of design principles
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    Create engaging content for various platforms
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

