'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function BecomeTeacherButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/become-teacher', { method: 'POST' })
      if (response.status === 401) {
        router.push('/login?next=/become-teacher')
        return
      }
      if (!response.ok) throw new Error()
      router.push('/teacher')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full bg-purple-500 text-white hover:bg-purple-600"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Setting up your teacher account...' : 'Start teaching'}
      </Button>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}
