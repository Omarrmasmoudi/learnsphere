import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface NavBarLProps {
  user: {
    name: string
  }
}



export function NavBarL({ user }: NavBarLProps) {
    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = '/login'}
    return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-purple-500/20">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="LearnSphere Logo" 
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

        {/* User Info */}
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {user.name}</span>
          <Link href="/profile">
            <Button 
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-purple-500/10"
            >
              Profile
            </Button>
          </Link>
          
            <Button className="bg-purple-500 text-white hover:bg-purple-600" onClick={handleLogout}>
              Logout
            </Button>
          
        </div>
      </nav>
    </header>
  )
}

