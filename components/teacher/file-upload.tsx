'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, Video, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUploadThing } from '@/lib/utils/uploadthing'

// Keep in sync with maxFileSize in lib/uploadthingConfig.ts
const MAX_SIZE_MB = { courseImage: 4, courseVideo: 512 } as const

interface FileUploadProps {
  /** UploadThing route from lib/uploadthingConfig.ts */
  endpoint: 'courseImage' | 'courseVideo'
  /** URL of the current file, or '' when none */
  value: string
  onChange: (url: string) => void
  /** Lets the parent block submitting while a file is still uploading */
  onUploadingChange?: (uploading: boolean) => void
}

export function FileUpload({ endpoint, value, onChange, onUploadingChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const isImage = endpoint === 'courseImage'

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: setProgress,
    onUploadError: (e) => {
      console.error('Upload failed:', e)
      // FORBIDDEN carries our own message from the route middleware; anything else is
      // an internal UploadThing error whose text isn't meant for users
      setError(e.code === 'FORBIDDEN' ? e.message : 'Upload failed. Please try again.')
    },
  })

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_SIZE_MB[endpoint] * 1024 * 1024) {
      setError(`That file is too large (max ${MAX_SIZE_MB[endpoint]} MB).`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setError('')
    setProgress(0)
    onUploadingChange?.(true)
    try {
      const result = await startUpload([file])
      const url = result?.[0]?.url
      if (url) onChange(url)
      else setError((current) => current || 'Upload failed. Please try again.')
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      onUploadingChange?.(false)
      // Allow picking the same file again after an error
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={isImage ? 'image/*' : 'video/*'}
        className="hidden"
        data-testid={`${endpoint}-input`}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value && !isUploading ? (
        <div className="flex items-center gap-4">
          {isImage ? (
            <Image
              src={value}
              alt="Course thumbnail"
              width={160}
              height={90}
              className="h-[90px] w-40 rounded-md object-cover border border-gray-600"
            />
          ) : (
            <video src={value} controls preload="metadata" className="h-[90px] w-40 rounded-md bg-black" />
          )}
          <Button
            type="button"
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-700"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            className="text-gray-400 hover:text-white"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          {isUploading ? (
            <div className="space-y-2" role="status">
              <p className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading... {progress}%
              </p>
              <div className="h-1.5 w-full rounded-full bg-gray-700">
                <div className="h-1.5 rounded-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
              onClick={() => inputRef.current?.click()}
            >
              {isImage ? <ImagePlus className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
              {isImage ? 'Upload Thumbnail' : 'Upload Video'}
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
