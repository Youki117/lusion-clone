'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { KnowledgePointCard } from '@/components/ui/education/KnowledgePointCard'
import { sampleKnowledgePoints } from '@/data/knowledgePoints'
import { 
  BookOpen, 
  Brain, 
  Star, 
  Clock,
  Target,
  Award,
  Play,
  FileText,
  Users
} from 'lucide-react'

export default function KnowledgeDemoPage() {
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<string | null>(null)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: number, duration: number}>>([])

  // 生成星空背景（仅在客户端）
  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 100 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3
      }))
    }
    setStars(generateStars())
  }, [])

  const handleKnowledgePointClick = (id: string) => {
    setSelectedKnowledgePoint(id)
    setIsCardOpen(true)
  }

  const handleCloseCard = () => {
    setIsCardOpen(false)
    setSelectedKnowledgePoint(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'advanced': return 'text-red-400 bg-red-400/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '基础'
      case 'intermediate': return '中等'
      case 'advanced': return '困难'
      default: return '未知'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4 text-red-400" />
      case 'article': return <FileText className="w-4 h-4 text-blue-400" />
      case 'interactive': return <Target className="w-4 h-4 text-green-400" />
      case 'model3d': return <Award className="w-4 h-4 text-purple-400" />
      case 'simulation': return <Users className="w-4 h-4 text-yellow-400" />
      default: return <BookOpen className="w-4 h-4 text-gray-400" />
    }
  }

  const selectedPoint = selectedKnowledgePoint 
    ? sampleKnowledgePoints.find(p => p.id === selectedKnowledgePoint)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* 星空背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Brain className="w-10 h-10 text-blue-400" />
            <span>知识点卡片演示</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            点击下方任意知识点卡片，体验全新的学习方式
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span>居中显示，占屏幕1/2大小</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span>集成3D模型和多媒体资源</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>智能内容展示和学习进度</span>
            </div>
          </div>
        </motion.div>

        {/* 知识点网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleKnowledgePoints.map((point, index) => (
            <motion.div
              key={point.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 cursor-pointer hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleKnowledgePointClick(point.id)}
            >
              {/* 标题和难度 */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex-1 pr-2">
                  {point.title}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(point.difficulty)}`}>
                  {getDifficultyText(point.difficulty)}
                </div>
              </div>

              {/* 内容预览 */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {point.content.split('\n')[0].substring(0, 120)}...
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {point.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {point.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                    +{point.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{point.estimatedTime}分钟</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{point.resources.length}个资源</span>
                  </div>
                </div>
                
                {/* 资源类型图标 */}
                <div className="flex space-x-1">
                  {Array.from(new Set(point.resources.map(r => r.type))).slice(0, 3).map((type, typeIndex) => (
                    <div key={typeIndex} className="opacity-60">
                      {getResourceIcon(type)}
                    </div>
                  ))}
                </div>
              </div>

              {/* 悬停效果 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* 功能说明 */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <span>知识点卡片特性</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">智能内容展示</h4>
                    <p className="text-gray-400 text-sm">结构化展示知识点内容，支持展开/收起长文本</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">3D模型集成</h4>
                    <p className="text-gray-400 text-sm">支持3D模型展示，提供沉浸式学习体验</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">多媒体资源</h4>
                    <p className="text-gray-400 text-sm">整合视频、文章、互动演示等多种学习资源</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">个性化学习</h4>
                    <p className="text-gray-400 text-sm">根据难度和前置知识提供个性化学习路径</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 知识点卡片弹窗 */}
      {selectedPoint && (
        <KnowledgePointCard
          knowledgePoint={selectedPoint}
          isOpen={isCardOpen}
          onClose={handleCloseCard}
        />
      )}
    </div>
  )
}
