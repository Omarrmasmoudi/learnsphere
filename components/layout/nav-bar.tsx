import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function NavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-purple-500/20">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="LearnSphere Logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-purple-500">LearnSphere</span>
        </Link>
        
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

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

