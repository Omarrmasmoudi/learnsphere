'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const categories = [
  'Logo Design',
  'Brand Identity',
  'Print',
  'Digital',
  'UI Design',
  'UX Design',
  'Motion Graphics',
  'App Design',
  'Game Design',
  'Product Design',
  'Gaming Design',
  'Architecture Design'
]

const levels = ['Basic', 'Mid-level', 'Advanced']
const durations = ['3-6 months', '6-12 months']
const priceRanges = ['$40-$100', '$100+', '$150']
const instructors = ['Microsoft', 'Meta', 'Apple']

export function CourseFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  return (
    <div className="h-full flex flex-col text-gray-300">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h2 className="font-semibold text-white">Filter By</h2>
        <select className="text-sm bg-purple-900/20 border border-purple-500/20 rounded-md px-2 py-1 text-gray-300">
          <option>Most Popular</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        <Accordion type="multiple" className="p-4 space-y-4">
          <AccordionItem value="categories" className="border-purple-500/20">
            <AccordionTrigger className="hover:text-white">All Courses</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category])
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          )
                        }
                      }}
                      className="border-purple-500/50 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor={category}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level" className="border-purple-500/20">
            <AccordionTrigger className="hover:text-white">Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {levels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={level}
                      className="border-purple-500/50 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor={level}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="duration" className="border-purple-500/20">
            <AccordionTrigger className="hover:text-white">Duration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {durations.map((duration) => (
                  <div key={duration} className="flex items-center space-x-2">
                    <Checkbox 
                      id={duration}
                      className="border-purple-500/50 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor={duration}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {duration}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-purple-500/20">
            <AccordionTrigger className="hover:text-white">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {priceRanges.map((price) => (
                  <div key={price} className="flex items-center space-x-2">
                    <Checkbox 
                      id={price}
                      className="border-purple-500/50 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor={price}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {price}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="instructor" className="border-purple-500/20">
            <AccordionTrigger className="hover:text-white">Instructor</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {instructors.map((instructor) => (
                  <div key={instructor} className="flex items-center space-x-2">
                    <Checkbox 
                      id={instructor}
                      className="border-purple-500/50 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor={instructor}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {instructor}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

