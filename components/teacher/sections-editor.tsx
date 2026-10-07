'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/teacher/file-upload'
import type { SectionInput } from '@/lib/course-sections'

// `key` is client-only: it keeps React rows and in-flight uploads attached to the
// right item when items before them are removed. `id` is the database id, if saved.
export interface EditableVideo { key: string; id?: number; title: string; url: string }
export interface EditableSection { key: string; id?: number; title: string; videos: EditableVideo[] }

let nextKey = 0
const newKey = () => `new-${++nextKey}`

export const emptyVideo = (): EditableVideo => ({ key: newKey(), title: '', url: '' })
export const emptySection = (): EditableSection => ({ key: newKey(), title: '', videos: [emptyVideo()] })

/** Adds client keys to sections loaded from the database. */
export function toEditableSections(sections: SectionInput[]): EditableSection[] {
  return sections.map((section) => ({
    ...section,
    key: `s-${section.id ?? newKey()}`,
    videos: section.videos.map((video) => ({ ...video, key: `v-${video.id ?? newKey()}` })),
  }))
}

/** Request body shape: strips client keys. */
export function toSectionsPayload(sections: EditableSection[]): SectionInput[] {
  return sections.map(({ id, title, videos }) => ({
    ...(id !== undefined && { id }),
    title,
    videos: videos.map(({ id: videoId, title: videoTitle, url }) => ({
      ...(videoId !== undefined && { id: videoId }),
      title: videoTitle,
      url,
    })),
  }))
}

/** First problem that would make the API reject these sections, or null. */
export function sectionsError(sections: EditableSection[]): string | null {
  for (const [i, section] of sections.entries()) {
    if (!section.title.trim()) return `Give section ${i + 1} a title.`
    for (const [j, video] of section.videos.entries()) {
      const name = video.title.trim() ? `"${video.title.trim()}"` : `video ${j + 1} in section ${i + 1}`
      if (!video.title.trim()) return `Give ${name} a title.`
      if (!video.url) return `Upload a file for ${name} or remove it.`
    }
  }
  return null
}

interface SectionsEditorProps {
  sections: EditableSection[]
  setSections: Dispatch<SetStateAction<EditableSection[]>>
  onUploadingChange?: (uploading: boolean) => void
}

export function SectionsEditor({ sections, setSections, onUploadingChange }: SectionsEditorProps) {
  const updateSection = (key: string, change: (section: EditableSection) => EditableSection) =>
    setSections((current) => current.map((s) => (s.key === key ? change(s) : s)))

  const updateVideo = (sectionKey: string, videoKey: string, change: Partial<EditableVideo>) =>
    updateSection(sectionKey, (s) => ({
      ...s,
      videos: s.videos.map((v) => (v.key === videoKey ? { ...v, ...change } : v)),
    }))

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={section.key} className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-300">Section Title</label>
              <Input
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder={`Section ${sectionIndex + 1} title`}
                value={section.title}
                onChange={(e) => updateSection(section.key, (s) => ({ ...s, title: e.target.value }))}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="mt-7"
              aria-label={`Remove section ${sectionIndex + 1}`}
              onClick={() => setSections((current) => current.filter((s) => s.key !== section.key))}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4 pl-6">
            {section.videos.map((video, videoIndex) => (
              <div key={video.key} className="grid gap-4">
                <div className="flex gap-4">
                  <Input
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Video title"
                    value={video.title}
                    onChange={(e) => updateVideo(section.key, video.key, { title: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    aria-label={`Remove video ${videoIndex + 1} from section ${sectionIndex + 1}`}
                    onClick={() =>
                      updateSection(section.key, (s) => ({
                        ...s,
                        videos: s.videos.filter((v) => v.key !== video.key),
                      }))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FileUpload
                  endpoint="courseVideo"
                  value={video.url}
                  onChange={(url) => updateVideo(section.key, video.key, { url })}
                  onUploadingChange={onUploadingChange}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => updateSection(section.key, (s) => ({ ...s, videos: [...s.videos, emptyVideo()] }))}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setSections((current) => [...current, emptySection()])}>
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>
    </div>
  )
}
