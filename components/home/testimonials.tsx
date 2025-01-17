'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Alice Brown',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
    text: 'EduTech Innovations transformed my learning experience.'
  },
  {
    name: 'Michael Smith',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
    text: 'The platform\'s tools are intuitive and effective.'
  },
  {
    name: 'Sophia Lee',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
    text: 'Innovative features that boost student engagement.'
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length)
  }

  const previous = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative bg-purple-950 py-24 overflow-hidden">
      {/* Background diagonal lines */}
      <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:24px_24px]" />
      
      <div className="relative container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Hear from our awesome users!
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={previous}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

