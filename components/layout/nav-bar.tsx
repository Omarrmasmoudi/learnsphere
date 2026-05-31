import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function NavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-purple-500/20">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="LearnSphere Logo" 
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-purple-500">LearnSphere</span>
        </Link>
        
        {/* Navigation & Search */}
        <div className="flex items-center gap-8 flex-1 max-w-2xl mx-8">
          <div className="hidden md:flex items-center gap-8">
            <Link href="/teacher" className="text-gray-300 hover:text-white transition-colors">
              Teacher
            </Link>
            <Link href="/courses" className="text-gray-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for courses..."
              className="w-full pl-10 bg-black/50 border-purple-500/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-purple-500/10"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-purple-500 text-white hover:bg-purple-600">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

