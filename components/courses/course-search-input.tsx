'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/utils'

interface CourseSearchInputProps {
  /** Classes for the wrapping form (layout). */
  className?: string
  /** Classes for the input itself (colors/borders differ per navbar). */
  inputClassName?: string
}

// Navbar search box: submitting it opens the course listing filtered by the term.
export function CourseSearchInput({ className, inputClassName }: CourseSearchInputProps) {
  const router = useRouter()
  const [term, setTerm] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = term.trim()
    router.push(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
      <Input
        type="search"
        name="q"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for courses..."
        aria-label="Search for courses"
        maxLength={100}
        className={cn('w-full pl-10', inputClassName)}
      />
    </form>
  )
}
