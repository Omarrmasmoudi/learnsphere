"use client"

import { useState } from "react"
import { NavBar } from "@/components/layout/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Plus, Trash2 } from "lucide-react"

export default function CreateCoursePage() {
  const [sections, setSections] = useState([{ title: "", lectures: [""] }])

  const addSection = () => {
    setSections([...sections, { title: "", lectures: [""] }])
  }

  const addLecture = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].lectures.push("")
    setSections(newSections)
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="container-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-1 text-white">Create New Course</h1>

          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="card-base p-6">
              <h2 className="heading-2 text-white">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label text-white">Course Title</label>
                  <Input className="form-input bg-purple-500/10 border-purple-500/20 text-white" placeholder="Enter course title" />
                </div>

                <div>
                  <label className="form-label text-white">Description</label>
                  <Textarea className="form-input bg-purple-500/10 border-purple-500/20 text-white min-h-[100px]" placeholder="Enter course description" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-white">Category</label>
                    <Select>
                      <SelectTrigger className="form-input bg-purple-500/10 border-purple-500/20 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-purple-500/20">
                        <SelectItem value="design" className="text-white">Design</SelectItem>
                        <SelectItem value="development" className="text-white">Development</SelectItem>
                        <SelectItem value="business" className="text-white">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label text-white">Level</label>
                    <Select>
                      <SelectTrigger className="form-input bg-purple-500/10 border-purple-500/20 text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-purple-500/20">
                        <SelectItem value="beginner" className="text-white">Beginner</SelectItem>
                        <SelectItem value="intermediate" className="text-white">Intermediate</SelectItem>
                        <SelectItem value="advanced" className="text-white">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="form-label text-white">Course Thumbnail</label>
                  <div className="border-2 border-dashed border-purple-500/20 rounded-lg p-8 text-center">
                    <Button variant="outline" className="mx-auto text-white border-purple-500/20 hover:bg-purple-500/10">
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Upload Thumbnail
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="card-base p-6">
              <h2 className="heading-2 text-white">Course Content</h2>
              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <div>
                      <label className="form-label text-white">Section Title</label>
                      <Input className="form-input bg-purple-500/10 border-purple-500/20 text-white" placeholder={`Section ${sectionIndex + 1} title`} />
                    </div>

                    <div className="space-y-4 pl-6">
                      {section.lectures.map((_, lectureIndex) => (
                        <div key={lectureIndex} className="flex gap-4">
                          <Input 
                            className="form-input bg-purple-500/10 border-purple-500/20 text-white" 
                            placeholder={`Lecture ${lectureIndex + 1} title`} 
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                            onClick={() => {
                              const newSections = [...sections]
                              newSections[sectionIndex].lectures.splice(lectureIndex, 1)
                              setSections(newSections)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="text-white border-purple-500/20 hover:bg-purple-500/10"
                        onClick={() => addLecture(sectionIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lecture
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="text-white border-purple-500/20 hover:bg-purple-500/10"
                  onClick={addSection}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </Card>

            {/* Price */}
            <Card className="card-base p-6">
              <h2 className="heading-2 text-white">Pricing</h2>
              <div>
                <label className="form-label text-white">Course Price (USD)</label>
                <Input type="number" className="form-input bg-purple-500/10 border-purple-500/20 text-white max-w-[200px]" placeholder="Enter price" />
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" className="text-white border-purple-500/20 hover:bg-purple-500/10">Save as Draft</Button>
              <Button className="bg-purple-500 text-white hover:bg-purple-600">Publish Course</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

