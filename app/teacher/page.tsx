"use client"

import { useEffect, useState } from 'react'
import { NavBar } from "@/components/layout/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CourseCard } from '@/components/courses/course-card'
import Link from "next/link"
import { Pencil, BarChart2, BookOpen } from "lucide-react"
import { Course } from '@/lib/types/course'

export default function TeacherLandingPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/teachercourses?unpublished=true')

        if (response.status === 401) {
          window.location.href = '/login?next=/teacher'
          return
        }
        if (response.status === 403) {
          window.location.href = '/become-teacher'
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(`Failed to fetch courses: ${response.statusText}`)
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <p className="text-white text-xl">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <p className="text-red-500 text-xl">Something went wrong. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!courses.length) {
    return (
      <div className="page-container">
        <NavBar />
        <main className="container-padding pt-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="heading-1">Welcome to Teacher Portal</h1>
            <p className="text-body text-lg mb-8">Choose what you would like to do today</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/teacher/course-creation">
              <Card className="card-base card-hover p-8 text-center h-full flex flex-col items-center justify-center group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">Create New Course</h2>
                <p className="text-white mb-6">
                  Start building your course content, upload materials, and set up your curriculum
                </p>
                <Button className="bg-purple-500 text-white hover:bg-purple-600">Get Started</Button>
              </Card>
            </Link>

            <Link href="/teacher/dashboard">
              <Card className="card-base card-hover p-8 text-center h-full flex flex-col items-center justify-center group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <BarChart2 className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">View Dashboard</h2>
                <p className="text-white mb-6">
                  Check your course statistics, student progress, and manage existing content
                </p>
                <Button className="bg-purple-500 text-white hover:bg-purple-600">Go to Dashboard</Button>
              </Card>
            </Link>
          </div>

          <div className="min-h-screen bg-black">
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
              <p className="text-white text-xl">No courses available yet</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="container-padding pt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="heading-1">Welcome to Teacher Portal</h1>
          <p className="text-body text-lg mb-8">Choose what you would like to do today</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/teacher/course-creation">
            <Card className="card-base card-hover p-8 text-center h-full flex flex-col items-center justify-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-4">Create New Course</h2>
              <p className="text-white mb-6">
                Start building your course content, upload materials, and set up your curriculum
              </p>
              <Button className="bg-purple-500 text-white hover:bg-purple-600">Get Started</Button>
            </Card>
          </Link>

          <Link href="/teacher/dashboard">
            <Card className="card-base card-hover p-8 text-center h-full flex flex-col items-center justify-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <BarChart2 className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-4">View Dashboard</h2>
              <p className="text-white mb-6">
                Check your course statistics, student progress, and manage existing content
              </p>
              <Button className="bg-purple-500 text-white hover:bg-purple-600">Go to Dashboard</Button>
            </Card>
          </Link>
        </div>

        {courses.length > 0 && (
          <div className="mt-16">
            <h2 className="heading-2 text-center mb-8">Your Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {courses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                  <Button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70" size="icon" asChild>
                    <Link href={`/teacher/courses/${course.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-12 p-6 bg-purple-500/5 rounded-lg border border-purple-500/10">
          <h3 className="text-lg font-semibold text-white mb-2 text-center">Need Help Getting Started?</h3>
          <p className="text-white text-center">
            Check out our comprehensive guide on creating engaging courses and managing your content effectively.
          </p>
        </div>
      </main>
    </div>
  )
}



