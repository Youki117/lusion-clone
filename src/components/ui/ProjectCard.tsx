'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PlaceholderImage } from './PlaceholderImage'

interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  href: string
  tags: string[]
}

interface ProjectCardProps {
  project: Project
  index: number
}

// Generate project colors based on index
function getProjectColor(index: number): string {
  const colors = [
    '#667eea', // Blue
    '#764ba2', // Purple
    '#4f46e5', // Indigo
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#ef4444', // Red
  ]
  return colors[index % colors.length]
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link href={project.href}>
      <motion.div
        className="project-card group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Project Image */}
        <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/10">
          <PlaceholderImage
            width={400}
            height={300}
            text={project.title}
            className="project-image w-full h-full transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* Project Info */}
        <div className="space-y-3">
          {/* Category */}
          <div className="text-sm text-gray-300 font-medium">
            {project.category}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-normal text-white leading-tight group-hover:text-gray-200 transition-colors duration-200 drop-shadow-sm">
            {project.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}
