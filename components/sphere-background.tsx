'use client'

import { useEffect, useRef } from 'react'

export function SphereBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let particles: { x: number; y: number; z: number; radius: number }[] = []
    const numParticles = 100
    const maxRadius = 2
    const perspective = 500

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 500,
        radius: Math.random() * maxRadius
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.z -= 1
        if (particle.z <= 0) {
          particle.z = 500
        }

        const scale = perspective / (perspective + particle.z)
        const x = particle.x * scale + canvas.width / 2
        const y = particle.y * scale + canvas.height / 2
        const radius = particle.radius * scale

        const opacity = scale * 0.5
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-black"
      style={{ opacity: 0.7 }}
    />
  )
}

