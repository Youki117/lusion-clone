'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function BeyondVisions() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const curveRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Content animation
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Parallax effect for the section
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      }

      // Blue curve growing animation with scroll
      if (curveRef.current) {
        const curvePath = curveRef.current.querySelector('path')
        if (curvePath) {
          // Get the total length of the path
          const pathLength = curvePath.getTotalLength()

          // Set initial state - path is invisible
          gsap.set(curvePath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
          })

          // Animate the path drawing based on scroll
          gsap.to(curvePath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 1,
              onUpdate: (self) => {
                // Additional curve growth effect
                const progress = self.progress
                gsap.set(curveRef.current, {
                  scaleX: 0.3 + (progress * 0.7),
                  transformOrigin: 'left center'
                })
              }
            }
          })
        }
      }


    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-transparent overflow-hidden"
    >
      {/* Blue decorative curve */}
      <div
        ref={curveRef}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2/3 h-96"
      >
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full"
          fill="none"
        >
          <path
            d="M0,200 Q200,50 400,200 Q600,350 800,200"
            stroke="#3B82F6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>



      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Title */}
          <div className="space-y-8">
            <h2
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-tight drop-shadow-lg"
            >
              <span className="block text-lg md:text-xl font-medium text-gray-300 mb-4">
                Beyond Visions
              </span>
              <span className="block">
                Within Reach
              </span>
            </h2>
          </div>

          {/* Right side - Content */}
          <div ref={contentRef} className="space-y-8">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Lusion is a digital production studio that brings your ideas to life through
              visually captivating designs and interactive experiences. With our talented team,
              we push the boundaries by solving complex problems, delivering tailored solutions
              that exceed expectations and engage audiences.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors duration-200"
            >
              <span>About us</span>
              <ChevronDown size={16} className="rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gray-900 rounded-full"></div>
      </div>
    </section>
  )
}
