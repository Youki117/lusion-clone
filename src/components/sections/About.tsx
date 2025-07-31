'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          {
            y: 60,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
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
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.4,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-transparent"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <div ref={titleRef}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
              Connecting Ideals to Uniquely Crafted Experiences
            </h2>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-6 mb-12">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              At Lusion, we don&apos;t follow trends for the sake of it. We believe in a different
              approach - one that&apos;s centered around you, your audience, and the art of creating
              a memorable, personalized experience.
            </p>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Our commitment goes beyond fleeting trends; it&apos;s about crafting tailor-made
              digital journeys that resonate uniquely and leave a lasting impact.
            </p>
          </div>

          {/* Call to Action */}
          <div ref={ctaRef}>
            <div className="mb-8">
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="block text-lg md:text-xl font-medium text-gray-600 mb-2">
                  Step into a new world
                </span>
                <span className="block">
                  and let your imagination run wild
                </span>
              </h3>
            </div>

            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Is Your Big Idea Ready to Go Wild?
                </h4>
                
                <motion.button
                  className="group relative overflow-hidden px-8 py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ y: -2 }}
                >
                  <span className="relative z-10">
                    Let&apos;s work together!
                  </span>
                  
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
          <span>CONTINUE TO SCROLL</span>
          <div className="w-8 h-px bg-gray-300"></div>
          <span>CONTINUE TO SCROLL</span>
        </div>
      </div>
    </section>
  )
}
