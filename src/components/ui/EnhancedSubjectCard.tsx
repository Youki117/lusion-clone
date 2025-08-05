'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Sparkles
} from 'lucide-react'
import { Subject } from '@/data/subjects'
import { getSubjectGradient, generateHoverGradientCSS, generateDecorativeGradientCSS } from '@/utils/gradientUtils'

interface EnhancedSubjectCardProps {
  subject: Subject
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
}

export function EnhancedSubjectCard({ 
  subject, 
  index, 
  isHovered, 
  onHover 
}: EnhancedSubjectCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isClickable = subject.status === 'available' || subject.status === 'beta'
  const gradientConfig = getSubjectGradient(subject.id)

  // 鼠标跟随效果
  useEffect(() => {
    if (!cardRef.current || !isHovered) return

    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovered])

  const getStatusIcon = () => {
    switch (subject.status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'beta':
        return <Zap className="w-4 h-4 text-amber-400" />
      case 'coming_soon':
        return <AlertCircle className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (subject.status) {
      case 'available':
        return '立即学习'
      case 'beta':
        return '测试版本'
      case 'coming_soon':
        return '即将推出'
      default:
        return '立即学习'
    }
  }

  const getDifficultyColor = () => {
    switch (subject.difficulty) {
      case 'basic':
        return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
      case 'intermediate':
        return 'text-amber-400 bg-amber-400/20 border-amber-400/30'
      case 'advanced':
        return 'text-rose-400 bg-rose-400/20 border-rose-400/30'
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getDifficultyText = () => {
    switch (subject.difficulty) {
      case 'basic':
        return '基础'
      case 'intermediate':
        return '中等'
      case 'advanced':
        return '困难'
      default:
        return '未知'
    }
  }

  const cardContent = (
    <motion.div
      ref={cardRef}
      className={`relative group h-full glass-effect card-3d hover-lift rounded-3xl overflow-hidden transition-all duration-500 ${
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
      }`}
      onMouseEnter={() => onHover(subject.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isPressed ? 0.98 : 1 
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={isClickable ? { 
        y: -8,
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* 动态渐变背景 */}
      <motion.div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background: generateHoverGradientCSS(gradientConfig)
        }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
      />

      {/* 顶部装饰线 */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to-r, ${gradientConfig.primary}, ${gradientConfig.secondary}, ${gradientConfig.tertiary})`,
          transformOrigin: 'left'
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* 状态标签 */}
      <motion.div 
        className="absolute top-4 right-4 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-1 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs border border-white/10">
          {getStatusIcon()}
          <span className="text-white font-medium">{getStatusText()}</span>
        </div>
      </motion.div>

      {/* 主要内容 */}
      <div className="relative p-6 h-full flex flex-col">
        {/* 学科图标和标题 */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative overflow-hidden"
              style={{ backgroundColor: `${subject.color}20` }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative z-10">{subject.icon}</span>
              
              {/* 图标光效 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                animate={{ 
                  opacity: isHovered ? [0, 1, 0] : 0 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isHovered ? Infinity : 0 
                }}
              />
            </motion.div>
            <div className="flex-1">
              <motion.h3 
                className="text-2xl font-bold text-white mb-2"
                animate={{ 
                  color: isHovered ? subject.color : '#ffffff' 
                }}
                transition={{ duration: 0.3 }}
              >
                {subject.name}
              </motion.h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getDifficultyColor()}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {getDifficultyText()}
              </div>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <motion.p 
          className="text-gray-300 text-sm leading-relaxed mb-6 flex-1"
          animate={{ 
            color: isHovered ? '#e5e7eb' : '#d1d5db' 
          }}
          transition={{ duration: 0.3 }}
        >
          {subject.description}
        </motion.p>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-400"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <BookOpen className="w-4 h-4" />
            <span>{subject.knowledgePoints} 知识点</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-400"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Clock className="w-4 h-4" />
            <span>{subject.estimatedHours}h 学时</span>
          </motion.div>
        </div>

        {/* 章节预览 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            主要章节
          </h4>
          <div className="flex flex-wrap gap-2">
            {subject.chapters.slice(0, 3).map((chapter, idx) => (
              <motion.span
                key={idx}
                className="px-3 py-1 bg-white/5 text-xs text-gray-400 rounded-lg border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                transition={{ duration: 0.2 }}
              >
                {chapter}
              </motion.span>
            ))}
            {subject.chapters.length > 3 && (
              <motion.span 
                className="px-3 py-1 bg-white/5 text-xs text-gray-400 rounded-lg border border-white/10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                +{subject.chapters.length - 3}
              </motion.span>
            )}
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span>AI智能辅导</span>
          </div>
          
          {isClickable && (
            <motion.div
              className="flex items-center space-x-2 text-sm font-medium text-white"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>开始学习</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </div>

      {/* 悬停光效 */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: isHovered && isClickable 
            ? `0 0 40px ${gradientConfig.primary}40` 
            : '0 0 0px transparent'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* 装饰性粒子效果 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${20 + Math.random() * 60}%`,
                  y: `${20 + Math.random() * 60}%`,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部渐变条 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to-r, ${gradientConfig.primary}, ${gradientConfig.secondary}, ${gradientConfig.tertiary})`,
          transformOrigin: 'left'
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered && isClickable ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* 波纹效果 */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: generateDecorativeGradientCSS(gradientConfig)
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )

  // 如果可点击，包装在Link中
  if (isClickable) {
    return (
      <Link href={`/education?subject=${subject.id}`} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  // 否则直接返回卡片
  return cardContent
} 