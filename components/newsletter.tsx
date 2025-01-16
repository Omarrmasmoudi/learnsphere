'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Newsletter() {
  return (
    <section className="bg-white py-24">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h2>
        <form className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
            required
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}

