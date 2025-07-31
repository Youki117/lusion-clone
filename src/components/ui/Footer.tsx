'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm">
            © 2024 Lusion Clone. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
