import { NavBar } from "@/components/layout/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart2, BookOpen } from "lucide-react"

export default function TeacherLandingPage() {
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

