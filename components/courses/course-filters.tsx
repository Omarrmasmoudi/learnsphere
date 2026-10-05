'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import {
  buildCoursesHref,
  COURSE_FILTER_KEYS,
  COURSE_SORT_LABELS,
  COURSE_SORTS,
  type CourseFilterOptions,
} from '@/lib/utils/course-filters'

interface CourseFiltersProps {
  options: CourseFilterOptions
}

type TextKey = 'q' | 'minPrice' | 'maxPrice'
const TEXT_KEYS: TextKey[] = ['q', 'minPrice', 'maxPrice']
const ALL = 'all'
const DEBOUNCE_MS = 400

const selectTriggerClass =
  'bg-purple-900/20 border-purple-500/20 text-gray-300 focus:ring-purple-500'
const selectContentClass = 'bg-black border-purple-500/20 text-gray-300'
const selectItemClass = 'focus:bg-purple-500/20 focus:text-white'
const inputClass =
  'bg-purple-900/20 border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500'

export function CourseFilters({ options }: CourseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Latest params, so a debounced flush never builds on a stale URL
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  // Free-text fields are local state while typing and reach the URL debounced
  const urlText = {
    q: searchParams.get('q') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  }
  const [text, setText] = useState<Record<TextKey, string>>(urlText)
  // What this component last wrote to the URL for each text field. A URL value
  // that differs from it came from elsewhere (navbar search, clear button, back
  // button) and must replace what's in the input.
  const flushedText = useRef<Record<TextKey, string>>({ ...urlText })
  const pending = useRef<Record<string, string | null>>({})

  useEffect(() => {
    const external: Partial<Record<TextKey, string>> = {}
    for (const key of TEXT_KEYS) {
      if (urlText[key] !== flushedText.current[key]) {
        flushedText.current[key] = urlText[key]
        external[key] = urlText[key]
      }
    }
    if (Object.keys(external).length) setText((prev) => ({ ...prev, ...external }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlText.q, urlText.minPrice, urlText.maxPrice])

  const flush = useCallback(
    (mode: 'push' | 'replace') => {
      const updates = pending.current
      pending.current = {}
      if (!Object.keys(updates).length) return
      for (const key of TEXT_KEYS) {
        if (key in updates) flushedText.current[key] = updates[key] ?? ''
      }
      // Any filter change invalidates the current page number
      const href = buildCoursesHref(new URLSearchParams(searchParamsRef.current), {
        ...updates,
        page: null,
      })
      router[mode](href, { scroll: false })
    },
    [router]
  )
  const debouncedFlush = useDebouncedCallback(() => flush('replace'), DEBOUNCE_MS)

  const handleTextChange = (key: TextKey, value: string) => {
    setText((prev) => ({ ...prev, [key]: value }))
    const trimmed = value.trim()
    pending.current[key] = trimmed || null
    debouncedFlush()
  }

  const handleSelectChange = (key: string, value: string) => {
    pending.current[key] = value === ALL ? null : value
    debouncedFlush.cancel()
    flush('push')
  }

  const clearFilters = () => {
    debouncedFlush.cancel()
    pending.current = Object.fromEntries(COURSE_FILTER_KEYS.map((key) => [key, null]))
    setText({ q: '', minPrice: '', maxPrice: '' })
    flush('push')
  }

  const category = searchParams.get('category') ?? ALL
  const level = searchParams.get('level') ?? ALL
  const sortParam = searchParams.get('sort')
  const sort = COURSE_SORTS.find((s) => s === sortParam) ?? 'newest'
  const hasFilters =
    COURSE_FILTER_KEYS.some((key) => searchParams.has(key)) ||
    TEXT_KEYS.some((key) => text[key].trim() !== '')

  // Keep a value from a shared link selectable even if no course uses it anymore
  const withCurrent = (values: string[], current: string) =>
    current !== ALL && !values.includes(current) ? [current, ...values] : values
  const categories = withCurrent(options.categories, category)
  const levels = withCurrent(options.levels, level)

  return (
    <div className="h-full flex flex-col text-gray-300">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h2 className="font-semibold text-white">Filter By</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-purple-400 hover:text-white hover:bg-purple-500/10"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="course-filter-q" className="text-gray-300">Keyword</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            <Input
              id="course-filter-q"
              type="search"
              value={text.q}
              onChange={(event) => handleTextChange('q', event.target.value)}
              placeholder="Title, instructor, topic..."
              maxLength={100}
              className={`pl-10 ${inputClass}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-filter-sort" className="text-gray-300">Sort by</Label>
          <Select value={sort} onValueChange={(value) => handleSelectChange('sort', value === 'newest' ? ALL : value)}>
            <SelectTrigger id="course-filter-sort" className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {COURSE_SORTS.map((value) => (
                <SelectItem key={value} value={value} className={selectItemClass}>
                  {COURSE_SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-filter-category" className="text-gray-300">Category</Label>
          <Select value={category} onValueChange={(value) => handleSelectChange('category', value)}>
            <SelectTrigger id="course-filter-category" className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value={ALL} className={selectItemClass}>All categories</SelectItem>
              {categories.map((value) => (
                <SelectItem key={value} value={value} className={selectItemClass}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-filter-level" className="text-gray-300">Level</Label>
          <Select value={level} onValueChange={(value) => handleSelectChange('level', value)}>
            <SelectTrigger id="course-filter-level" className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value={ALL} className={selectItemClass}>All levels</SelectItem>
              {levels.map((value) => (
                <SelectItem key={value} value={value} className={selectItemClass}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium leading-none text-gray-300 mb-2">
            Price (USD)
          </legend>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              aria-label="Minimum price"
              value={text.minPrice}
              onChange={(event) => handleTextChange('minPrice', event.target.value)}
              placeholder={`Min ${options.price.min}`}
              className={inputClass}
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              aria-label="Maximum price"
              value={text.maxPrice}
              onChange={(event) => handleTextChange('maxPrice', event.target.value)}
              placeholder={`Max ${options.price.max}`}
              className={inputClass}
            />
          </div>
        </fieldset>
      </div>
    </div>
  )
}
