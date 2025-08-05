'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Navigation } from './Navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ scrollMarginTop: '0' }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.div
                className="text-xl font-normal text-black tracking-wide"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                LUSION
              </motion.div>
            </Link>

            {/* Right side buttons */}
            <div className="flex items-center space-x-6">
              {/* Let's talk button */}
              <motion.a
                href="mailto:hello@lusion.co"
                className="flex items-center px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>LET&apos;S TALK</span>
              </motion.a>

              {/* Menu button */}
              <button
                onClick={toggleMenu}
                className="relative z-10 text-black font-medium text-sm tracking-wide"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      CLOSE
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      MENU
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
