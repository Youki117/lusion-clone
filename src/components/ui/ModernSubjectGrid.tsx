'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  BookOpen, 
  Zap, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { subjects, Subject } from '@/data/subjects'
import { EnhancedSubjectCard } from './EnhancedSubjectCard'
import { getSubjectGradient, generateDecorativeGradientCSS } from '@/utils/gradientUtils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ModernSubjectGridProps {
  className?: string
}

export function ModernSubjectGrid({ className = '' }: ModernSubjectGridProps) {
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  // 粒子背景效果
  useEffect(() => {
    if (!particlesRef.current) return

    const particles = particlesRef.current
    const particleCount = 50

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute w-1 h-1 bg-white/10 rounded-full particle'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 20}s`
      particle.style.animationDuration = `${20 + Math.random() * 10}s`
      particles.appendChild(particle)
    }

    return () => {
      particles.innerHTML = ''
    }
  }, [])

  // 过滤学科
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || subject.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  // GSAP 动画
  useEffect(() => {
    // 确保组件已经渲染完成
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // 容器进入动画
        if (containerRef.current) {
          gsap.fromTo(containerRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      }, containerRef)

      return () => ctx.revert()
    }, 100) // 延迟100ms确保DOM完全渲染

    return () => clearTimeout(timer)
  }, [searchQuery, selectedDifficulty]) // 当搜索或过滤条件改变时重新执行

  return (
    <div className={`relative ${className}`}>
      {/* 粒子背景 */}
      <div 
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          background: generateDecorativeGradientCSS(getSubjectGradient('mathematics'))
        }}
      />
      <style jsx>{`
        .particle {
          animation: float 20s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-15px) translateX(15px);
            opacity: 0.4;
          }
        }
      `}</style>

      {/* 搜索和过滤栏 */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* 搜索框 */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="搜索学科..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />
            <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* 难度过滤 */}
          <div className="flex gap-2">
            {['all', 'basic', 'intermediate', 'advanced'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedDifficulty === difficulty
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {difficulty === 'all' ? '全部' : 
                 difficulty === 'basic' ? '基础' :
                 difficulty === 'intermediate' ? '中等' : '困难'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 学科网格 */}
      <div 
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 responsive-grid"
      >
        <AnimatePresence>
          {filteredSubjects.map((subject, index) => {
            const isHovered = hoveredSubject === subject.id

            return (
              <EnhancedSubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                isHovered={isHovered}
                onHover={setHoveredSubject}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {filteredSubjects.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">未找到相关学科</h3>
          <p className="text-gray-400">尝试调整搜索条件或难度筛选</p>
        </motion.div>
      )}
    </div>
  )
} 