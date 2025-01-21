"use client"

import { NavBar } from "@/components/layout/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Users, BookOpen, DollarSign, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

const revenueData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 1398 },
  { month: "Mar", revenue: 9800 },
  { month: "Apr", revenue: 3908 },
  { month: "May", revenue: 4800 },
  { month: "Jun", revenue: 3800 },
]

const enrollmentData = [
  { course: "Advanced Logo Design", students: 120 },
  { course: "UI/UX Fundamentals", students: 98 },
  { course: "Motion Graphics", students: 86 },
  { course: "Brand Identity", students: 99 },
]

export default function TeacherDashboard() {
  return (
    <div className="page-container">
      <NavBar />
      <main className="container-padding pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-1 mb-0">Teacher Dashboard</h1>
          <Button className="btn-primary" asChild>
            <Link href="/teacher/create-course">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
          </Card>

          <Card className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-purple-500/10">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Courses</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </Card>

          <Card className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-purple-500/10">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$12,345</p>
              </div>
            </div>
          </Card>

          <Card className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">85%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="card-base p-6">
            <h2 className="heading-2">Revenue Overview</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="card-base p-6">
            <h2 className="heading-2">Course Enrollments</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="course" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="students" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

