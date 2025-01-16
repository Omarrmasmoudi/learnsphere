import { NavBar } from '@/components/nav-bar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { Testimonials } from '@/components/testimonials'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'

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

