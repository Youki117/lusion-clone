'use client'

import React from 'react'
import Image from 'next/image'

interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  className?: string
  alt?: string
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 400,
  height = 300,
  text = 'Image',
  className = '',
  alt = 'Placeholder image'
}) => {
  const safeWidth = width || 400
  const safeHeight = height || 300

  // Create a simple SVG placeholder instead of using external service
  const createSVGPlaceholder = (w: number, h: number, label: string) => {
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" dy=".3em">${label}</text>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  const placeholderUrl = createSVGPlaceholder(safeWidth, safeHeight, text)

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`} style={{ width: safeWidth, height: safeHeight }}>
      <Image
        src={placeholderUrl}
        alt={alt}
        width={safeWidth}
        height={safeHeight}
        className="object-cover w-full h-full"
        unoptimized
      />
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <span className="text-white text-sm font-medium opacity-75">
          {text}
        </span>
      </div>
    </div>
  )
}
