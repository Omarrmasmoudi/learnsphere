'use client'
import { useState, useEffect } from 'react'
import { NavBar } from '@/components/layout/nav-bar'
import { NavBarL } from '@/components/layout/nav-barLoggedin'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { Testimonials } from '@/components/home/testimonials'
import { Newsletter } from '@/components/home/newsletter'
import { Footer } from '@/components/layout/footer'

interface User {
  name: string
}
export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error)
      }
    }
    fetchUser()
  }, [])
  return (
    <main className="min-h-screen bg-black text-black">
      {user ? <NavBarL user={user} /> : <NavBar />}
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}

