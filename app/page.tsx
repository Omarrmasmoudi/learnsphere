import { SiteNav } from '@/components/layout/site-nav'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { Testimonials } from '@/components/home/testimonials'
import { Newsletter } from '@/components/home/newsletter'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-black">
      <SiteNav />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}
