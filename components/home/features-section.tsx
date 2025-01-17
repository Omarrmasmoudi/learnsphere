import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, BarChart2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: BookOpen,
    category: 'Feature',
    title: 'Personalized Learning',
    description: 'Tailor educational content to individual learning styles and pace for optimized outcomes.'
  },
  {
    icon: BarChart2,
    category: 'Analytics',
    title: 'Engagement Metrics',
    description: 'Track and analyze student interactions to enhance engagement and improve teaching strategies.'
  },
  {
    icon: Shield,
    category: 'Security',
    title: 'Secure Data',
    description: 'Protect sensitive information with advanced encryption and secure data storage solutions.'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-black py-24">
      {/* Background diagonal lines */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:24px_24px]" />

      <div className="relative container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-600 p-2.5 mb-4">
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <div className="text-sm text-purple-400 mb-2">{feature.category}</div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="secondary" className="bg-purple-600/10 text-purple-400 hover:bg-purple-600/20">
            Explore features
          </Button>
        </div>
      </div>
    </section>
  )
}

