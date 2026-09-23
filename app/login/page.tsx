'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SphereBackground } from '../../components/sphere-background'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Login successful!')
        const next = new URLSearchParams(window.location.search).get('next')
        // Only follow same-origin paths, never "//host" or absolute URLs
        router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/')
        router.refresh()
      } else {
        setError(data.error)
      }
    } catch (_err) {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <SphereBackground />

      {/* Login Card */}
      <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg relative">
        <CardHeader className="space-y-1 text-center relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={() => router.push('/')}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-3xl font-bold text-white">Log In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Between 8 and 72 characters</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Log In
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">or</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-white border-gray-600 hover:bg-gray-700"
            >
              <Image src="/placeholder.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
              Continue With Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-white border-gray-600 hover:bg-gray-700"
            >
              <Image src="/placeholder.svg" alt="Facebook" width={20} height={20} className="h-5 w-5" />
              Continue With Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-white">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-500 hover:text-purple-400">
              Create one
            </Link>
          </div>
          <div className="flex items-center justify-center text-xs text-gray-400">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="terms" className="ml-2">
              I accept LearnSphere&apos;s Terms of Use and Privacy Notice.
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
