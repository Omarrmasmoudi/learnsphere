"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/layout/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Plus, Trash2, Save } from "lucide-react"
import { courses } from "@/lib/data/courses"

export default function EditCoursePage() {
  const params = useParams()
  const course = courses.find((c) => c.id === params.id)

  const [sections, setSections] = useState([
    {
      title: "Introduction",
      videos: [{ title: "Welcome", url: "https://example.com/video1.mp4" }],
    },
  ])

  const addSection = () => {
    setSections([...sections, { title: "", videos: [] }])
  }

  const addVideo = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].videos.push({ title: "", url: "" })
    setSections(newSections)
  }

  const deleteSection = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections.splice(sectionIndex, 1)
    setSections(newSections)
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-24 text-center text-white">
          <h1 className="text-2xl font-bold">Course not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="container-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="heading-1 mb-0">Edit Course</h1>
            <Button className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="card-base p-6">
              <h2 className="heading-2">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Course Title</label>
                  <Input className="form-input" placeholder="Enter course title" defaultValue={course.title} />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <Textarea className="form-input min-h-[100px]" placeholder="Enter course description" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <Select defaultValue={course.category || ''}>
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label">Level</label>
                    <Select defaultValue={course.level || ''}>
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Course Thumbnail</label>
                  <div className="border-2 border-dashed border-purple-500/20 rounded-lg p-8">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt="Current thumbnail"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <Button variant="outline">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Change Thumbnail
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="card-base p-6">
              <h2 className="heading-2">Course Content</h2>
              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <label className="form-label">Section Title</label>
                        <Input
                          className="form-input"
                          placeholder={`Section ${sectionIndex + 1} title`}
                          value={section.title}
                          onChange={(e) => {
                            const newSections = [...sections]
                            newSections[sectionIndex].title = e.target.value
                            setSections(newSections)
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="mt-7"
                        onClick={() => deleteSection(sectionIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 pl-6">
                      {section.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="grid gap-4">
                          <div className="flex gap-4">
                            <Input
                              className="form-input"
                              placeholder="Video title"
                              value={video.title}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[sectionIndex].videos[videoIndex].title = e.target.value
                                setSections(newSections)
                              }}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newSections = [...sections]
                                newSections[sectionIndex].videos.splice(videoIndex, 1)
                                setSections(newSections)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input type="file" accept="video/*" className="form-input" />
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => addVideo(sectionIndex)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Video
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </Card>

            {/* Price */}
            <Card className="card-base p-6">
              <h2 className="heading-2">Pricing</h2>
              <div>
                <label className="form-label">Course Price (USD)</label>
                <Input
                  type="number"
                  className="form-input max-w-[200px]"
                  placeholder="Enter price"
                  defaultValue={course.price}
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

