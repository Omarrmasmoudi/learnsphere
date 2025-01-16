'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { courses } from '@/data/courses'

export default function PaymentPage() {
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
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/courses" className="hover:text-white">
                Courses
              </Link>
              <span>/</span>
              <Link href={`/courses/${course.id}`} className="hover:text-white">
                Course Details
              </Link>
              <span>/</span>
              <span className="text-white">Payment</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-purple-50/5 border-purple-500/20 backdrop-blur-sm p-6">
                  <h1 className="text-2xl font-bold text-white mb-4">Payment Details</h1>
                  <p className="text-gray-400 mb-8">
                    Complete your purchase by providing your payment details
                  </p>

                  <div className="flex items-center gap-8 mb-8">
                    <img
                      src="/placeholder.svg?height=30&width=30"
                      alt="PayPal"
                      className="h-8"
                    />
                    <img
                      src="/placeholder.svg?height=30&width=30"
                      alt="Mastercard"
                      className="h-8"
                    />
                    <img
                      src="/placeholder.svg?height=30&width=30"
                      alt="Visa"
                      className="h-8"
                    />
                  </div>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card holder name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        className="bg-purple-900/20 border-purple-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card number
                      </label>
                      <Input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="bg-purple-900/20 border-purple-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry date
                        </label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          className="bg-purple-900/20 border-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Security code
                        </label>
                        <Input
                          type="text"
                          placeholder="XXX"
                          className="bg-purple-900/20 border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Country
                        </label>
                        <select className="w-full h-10 px-3 rounded-md bg-purple-900/20 border border-purple-500/20 text-white">
                          <option>Select Country</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Canada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Zip Code
                        </label>
                        <Input
                          type="text"
                          placeholder="XXXXX"
                          className="bg-purple-900/20 border-purple-500/20"
                        />
                      </div>
                    </div>
                  </form>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-purple-50/5 border-purple-500/20 backdrop-blur-sm p-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-purple-800/20 mb-6">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    by {course.instructor}
                  </p>

                  <div className="border-t border-purple-500/20 pt-6 mb-6">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>Original Price</span>
                      <span>${course.price} USD</span>
                    </div>
                    <div className="flex justify-between text-white font-bold">
                      <span>Total:</span>
                      <span>${course.price} USD</span>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-500 mb-4">
                    Buy Course
                  </Button>

                  <p className="text-center text-xs text-gray-400">
                    By completing your purchase you agree to these Terms of Service
                  </p>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    Payments are secured and encrypted
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

