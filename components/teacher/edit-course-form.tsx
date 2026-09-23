'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Same options as the course creation form
const CATEGORIES = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'business', label: 'Business' },
]
const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

/** Keeps a stored value selectable even if it predates the current option list. */
function withCurrent(options: { value: string; label: string }[], current: string) {
  return current && !options.some((o) => o.value === current)
    ? [...options, { value: current, label: current }]
    : options
}

interface EditCourseFormProps {
  course: {
    id: string
    title: string
    description: string
    category: string
    level: string
    price: number
    published: boolean
  }
  sections: { id: number; title: string; videoCount: number }[]
}

export function EditCourseForm({ course, sections }: EditCourseFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({ ...course, price: String(course.price) })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const update = (changes: Partial<typeof form>) => {
    setForm({ ...form, ...changes })
    setSaved(false)
  }

  const handleSave = async () => {
    setError('')
    const price = Number(form.price)
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.')
      return
    }
    if (form.price.trim() === '' || !Number.isInteger(price) || price < 0) {
      setError('Price must be a whole number of dollars, 0 or more.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/create-courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category || null,
          level: form.level || null,
          price,
          published: form.published,
        }),
      })
      if (response.status === 401) {
        router.push(`/login?next=/teacher/courses/${course.id}/edit`)
        return
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save changes')
      }
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Basic Information */}
      <Card className="border border-gray-700 bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-gray-300">Course Title</label>
              <Input
                id="title"
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Enter course title"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
              <Textarea
                id="description"
                className="bg-gray-700 border-gray-600 text-white mt-1 min-h-[100px]"
                placeholder="Enter course description"
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Select value={form.category} onValueChange={(value) => update({ category: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600">
                    {withCurrent(CATEGORIES, course.category).map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Level</label>
                <Select value={form.level} onValueChange={(value) => update({ level: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600">
                    {withCurrent(LEVELS, course.level).map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Content (read-only: the API does not edit sections yet) */}
      <Card className="border border-gray-700 bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Course Content</h2>
          <p className="text-sm text-gray-400 mb-6">Sections can&apos;t be edited after creation yet.</p>
          {sections.length === 0 ? (
            <p className="text-gray-300">This course has no sections.</p>
          ) : (
            <ol className="space-y-3">
              {sections.map((section, index) => (
                <li
                  key={section.id}
                  className="flex items-center justify-between rounded-md border border-gray-700 px-4 py-3"
                >
                  <span className="text-white">
                    {index + 1}. {section.title || 'Untitled section'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {section.videoCount} {section.videoCount === 1 ? 'video' : 'videos'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </Card>

      {/* Price & visibility */}
      <Card className="border border-gray-700 bg-gray-800 shadow-lg">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-white">Pricing &amp; Visibility</h2>
          <div>
            <label htmlFor="price" className="text-sm font-medium text-gray-300">Course Price (USD)</label>
            <Input
              id="price"
              type="number"
              min={0}
              step={1}
              className="bg-gray-700 border-gray-600 text-white mt-1 max-w-[200px]"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="published"
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
              checked={form.published}
              onCheckedChange={(checked) => update({ published: checked })}
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-300">
              {form.published ? 'Published: visible in the course catalog' : 'Draft: only you can see it'}
            </label>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && <p className="text-sm text-green-400">Changes saved.</p>}
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-700"
          onClick={() => router.push('/teacher')}
          disabled={saving}
        >
          Back
        </Button>
        <Button
          className="bg-purple-500 text-white hover:bg-purple-600"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
