'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AstronautSVGProps {
  progress: number
  className?: string
}

export function AstronautSVG({ progress, className = '' }: AstronautSVGProps) {
  const astronautRef = useRef<SVGSVGElement>(null)

  // Natural weightless floating animation for SVG elements
  useEffect(() => {
    if (!astronautRef.current) return

    const ctx = gsap.context(() => {
      // Gentle vertical floating - like floating in zero gravity
      gsap.to(astronautRef.current, {
        y: -2,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      // Very subtle rotation for natural weightless feel
      gsap.to(astronautRef.current, {
        rotation: 0.8,
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      // Minimal horizontal drift
      gsap.to(astronautRef.current, {
        x: 1,
        duration: 11,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      // Subtle scale breathing effect for life-like feel
      gsap.to(astronautRef.current, {
        scale: 1.005,
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }, astronautRef)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={astronautRef}
      viewBox="0 0 300 400"
      className={`w-full h-full ${className}`}
      style={{
        filter: `
          drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))
          drop-shadow(0 0 60px rgba(147, 51, 234, 0.6))
          drop-shadow(0 0 90px rgba(255, 255, 255, 0.4))
          drop-shadow(0 0 120px rgba(0, 255, 255, 0.2))
        `
      }}
    >

      {/* Astronaut body - back view */}
      <ellipse cx="150" cy="220" rx="55" ry="70" fill="url(#bodyBackGradient)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>

      {/* Helmet - back view */}
      <ellipse cx="150" cy="120" rx="60" ry="62" fill="url(#helmetBackGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>

      {/* Helmet back panel - main control unit */}
      <rect x="125" y="80" width="50" height="25" rx="12" fill="url(#backPanelGradient)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2"/>

      {/* Status indicators on helmet back */}
      <circle cx="135" cy="92" r="5" fill="rgba(34, 197, 94, 0.9)">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="150" cy="92" r="5" fill="rgba(239, 68, 68, 0.9)">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="165" cy="92" r="5" fill="rgba(59, 130, 246, 0.9)">
        <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1.8s" repeatCount="indefinite"/>
      </circle>

      {/* Helmet communication array */}
      <rect x="140" y="105" width="20" height="4" rx="2" fill="rgba(255,255,255,0.7)"/>
      <rect x="145" y="110" width="10" height="2" rx="1" fill="rgba(0, 255, 255, 0.8)"/>

      {/* Arms - back view */}
      <ellipse cx="95" cy="200" rx="18" ry="35" fill="url(#bodyBackGradient)" transform="rotate(-15 95 200)"/>
      <circle cx="90" cy="180" r="10" fill="url(#jointGradient)"/>
      <ellipse cx="205" cy="200" rx="18" ry="35" fill="url(#bodyBackGradient)" transform="rotate(15 205 200)"/>
      <circle cx="210" cy="180" r="10" fill="url(#jointGradient)"/>

      {/* Legs - back view */}
      <ellipse cx="130" cy="275" rx="18" ry="35" fill="url(#bodyBackGradient)"/>
      <ellipse cx="170" cy="275" rx="18" ry="35" fill="url(#bodyBackGradient)"/>
      <ellipse cx="130" cy="305" rx="22" ry="12" fill="url(#bootGradient)"/>
      <ellipse cx="170" cy="305" rx="22" ry="12" fill="url(#bootGradient)"/>

      {/* Enhanced back life support system */}
      <rect x="105" y="175" width="90" height="60" rx="15" fill="url(#backpackGradient)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3"/>

      {/* Status bars with animations */}
      <rect x="112" y="185" width="76" height="6" rx="3" fill="rgba(34, 197, 94, 0.9)">
        <animate attributeName="width" values="76;60;76" dur="3s" repeatCount="indefinite"/>
      </rect>
      <rect x="112" y="195" width="65" height="6" rx="3" fill="rgba(239, 68, 68, 0.9)">
        <animate attributeName="width" values="65;50;65" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      <rect x="112" y="205" width="70" height="6" rx="3" fill="rgba(59, 130, 246, 0.9)">
        <animate attributeName="width" values="70;55;70" dur="2.8s" repeatCount="indefinite"/>
      </rect>
      <rect x="112" y="215" width="58" height="6" rx="3" fill="rgba(0, 255, 255, 0.9)">
        <animate attributeName="width" values="58;45;58" dur="3.2s" repeatCount="indefinite"/>
      </rect>

      {/* Control buttons with pulsing animations */}
      <circle cx="120" cy="230" r="8" fill="rgba(34, 197, 94, 0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="150" cy="230" r="8" fill="rgba(239, 68, 68, 0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="180" cy="230" r="8" fill="rgba(59, 130, 246, 0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1.8s" repeatCount="indefinite"/>
      </circle>

      {/* Additional technical details */}
      <rect x="115" y="245" width="20" height="3" rx="1" fill="rgba(255,255,255,0.6)"/>
      <rect x="140" y="245" width="15" height="3" rx="1" fill="rgba(255,255,255,0.6)"/>
      <rect x="160" y="245" width="25" height="3" rx="1" fill="rgba(255,255,255,0.6)"/>

      {/* Enhanced Gradients for Back View */}
      <defs>
        <radialGradient id="helmetBackGradient" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="rgba(220,220,230,0.95)"/>
          <stop offset="40%" stopColor="rgba(180,180,200,0.9)"/>
          <stop offset="80%" stopColor="rgba(140,140,160,0.8)"/>
          <stop offset="100%" stopColor="rgba(100,100,120,0.7)"/>
        </radialGradient>
        <linearGradient id="backPanelGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(100,100,120,0.9)"/>
          <stop offset="50%" stopColor="rgba(80,80,100,0.8)"/>
          <stop offset="100%" stopColor="rgba(60,60,80,0.7)"/>
        </linearGradient>
        <linearGradient id="bodyBackGradient" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="rgba(230,230,230,0.95)"/>
          <stop offset="30%" stopColor="rgba(190,190,190,0.9)"/>
          <stop offset="70%" stopColor="rgba(150,150,150,0.8)"/>
          <stop offset="100%" stopColor="rgba(110,110,110,0.7)"/>
        </linearGradient>
        <radialGradient id="jointGradient">
          <stop offset="0%" stopColor="rgba(170,170,170,0.9)"/>
          <stop offset="100%" stopColor="rgba(100,100,100,0.8)"/>
        </radialGradient>
        <linearGradient id="bootGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(80,80,80,0.9)"/>
          <stop offset="100%" stopColor="rgba(40,40,40,0.8)"/>
        </linearGradient>
        <linearGradient id="backpackGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(120,120,140,0.9)"/>
          <stop offset="50%" stopColor="rgba(100,100,120,0.8)"/>
          <stop offset="100%" stopColor="rgba(80,80,100,0.7)"/>
        </linearGradient>

      </defs>
    </svg>
  )
}
