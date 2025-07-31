'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Clock, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import { Subject } from '@/data/subjects'

interface SubjectCardProps {
  subject: Subject
  index: number
}

export function SubjectCard({ subject, index }: SubjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusIcon = () => {
    switch (subject.status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'beta':
        return <Zap className="w-4 h-4 text-yellow-400" />
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
        return 'text-green-400 bg-green-400/20'
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced':
        return 'text-red-400 bg-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
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

  const isClickable = subject.status === 'available' || subject.status === 'beta'

  const cardContent = (
    <motion.div
      className={`subject-card relative group h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
        isClickable ? 'cursor-pointer hover:border-white/30' : 'cursor-not-allowed opacity-75'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={isClickable ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 背景渐变效果 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* 状态标签 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center space-x-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs">
          {getStatusIcon()}
          <span className="text-white">{getStatusText()}</span>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative p-6 h-full flex flex-col">
        {/* 学科图标和标题 */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${subject.color}20`, border: `1px solid ${subject.color}40` }}
            >
              {subject.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{subject.name}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor()}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {getDifficultyText()}
              </div>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
          {subject.description}
        </p>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>{subject.knowledgePoints} 知识点</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{subject.estimatedHours}h 学时</span>
          </div>
        </div>

        {/* 章节预览 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">主要章节</h4>
          <div className="flex flex-wrap gap-1">
            {subject.chapters.slice(0, 3).map((chapter, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-white/5 text-xs text-gray-400 rounded-md"
              >
                {chapter}
              </span>
            ))}
            {subject.chapters.length > 3 && (
              <span className="px-2 py-1 bg-white/5 text-xs text-gray-400 rounded-md">
                +{subject.chapters.length - 3}
              </span>
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
              className="flex items-center space-x-1 text-sm font-medium text-white"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>开始学习</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        {/* 悬停效果 */}
        <motion.div
          className="absolute inset-0 border-2 rounded-2xl"
          animate={{
            borderColor: isHovered && isClickable ? subject.color : 'rgba(255, 255, 255, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 底部光效 */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${subject.gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered && isClickable ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'left' }}
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
