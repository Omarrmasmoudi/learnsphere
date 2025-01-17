import { NavBar } from '@/components/layout/nav-bar'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { Testimonials } from '@/components/home/testimonials'
import { Newsletter } from '@/components/home/newsletter'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-black">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}

