import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CourseSearchInput } from '@/components/courses/course-search-input'

export function CoursesNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 border-b">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="LearnSphere Logo" 
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-purple-600">LearnSphere</span>
        </Link>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <CourseSearchInput
            className="w-full"
            inputClassName="bg-gray-50 border-gray-200 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

