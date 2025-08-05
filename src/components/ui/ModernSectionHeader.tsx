'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  BookOpen, 
  Zap, 
  Star,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ModernSectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  stats?: Array<{
    icon: React.ReactNode
    label: string
    value: string | number
    color: string
  }>
  className?: string
}

export function ModernSectionHeader({ 
  title, 
  subtitle, 
  icon = <BookOpen className="w-8 h-8 text-blue-400" />,
  stats = [],
  className = ''
}: ModernSectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题动画
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { 
            y: 60,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
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

      // 副标题动画
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          {
            y: 30,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // 统计信息动画
      if (statsRef.current && stats.length > 0) {
        const statItems = statsRef.current.querySelectorAll('.stat-item')
        gsap.fromTo(statItems,
          {
            y: 40,
            opacity: 0,
            scale: 0.8
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.4,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // 图标动画
      const iconElement = headerRef.current?.querySelector('.header-icon')
      if (iconElement) {
        gsap.fromTo(iconElement,
          {
            y: 20,
            opacity: 0,
            rotation: -10
          },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: iconElement,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, headerRef)

    return () => ctx.revert()
  }, [stats.length])

  return (
    <div ref={headerRef} className={`mb-16 md:mb-20 ${className}`}>
      {/* 图标和标题 */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.div 
          className="header-icon w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" />
          <div className="relative z-10">
            {icon}
          </div>
          
          {/* 图标光效 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
            animate={{ 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        </motion.div>
        
        <motion.h2 
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
          whileHover={{ 
            scale: 1.02,
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>
      </div>

      {/* 副标题 */}
      {subtitle && (
        <motion.p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-200 max-w-4xl leading-relaxed"
          whileHover={{ 
            color: '#e5e7eb'
          }}
          transition={{ duration: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* 统计信息 */}
      {stats.length > 0 && (
        <motion.div 
          ref={statsRef}
          className="flex flex-wrap items-center gap-6 mt-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item flex items-center space-x-2 text-sm text-gray-300 group"
              whileHover={{ 
                scale: 1.05,
                color: stat.color
              }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-4 h-4"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </div>
              <span className="font-medium">{stat.value}</span>
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 装饰性元素 */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-600 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
} 