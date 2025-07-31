'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ProgressBar } from './ProgressBar'
import { TentaclePet } from './TentaclePet'
import { SpaceWarpBackground } from './SpaceWarpBackground'
import '../../styles/starfield.css'

interface LoadingScreenProps {
  progress: number
  onComplete?: () => void
  isVisible?: boolean
}

export function LoadingScreen({ progress, onComplete, isVisible = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const progressContainerRef = useRef<HTMLDivElement>(null)

  const [animationStarted, setAnimationStarted] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'LUSION'

  // Typewriter effect
  useEffect(() => {
    if (!isVisible) return

    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        setShowCursor(false)
      }
    }, 150)

    return () => clearInterval(typeInterval)
  }, [isVisible])



  // Complete animation
  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/galaxy-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Tentacle Pet Background Animation - 调整到遮罩层之上 */}
      <TentaclePet opacity={0.8} className="z-10" />


      
      {/* Main content - more compact layout */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top section - Logo */}
        <div className="flex-none pt-12 pb-6 text-center">
          <div ref={logoRef} className="loading-logo-animated">
            <div className="text-3xl font-light tracking-[0.3em] text-white drop-shadow-lg">
              LUSION
            </div>
          </div>
        </div>

        {/* Middle section - Reduced spacer for astronaut */}
        <div className="flex-1 min-h-0"></div>

        {/* Bottom section - Text and Progress - more compact */}
        <div className="flex-none pb-16 text-center">
          {/* Brand text with typewriter effect */}
          <div ref={textRef} className="mb-16 loading-text-animated">
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider loading-text drop-shadow-xl">
              {displayText}
              {showCursor && displayText.length < fullText.length && (
                <span className="typewriter-cursor text-blue-400 ml-1">|</span>
              )}
            </h1>
            <p className="text-white/80 text-base mt-6 font-light tracking-wide drop-shadow-lg">
              Realise Your Creative Ideas
            </p>
          </div>

          {/* Progress bar - positioned closer to text */}
          <div ref={progressContainerRef} className="w-80 mx-auto loading-progress-animated">
            <ProgressBar progress={progress} className="mb-4 loading-progress" />
            <p className="text-white/60 text-sm font-mono text-center drop-shadow-md">
              Loading Experience... {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>


    </div>
  )
}
