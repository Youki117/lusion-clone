'use client'

import React, { useEffect, useRef, useState } from 'react'

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create stars - 增加星星数量让星空更丰富
    const stars: Array<{ x: number; y: number; size: number; opacity: number; baseOpacity: number }> = []
    const numStars = 600
    let animationId: number

    const initStars = () => {
      stars.length = 0 // 清空现有星星
      for (let i = 0; i < numStars; i++) {
        const baseOpacity = Math.random() * 0.6 + 0.3
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          opacity: baseOpacity,
          baseOpacity: baseOpacity
        })
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars() // 重新生成星星位置
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // 改进的闪烁效果
        const twinkleSpeed = 0.015
        const variation = (Math.sin(Date.now() * 0.001 + star.x * 0.01) + 1) * 0.5
        star.opacity = star.baseOpacity + variation * 0.4
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: '#000000' }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#000000' }}
    />
  )
}
