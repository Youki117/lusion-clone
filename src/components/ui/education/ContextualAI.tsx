'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Lightbulb, 
  Target, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'
import { useAI } from '@/components/providers/AIProvider'
import { KnowledgePoint } from '@/types'

interface AIInsightProps {
  type: 'suggestion' | 'explanation' | 'warning' | 'achievement'
  title: string
  content: string
  action?: {
    label: string
    onClick: () => void
  }
}

function AIInsight({ type, title, content, action }: AIInsightProps) {
  const getIcon = () => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="w-5 h-5" />
      case 'explanation': return <BookOpen className="w-5 h-5" />
      case 'warning': return <AlertCircle className="w-5 h-5" />
      case 'achievement': return <Star className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'suggestion': return 'bg-blue-500/20 border-blue-500/30 text-blue-300'
      case 'explanation': return 'bg-green-500/20 border-green-500/30 text-green-300'
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
      case 'achievement': return 'bg-purple-500/20 border-purple-500/30 text-purple-300'
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-300'
    }
  }

  return (
    <motion.div
      className={`p-4 rounded-lg border backdrop-blur-sm ${getColors()}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-sm opacity-90 leading-relaxed">{content}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface LearningProgressProps {
  knowledgePoint: KnowledgePoint
}

function LearningProgress({ knowledgePoint }: LearningProgressProps) {
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    // 模拟学习进度
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
      setProgress(prev => Math.min(prev + Math.random() * 2, 100))
    }, 1000)

    return () => clearInterval(timer)
  }, [knowledgePoint.id])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">学习进度</h4>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{formatTime(timeSpent)}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>完成度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 学习统计 */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-semibold text-white">{knowledgePoint.estimatedTime}</div>
          <div className="text-xs text-gray-400">预计时长(分)</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-400">{knowledgePoint.exercises.length}</div>
          <div className="text-xs text-gray-400">练习题目</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-blue-400">{knowledgePoint.resources.length}</div>
          <div className="text-xs text-gray-400">学习资源</div>
        </div>
      </div>
    </motion.div>
  )
}

interface ContextualAIProps {
  className?: string
  onOpenChat?: () => void
}

export function ContextualAI({ className = '', onOpenChat }: ContextualAIProps) {
  const { selectedKnowledgePoint, graphNodes } = useKnowledgeGraph()
  const { setKnowledgeContext, sendMessage } = useAI()
  const [insights, setInsights] = useState<AIInsightProps[]>([])
  const [showProgress, setShowProgress] = useState(false)

  // 生成AI洞察
  const generateInsights = useCallback((kp: KnowledgePoint) => {
    const newInsights: AIInsightProps[] = []

    // 基于难度的建议
    if (kp.difficulty === 'advanced') {
      newInsights.push({
        type: 'warning',
        title: '注意：这是高难度知识点',
        content: '建议先复习前置知识，确保基础扎实后再学习此内容。',
        action: {
          label: '查看前置知识',
          onClick: () => console.log('查看前置知识')
        }
      })
    }

    // 基于前置知识的建议
    if (kp.prerequisites.length > 0) {
      newInsights.push({
        type: 'suggestion',
        title: '建议复习相关知识',
        content: `此知识点依赖${kp.prerequisites.length}个前置概念，建议先确保掌握这些基础知识。`,
        action: {
          label: '开始复习',
          onClick: () => sendMessage(`请帮我复习${kp.title}的前置知识`, 'user')
        }
      })
    }

    // 基于资源的建议
    if (kp.resources.length > 0) {
      const videoResources = kp.resources.filter(r => r.type === 'video')
      if (videoResources.length > 0) {
        newInsights.push({
          type: 'explanation',
          title: '推荐观看视频资源',
          content: `我们为你准备了${videoResources.length}个视频教程，可以帮助你更好地理解概念。`,
          action: {
            label: '观看视频',
            onClick: () => console.log('观看视频')
          }
        })
      }
    }

    // 基于练习的建议
    if (kp.exercises.length > 0) {
      newInsights.push({
        type: 'suggestion',
        title: '准备练习题目',
        content: `有${kp.exercises.length}道练习题可以帮你巩固知识，建议学完理论后立即练习。`,
        action: {
          label: '开始练习',
          onClick: () => sendMessage(`我想做关于${kp.title}的练习题`, 'user')
        }
      })
    }

    // 学习时间建议
    if (kp.estimatedTime > 30) {
      newInsights.push({
        type: 'suggestion',
        title: '合理安排学习时间',
        content: `这个知识点预计需要${kp.estimatedTime}分钟，建议分段学习，每次20-25分钟。`,
        action: {
          label: '设置提醒',
          onClick: () => console.log('设置学习提醒')
        }
      })
    }

    setInsights(newInsights)
  }, [sendMessage])

  // 当选中知识点变化时更新上下文和洞察
  useEffect(() => {
    if (selectedKnowledgePoint) {
      // 更新AI上下文
      setKnowledgeContext({
        currentKnowledgePoint: selectedKnowledgePoint,
        relatedPoints: graphNodes
          .filter(node => 
            selectedKnowledgePoint.prerequisites.includes(node.id) ||
            node.knowledgePoint.prerequisites.includes(selectedKnowledgePoint.id)
          )
          .map(node => node.knowledgePoint),
        userProgress: {
          subjectProgress: [],
          totalPoints: 0,
          level: 1,
          achievements: [],
          streakDays: 0,
          lastStudyDate: new Date()
        },
        difficulty: selectedKnowledgePoint.difficulty
      })

      // 生成AI洞察
      generateInsights(selectedKnowledgePoint)
      setShowProgress(true)
    } else {
      setInsights([])
      setShowProgress(false)
    }
  }, [selectedKnowledgePoint, graphNodes, setKnowledgeContext, generateInsights])

  if (!selectedKnowledgePoint) {
    return (
      <motion.button
        className={`w-full bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200 cursor-pointer ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenChat}
      >
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-white font-medium mb-2">AI学习助手</h3>
        <p className="text-gray-400 text-sm">
          点击开始与AI助手对话，获得个性化的学习建议和指导
        </p>
        <div className="mt-3 text-xs text-blue-400">
          点击开始对话 →
        </div>
      </motion.button>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 当前学习状态 */}
      <motion.div
        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">正在学习</h3>
            <p className="text-blue-300 text-sm">{selectedKnowledgePoint.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-blue-200">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>难度: {selectedKnowledgePoint.difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{selectedKnowledgePoint.estimatedTime}分钟</span>
          </div>
        </div>
      </motion.div>

      {/* 学习进度 */}
      <AnimatePresence>
        {showProgress && (
          <LearningProgress knowledgePoint={selectedKnowledgePoint} />
        )}
      </AnimatePresence>

      {/* AI洞察和建议 */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>AI学习建议</span>
        </h4>
        
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => (
            <AIInsight
              key={`${selectedKnowledgePoint.id}-${index}`}
              {...insight}
            />
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
          <motion.div
            className="text-center py-6 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">AI正在分析学习内容...</p>
          </motion.div>
        )}
      </div>

      {/* 快速操作 */}
      <motion.div
        className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h4 className="text-white font-medium text-sm mb-3">快速操作</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => sendMessage(`请详细解释${selectedKnowledgePoint.title}`, 'user')}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs transition-colors"
          >
            详细解释
          </button>
          <button
            onClick={() => sendMessage(`给我一个关于${selectedKnowledgePoint.title}的例子`, 'user')}
            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-xs transition-colors"
          >
            举个例子
          </button>
          <button
            onClick={() => sendMessage(`${selectedKnowledgePoint.title}有什么应用场景？`, 'user')}
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs transition-colors"
          >
            应用场景
          </button>
          <button
            onClick={() => sendMessage(`我对${selectedKnowledgePoint.title}有疑问`, 'user')}
            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg text-xs transition-colors"
          >
            提问疑惑
          </button>
        </div>
      </motion.div>
    </div>
  )
}
