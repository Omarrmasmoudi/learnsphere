'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COUNTRIES } from '@/lib/data/countries'

interface ProfileFormProps {
  profile: { name: string; age: number | null; location: string; interests: string }
}

const inputClass = 'bg-gray-800 border-gray-700 text-white mt-1'

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({ ...profile, age: profile.age?.toString() ?? '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const update = (changes: Partial<typeof form>) => {
    setForm({ ...form, ...changes })
    setSaved(false)
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const age = form.age.trim() === '' ? null : Number(form.age)
    if (!form.name.trim()) return setError('Name is required.')
    if (age !== null && !(Number.isInteger(age) && age >= 1 && age <= 120)) {
      return setError('Age must be a whole number from 1 to 120.')
    }

    setSaving(true)
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, age, location: form.location, interests: form.interests }),
      })
      if (response.status === 401) {
        router.push('/login?next=/profile')
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Failed to save your profile')
      setSaved(true)
      // The nav greets the user by name, so re-render server components
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
          <Input id="name" className={inputClass} value={form.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="age" className="text-sm font-medium text-gray-300">Age</label>
          <Input
            id="age"
            type="number"
            min={1}
            max={120}
            className={inputClass}
            value={form.age}
            onChange={(e) => update({ age: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium text-gray-300">Country</label>
        <select
          id="location"
          className="mt-1 h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-sm text-white"
          value={form.location}
          onChange={(e) => update({ location: e.target.value })}
        >
          <option value="">Not specified</option>
          {/* Keep a stored value selectable even if it isn't in the current list */}
          {form.location && !(COUNTRIES as readonly string[]).includes(form.location) && (
            <option value={form.location}>{form.location}</option>
          )}
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="interests" className="text-sm font-medium text-gray-300">Interests</label>
        <Input
          id="interests"
          className={inputClass}
          placeholder="e.g. design, web development"
          value={form.interests}
          onChange={(e) => update({ interests: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && <p className="text-sm text-green-400">Profile saved.</p>}
        <Button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </Button>
      </div>
    </form>
  )
}
