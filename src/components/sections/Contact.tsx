'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ChevronDown } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
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
              trigger: contentRef.current,
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
        <div ref={contentRef} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Ready to bring your vision to life? Let&apos;s start a conversation
                  about your next project.
                </p>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Visit Us
                </h3>
                <address className="text-gray-300 not-italic leading-relaxed">
                  Suite 2<br />
                  9 Marsh Street<br />
                  Bristol, BS1 4AA<br />
                  United Kingdom
                </address>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    General enquires
                  </h4>
                  <a 
                    href="mailto:hello@lusion.co"
                    className="text-lg font-medium text-black hover:text-gray-700 transition-colors duration-200"
                  >
                    hello@lusion.co
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    New business
                  </h4>
                  <a 
                    href="mailto:business@lusion.co"
                    className="text-lg font-medium text-black hover:text-gray-700 transition-colors duration-200"
                  >
                    business@lusion.co
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-6">
                <a 
                  href="https://twitter.com/lusionltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Twitter / X
                </a>
                <a 
                  href="https://www.instagram.com/lusionltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Instagram
                </a>
                <a 
                  href="https://www.linkedin.com/company/lusionltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  LinkedIn
                </a>
              </div>

              {/* Labs Link */}
              <div>
                <a 
                  href="https://labs.lusion.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-black hover:text-gray-700 transition-colors duration-200 group"
                >
                  <span className="font-medium">R&D: labs.lusion.co</span>
                  <ArrowRight 
                    size={16} 
                    className="transform group-hover:translate-x-1 transition-transform duration-200" 
                  />
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Subscribe to our newsletter
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay updated with our latest projects, insights, and creative processes.
                </p>
              </div>

              <form className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </form>

              {/* Next Page Indicator */}
              <div className="pt-8">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    Keep Scrolling to Learn More
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-lg font-medium text-gray-900">About Us</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Next Page</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
