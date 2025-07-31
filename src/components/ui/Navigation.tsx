'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { TransitionLink } from './TransitionLink'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 50,
    },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  }

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/education', label: 'AI Learning' },
    { href: '/about', label: 'About us' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header space */}
              <div className="h-20" />

              {/* Navigation Links */}
              <nav className="flex-1 px-8 py-8">
                <ul className="space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <TransitionLink
                        href={item.href}
                        onClick={onClose}
                        transitionMode="slide"
                        className="group flex items-center justify-between py-3 text-2xl font-medium text-gray-900 hover:text-black transition-colors duration-200"
                      >
                        <span>{item.label}</span>
                        <ArrowRight 
                          size={20} 
                          className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" 
                        />
                      </TransitionLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Newsletter Signup */}
              <motion.div
                className="px-8 py-6 border-t border-gray-200"
                custom={4}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors duration-200">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="px-8 py-6 bg-gray-50"
                custom={5}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <a
                  href="mailto:hello@lusion.co"
                  className="flex items-center space-x-3 text-lg font-medium text-black hover:text-gray-700 transition-colors duration-200"
                >
                  <Mail size={20} />
                  <span>Let&apos;s talk</span>
                </a>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Suite 2</p>
                  <p>9 Marsh Street</p>
                  <p>Bristol, BS1 4AA</p>
                  <p>United Kingdom</p>
                </div>

                {/* Labs Link */}
                <motion.a
                  href="https://labs.lusion.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 mt-4 text-sm font-medium text-black hover:text-gray-700 transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <span>Labs</span>
                  <ArrowRight size={16} />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
