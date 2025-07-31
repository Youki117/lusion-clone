'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Clock,
  Star,
  BookOpen,
  Play,
  FileText,
  Target,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  Brain,
  Lightbulb,
  MessageCircle,
  Bot
} from 'lucide-react'
import { KnowledgePoint, Resource } from '@/types'
import { FloatingChatBubbles } from './FloatingChatBubbles'
import { AIQueryInput } from './AIQueryInput'
import { AIService } from '@/services/aiService'

interface KnowledgePointCardProps {
  knowledgePoint: KnowledgePoint
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface Model3DViewerProps {
  modelUrl: string
  className?: string
}

// 增强的3D模型查看器组件
function Model3DViewer({ modelUrl, className = '' }: Model3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isRotating, setIsRotating] = useState(true)

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [modelUrl])

  return (
    <div className={`relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl overflow-hidden border border-blue-500/20 ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <motion.div
              className="w-8 h-8 border-2 border-blue-400 rounded-full mx-auto mb-3"
              style={{ borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-gray-400">加载3D模型中...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">3D模型加载失败</p>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {/* 增强的3D模型展示区域 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
                animate={isRotating ? {
                  rotateY: [0, 360],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: isRotating ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Award className="w-16 h-16 text-white" />
              </motion.div>
              <p className="text-sm text-gray-300 font-medium">3D模型展示区域</p>
              <p className="text-xs text-gray-500 mt-1">支持旋转、缩放、平移操作</p>

              {/* 模拟的3D控制提示 */}
              <div className="mt-3 flex justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>拖拽旋转</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>滚轮缩放</span>
                </div>
              </div>
            </div>
          </div>

          {/* 增强的控制按钮 */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRotating(!isRotating)}
            >
              <RotateCcw className={`w-4 h-4 text-white ${isRotating ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* 3D场景信息 */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-400">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
              <div>模型: {modelUrl.split('/').pop()}</div>
              <div>格式: GLB/GLTF</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 资源图标组件
function ResourceIcon({ type }: { type: Resource['type'] }) {
  const iconMap = {
    video: <Play className="w-5 h-5" />,
    article: <FileText className="w-5 h-5" />,
    interactive: <Target className="w-5 h-5" />,
    model3d: <Award className="w-5 h-5" />,
    simulation: <Users className="w-5 h-5" />
  }
  
  const colorMap = {
    video: 'text-red-400',
    article: 'text-blue-400',
    interactive: 'text-green-400',
    model3d: 'text-purple-400',
    simulation: 'text-yellow-400'
  }

  return (
    <div className={`${colorMap[type]}`}>
      {iconMap[type]}
    </div>
  )
}

// 增强的markdown格式化函数
const formatContent = (content: string) => {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentListItems: JSX.Element[] = []
  let listIndex = 0

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${listIndex++}`} className="list-disc list-inside space-y-1 mb-4 ml-4">
          {currentListItems}
        </ul>
      )
      currentListItems = []
    }
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    
    // 空行
    if (trimmedLine === '') {
      flushList()
      elements.push(<div key={`br-${index}`} className="h-2" />)
      return
    }

    // 标题（**文字**）
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      flushList()
      const title = trimmedLine.replace(/\*\*/g, '')
      elements.push(
        <h4 key={`title-${index}`} className="text-lg font-semibold text-white mt-6 mb-3 first:mt-0">
          {title}
        </h4>
      )
      return
    }

    // 列表项
    if (trimmedLine.match(/^\d+\.\s+\*\*.*\*\*:/)) {
      flushList()
      const match = trimmedLine.match(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/)
      if (match) {
        const [, number, title, description] = match
        elements.push(
          <div key={`numbered-item-${index}`} className="mb-3">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-medium">{number}.</span>
              <div>
                <span className="text-white font-semibold">{title}</span>
                {description && <span className="text-gray-300">: {description}</span>}
              </div>
            </div>
          </div>
        )
      }
      return
    }

    // 普通列表项（- 开头）
    if (trimmedLine.startsWith('- ')) {
      const itemText = trimmedLine.substring(2)
      currentListItems.push(
        <li key={`item-${index}`} className="text-gray-300">
          {itemText}
        </li>
      )
      return
    }

    // 普通段落
    flushList()
    
    // 处理行内的**粗体**格式
    const processInlineFormatting = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/)
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-white font-semibold">
              {part.replace(/\*\*/g, '')}
            </strong>
          )
        }
        return part
      })
    }

    elements.push(
      <p key={`para-${index}`} className="text-gray-300 leading-relaxed mb-3">
        {processInlineFormatting(trimmedLine)}
      </p>
    )
  })

  // 处理最后的列表
  flushList()

  return elements
}

export function KnowledgePointCard({ knowledgePoint, isOpen, onClose, className = '' }: KnowledgePointCardProps) {
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0)
  const [showFullContent, setShowFullContent] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [copiedContent, setCopiedContent] = useState('')

  const [chatBubbles, setChatBubbles] = useState<Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }>>([])
  const [isAILoading, setIsAILoading] = useState(false)

  const model3dResources = knowledgePoint.resources.filter(r => r.type === 'model3d')
  const currentModel3d = model3dResources[0] // 使用第一个3D模型

  // 复制检测功能
  useEffect(() => {
    const handleCopy = () => {
      // 获取选中的文本
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      if (selectedText && selectedText.length > 10) {
        setCopiedContent(selectedText)
      }
    }

    // 监听复制事件
    document.addEventListener('copy', handleCopy)

    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [])

  // 清除复制内容
  const clearCopiedContent = () => {
    setCopiedContent('')
  }

  // 发送AI消息
  const handleSendAIMessage = async (message: string) => {
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }

    setChatBubbles(prev => [...prev, userMessage])
    setIsAILoading(true)

    try {
      // 构建知识点上下文
      const context = {
        knowledgePoint: knowledgePoint.title,
        subject: '数学',
        difficulty: knowledgePoint.difficulty,
        description: knowledgePoint.description
      }

      // 调用真实的AI服务
      const response = await AIService.generateResponse(
        message,
        context,
        chatBubbles.map(bubble => ({
          id: bubble.id,
          role: bubble.type === 'user' ? 'user' : 'assistant',
          content: bubble.content,
          timestamp: bubble.timestamp
        }))
      )

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: response,
        timestamp: new Date()
      }
      setChatBubbles(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI响应失败:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: '抱歉，AI服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      }
      setChatBubbles(prev => [...prev, errorMessage])
    } finally {
      setIsAILoading(false)
    }
  }

  const getDifficultyColor = (difficulty: KnowledgePoint['difficulty']) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'advanced': return 'text-red-400 bg-red-400/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getDifficultyText = (difficulty: KnowledgePoint['difficulty']) => {
    switch (difficulty) {
      case 'basic': return '基础'
      case 'intermediate': return '中等'
      case 'advanced': return '困难'
      default: return '未知'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 知识点卡片 */}
          <motion.div
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* 整体容器 - 包含卡片和气泡，始终居中 */}
            <motion.div
              className="flex items-center relative"
              animate={{
                gap: chatBubbles.length > 0 ? '12px' : '0'
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* 知识点卡片 */}
              <motion.div
                className="w-[1024px] h-[85vh] bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl flex flex-col"
              >
              {/* 头部 */}
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">{knowledgePoint.title}</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm border ${getDifficultyColor(knowledgePoint.difficulty)}`}>
                    {getDifficultyText(knowledgePoint.difficulty)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{knowledgePoint.estimatedTime}分钟</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">{knowledgePoint.resources.length}个资源</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 主要内容区域 */}
              <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* 左侧：文字内容 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* 标签 */}
                      {knowledgePoint.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {knowledgePoint.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 内容 */}
                      <div className="prose prose-invert max-w-none">
                        <div className="space-y-2">
                          {formatContent(knowledgePoint.content)}
                        </div>
                      </div>

                      {/* 前置知识 */}
                      {knowledgePoint.prerequisites.length > 0 && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4" />
                            <span>前置知识</span>
                          </h4>
                          <div className="space-y-2">
                            {knowledgePoint.prerequisites.map((prereq, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-sm text-blue-300"
                              >
                                <ChevronRight className="w-3 h-3" />
                                <span>{prereq}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右侧：3D模型和资源 */}
                <div className="w-96 border-l border-white/20 flex flex-col min-h-0">
                  {/* 3D模型展示区域 */}
                  {currentModel3d && (
                    <div className="flex-shrink-0 h-64 p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>3D模型演示</span>
                      </h4>
                      <Model3DViewer
                        modelUrl={currentModel3d.url}
                        className="h-48"
                      />
                    </div>
                  )}

                  {/* 学习资源 */}
                  <div className="flex-1 p-4 border-t border-white/10 overflow-y-auto min-h-0">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>学习资源</span>
                    </h4>

                    <div className="space-y-3">
                      {knowledgePoint.resources.slice(0, 4).map((resource, index) => (
                        <motion.div
                          key={resource.id}
                          className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ResourceIcon type={resource.type} />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-white truncate">
                              {resource.title}
                            </h5>
                            <p className="text-xs text-gray-400 truncate">
                              {resource.description}
                            </p>
                            {resource.duration && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {Math.floor(resource.duration / 60)}:{(resource.duration % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {knowledgePoint.resources.length > 4 && (
                      <button className="w-full mt-3 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        查看更多资源 ({knowledgePoint.resources.length - 4})
                      </button>
                    )}
                  </div>

                  {/* AI询问区域 */}
                  <div className="border-t border-white/10">
                    <div className="p-4">
                      {/* AI询问输入框 - 常驻显示 */}
                      <AIQueryInput
                        onSendMessage={handleSendAIMessage}
                        isLoading={isAILoading}
                        preloadedContent={copiedContent}
                        placeholder="向AI提问关于这个知识点的问题..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>

              {/* 浮动对话气泡 - 显示在卡片右侧 */}
              {chatBubbles.length > 0 && (
                <motion.div
                  className="flex-shrink-0 w-[480px] h-[85vh] overflow-y-auto chat-messages"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <FloatingChatBubbles
                    isVisible={true}
                    onClose={() => {
                      setChatBubbles([])
                    }}
                    bubbles={chatBubbles}
                    className="relative"
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  )
}
