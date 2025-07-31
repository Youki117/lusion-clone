'use client'

import { useEffect, useRef } from 'react'

// Temporary CSS-based geometric background
export function GeometricBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating geometric shapes
    const shapes: HTMLDivElement[] = []
    const colors = ['#0066FF', '#FFFFFF', '#000000']

    for (let i = 0; i < 15; i++) {
      const shape = document.createElement('div')
      const isBox = Math.random() > 0.5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 20 + Math.random() * 40

      shape.style.position = 'absolute'
      shape.style.width = `${size}px`
      shape.style.height = `${size}px`
      shape.style.backgroundColor = color
      shape.style.left = `${Math.random() * 100}%`
      shape.style.top = `${Math.random() * 100}%`
      shape.style.opacity = '0.7'
      shape.style.borderRadius = isBox ? '0' : '50%'
      shape.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`
      shape.style.animationDelay = `${Math.random() * 2}s`
      shape.style.transform = `rotate(${Math.random() * 360}deg)`

      container.appendChild(shape)
      shapes.push(shape)
    }

    return () => {
      shapes.forEach(shape => {
        if (container.contains(shape)) {
          container.removeChild(shape)
        }
      })
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,102,255,0.1) 0%, rgba(255,255,255,0.1) 100%)'
        }}
      />
    </>
  )
}
