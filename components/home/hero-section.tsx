import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent transform skew-y-6" />
      
      <div className="relative container px-4 py-32 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-up">
          Revolutionizing Learning with{' '}
          <span className="text-purple-500">Smart Technology</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8 animate-fade-up animation-delay-100">
          Transform your learning experience with personalized content, real-time analytics, and cutting-edge technology.
        </p>
        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 animate-fade-up animation-delay-200"
        >
          Join us now
        </Button>
      </div>
    </section>
  )
}

