'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  transitionMode?: string // Added missing prop
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  href,
  children,
  className = '',
  onClick,
  transitionMode = 'fade'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Link>
  )
}
