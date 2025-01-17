'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SphereBackground } from '../../components/sphere-background'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SphereBackground />
      
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader className="space-y-1 text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={() => router.push('/')}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            Log In
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
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-600 hover:text-purple-500">
              Create one
            </Link>
          </div>
          <p className="text-center text-xs text-gray-500">
            I accept LearnSphere&apos;s Terms of Use and Privacy Notice.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

