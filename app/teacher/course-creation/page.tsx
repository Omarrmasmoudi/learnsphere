"use client"

import { useState } from "react"
import { NavBar } from "@/components/layout/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/lib/utils/uploadthing"

interface Section {
  title: string
  videos: Array<{
    title: string
    url: string
  }>
}
interface CourseFormData {
  title: string
  description: string
  category: string
  level: string
  price: number
  image: string
  sections: Section[]
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    image: "",
    sections: [
      {
        title: "",
        videos: [{ title: "", url: "" }],
      },
    ]
  })

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }
  
      const response = await fetch('/api/create-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          published: !isDraft
        }),
      })
  
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to create course')
      }
  
      const course = await response.json()
      router.push(`/courses/${course.id}`)
    } catch (error) {
      console.error('Error creating course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", videos: [] }]
    })
  }

  const addVideo = (sectionIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].videos.push({ title: "", url: "" })
    setFormData({ ...formData, sections: newSections })
  }

  const deleteSection = (sectionIndex: number) => {
    const newSections = [...formData.sections]
    newSections.splice(sectionIndex, 1)
    setFormData({ ...formData, sections: newSections })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number, videoIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
// Implement file upload logic here
// Example: const url = await uploadFile(file)
      const url = 'uploaded-file-url' // Replace with actual upload logic
      const newSections = [...formData.sections]
      newSections[sectionIndex].videos[videoIndex].url = url
      setFormData({ ...formData, sections: newSections })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <NavBar />
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Create New Course</h1>

          <div className="space-y-10">
            {/* Basic Information */}
            <Card className="border border-gray-700 bg-gray-800 shadow-lg">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Course Title</label>
                    <Input 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                      placeholder="Enter course title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Textarea 
                      className="bg-gray-700 border-gray-600 text-white mt-1 min-h-[100px]" 
                      placeholder="Enter course description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Category</label>
                      <Select
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border border-gray-600">
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Level</label>
                      <Select
                        onValueChange={(value) => setFormData({ ...formData, level: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border border-gray-600">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Course Thumbnail</label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mt-1">
                      <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Upload Thumbnail
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="border border-gray-700 bg-gray-800 shadow-lg">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Course Content</h2>
                <div className="space-y-6">
                  {formData.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-300">Section Title</label>
                          <Input
                            className="bg-gray-700 border-gray-600 text-white mt-1"
                            placeholder={`Section ${sectionIndex + 1} title`}
                            value={section.title}
                            onChange={(e) => {
                              const newSections = [...formData.sections]
                              newSections[sectionIndex].title = e.target.value
                              setFormData({ ...formData, sections: newSections })
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
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="Video title"
                                value={video.title}
                                onChange={(e) => {
                                  const newSections = [...formData.sections]
                                  newSections[sectionIndex].videos[videoIndex].title = e.target.value
                                  setFormData({ ...formData, sections: newSections })
                                }}
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  const newSections = [...formData.sections]
                                  newSections[sectionIndex].videos.splice(videoIndex, 1)
                                  setFormData({ ...formData, sections: newSections })
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Input 
                              type="file" 
                              accept="video/*" 
                              className="bg-gray-700 border-gray-600 text-white"
                              onChange={(e) => handleFileUpload(e, sectionIndex, videoIndex)}
                            />
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
              </div>
            </Card>

            {/* Price */}
            <Card className="border border-gray-700 bg-gray-800 shadow-lg">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Pricing</h2>
                <div>
                  <label className="text-sm font-medium text-gray-300">Course Price (USD)</label>
                  <Input 
                    type="number" 
                    className="bg-gray-700 border-gray-600 text-white mt-1 max-w-[200px]" 
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button 
                className="bg-purple-500 text-white hover:bg-purple-600"
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publish Course'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
