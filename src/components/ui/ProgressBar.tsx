'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = true, 
  animated = true 
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const percentageRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!animated) return

    // GSAP animation for smooth progress
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    if (percentageRef.current && showPercentage) {
      gsap.to(percentageRef.current, {
        textContent: `${Math.round(progress)}%`,
        duration: 0.3,
        ease: 'none',
        snap: { textContent: 1 }
      })
    }
  }, [progress, animated, showPercentage])

  return (
    <div ref={progressRef} className={`relative ${className}`}>
      {/* Progress bar container */}
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
        <div
          ref={fillRef}
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-lg relative"
          style={{
            width: '0%',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Percentage display */}
      {showPercentage && (
        <span
          ref={percentageRef}
          className="absolute -top-6 right-0 text-xs font-mono text-white/60"
        >
          {Math.round(progress)}%
        </span>
      )}
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-sm"
        style={{ 
          width: `${progress}%`,
          opacity: progress > 0 ? 0.6 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  )
}
