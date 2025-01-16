'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:24px_24px]" />
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your full name"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Between 8 and 72 characters</p>
          </div>
          
          <Button className="w-full bg-purple-600 hover:bg-purple-500">
            Sign Up
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <img src="/placeholder.svg?height=24&width=24" className="mr-2 h-4 w-4" />
              Continue With Google
            </Button>
            <Button variant="outline" className="w-full">
              <img src="/placeholder.svg?height=24&width=24" className="mr-2 h-4 w-4" />
              Continue With Facebook
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-500">
              Login
            </Link>
          </div>
          <Button className="text-center text-xs text-gray-500">b</Button>
          <p className="text-center text-xs text-gray-500">
            I accept LearnSphere&apos;s Terms of Use and Privacy Notice.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

