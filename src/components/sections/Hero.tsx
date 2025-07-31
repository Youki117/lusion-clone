'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { 
            y: 100,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.5
          }
        )
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 0.8
          }
        )
      }

      // Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          {
            y: 30,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 1.2
          }
        )

        // Floating animation for scroll indicator
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        })
      }

      // Parallax effect for hero section
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* 极星球背景 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/polar-star.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 深色遮罩以确保文字可读性 */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Main Title */}
          <div className="space-y-8">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight drop-shadow-lg"
            >
              We help brands create{' '}
              <span className="text-blue-300">digital experiences</span>{' '}
              that connect with their audience
            </h1>

            {/* Scroll to explore */}
            <div
              ref={scrollIndicatorRef}
              className="flex items-center space-x-2 text-sm text-gray-200"
            >
              <span>scroll to explore</span>
              <ChevronDown size={16} className="animate-bounce" />
            </div>
          </div>

          {/* Right side - 3D Scene area */}
          <div className="relative h-96 lg:h-full">
            {/* This space is for the 3D background to show through */}
          </div>
        </div>
      </div>

      {/* Scroll indicator at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
