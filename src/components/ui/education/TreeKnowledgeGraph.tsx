'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Subject } from '@/data/subjects'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'

interface KnowledgePoint {
  id: string
  name: string
  description: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  status: 'completed' | 'in_progress' | 'not_started'
  estimatedTime: number // 预计学习时间（分钟）
}

interface Chapter {
  id: string
  name: string
  description: string
  status: 'completed' | 'in_progress' | 'not_started'
  knowledgePoints: KnowledgePoint[]
  order: number
}

interface TreeKnowledgeGraphProps {
  subject: Subject
  onNodeClick?: (node: Chapter | KnowledgePoint) => void
  onNodeHover?: (node: Chapter | KnowledgePoint | null) => void
  className?: string
}

// 模拟章节和知识点数据
const generateChapterData = (subject: Subject): Chapter[] => {
  return subject.chapters.map((chapterName, index) => {
    const chapterId = `${subject.id}-chapter-${index + 1}`
    const isCompleted = Math.random() > 0.7 // 30% 概率已完成
    const isInProgress = !isCompleted && Math.random() > 0.5 // 50% 概率进行中
    
    // 为每个章节生成知识点
    const knowledgePoints: KnowledgePoint[] = Array.from({ length: 4 + Math.floor(Math.random() * 4) }, (_, kpIndex) => ({
      id: `${chapterId}-kp-${kpIndex + 1}`,
      name: `知识点 ${kpIndex + 1}`,
      description: `${chapterName} 的第 ${kpIndex + 1} 个知识点`,
      difficulty: ['basic', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
      status: isCompleted ? 'completed' : (isInProgress && kpIndex < 2 ? 'in_progress' : 'not_started'),
      estimatedTime: 15 + Math.floor(Math.random() * 30)
    }))

    return {
      id: chapterId,
      name: chapterName,
      description: `${chapterName} 的详细内容和学习要点`,
      status: isCompleted ? 'completed' : (isInProgress ? 'in_progress' : 'not_started'),
      knowledgePoints,
      order: index + 1
    }
  })
}

export const TreeKnowledgeGraph: React.FC<TreeKnowledgeGraphProps> = ({
  subject,
  onNodeClick,
  onNodeHover,
  className = ''
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // 获取搜索状态
  const { searchQuery } = useKnowledgeGraph()

  const chapters = useMemo(() => generateChapterData(subject), [subject])

  // 过滤章节和知识点基于搜索查询
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters

    return chapters.map(chapter => {
      // 过滤知识点
      const filteredKnowledgePoints = chapter.knowledgePoints.filter(kp =>
        kp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kp.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

      // 如果章节名称匹配或有匹配的知识点，则包含该章节
      const chapterMatches = chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           chapter.description.toLowerCase().includes(searchQuery.toLowerCase())

      if (chapterMatches || filteredKnowledgePoints.length > 0) {
        return {
          ...chapter,
          knowledgePoints: chapterMatches ? chapter.knowledgePoints : filteredKnowledgePoints
        }
      }

      return null
    }).filter(Boolean) as Chapter[]
  }, [chapters, searchQuery])

  // 自动展开有搜索结果的章节
  useEffect(() => {
    if (searchQuery.trim()) {
      const chaptersWithResults = filteredChapters.map(chapter => chapter.id)
      setExpandedChapters(new Set(chaptersWithResults))
    }
  }, [searchQuery, filteredChapters])

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }, [])

  const handleChapterClick = useCallback((chapter: Chapter) => {
    toggleChapter(chapter.id)
    onNodeClick?.(chapter)
  }, [toggleChapter, onNodeClick])

  const handleKnowledgePointClick = useCallback((knowledgePoint: KnowledgePoint) => {
    onNodeClick?.(knowledgePoint)
  }, [onNodeClick])

  const handleNodeHover = useCallback((nodeId: string | null, node?: Chapter | KnowledgePoint) => {
    setHoveredNode(nodeId)
    onNodeHover?.(node || null)
  }, [onNodeHover])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-emerald-500 via-green-500 to-emerald-600'
      case 'in_progress':
        return 'from-amber-500 via-yellow-500 to-orange-500'
      default:
        return 'from-slate-600 via-gray-600 to-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '🎯'
      case 'in_progress':
        return '⚡'
      default:
        return '🔒'
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-400 shadow-emerald-500/20'
      case 'in_progress':
        return 'border-amber-400 shadow-amber-500/20'
      default:
        return 'border-gray-500 shadow-gray-500/10'
    }
  }



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'text-green-400'
      case 'intermediate':
        return 'text-yellow-400'
      case 'advanced':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <div className="w-full h-full overflow-auto">
        {/* 学科标题 */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br"
              style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)` }}
            >
              {subject.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{subject.name}</h1>
              <p className="text-gray-300 text-sm">{subject.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                <span>📚 {searchQuery ? `${filteredChapters.length}/${chapters.length}` : chapters.length} 章节</span>
                <span>💡 {searchQuery ? filteredChapters.reduce((sum, ch) => sum + ch.knowledgePoints.length, 0) : chapters.reduce((sum, ch) => sum + ch.knowledgePoints.length, 0)} 知识点</span>
                <span>⏱️ 预计 {subject.estimatedHours} 小时</span>
                {searchQuery && (
                  <span className="text-blue-400">🔍 搜索: &quot;{searchQuery}&quot;</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 章节树形结构 */}
        <div className="p-6 space-y-4">
        {searchQuery && filteredChapters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">🔍</div>
            <p className="text-gray-400">未找到匹配 &quot;{searchQuery}&quot; 的内容</p>
            <p className="text-gray-500 text-sm mt-1">请尝试其他关键词</p>
          </div>
        ) : (
          filteredChapters.map((chapter, index) => {
          const isExpanded = expandedChapters.has(chapter.id)
          const isHovered = hoveredNode === chapter.id
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* 章节节点 */}
              <motion.div
                className={`
                  relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 overflow-hidden
                  ${getStatusBorder(chapter.status)}
                  bg-gradient-to-r ${getStatusColor(chapter.status)}
                  hover:scale-[1.01] transform-gpu
                  ${isHovered ? 'shadow-xl' : 'shadow-lg'}
                `}
                onClick={() => handleChapterClick(chapter)}
                onMouseEnter={() => handleNodeHover(chapter.id, chapter)}
                onMouseLeave={() => handleNodeHover(null)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  boxShadow: chapter.status === 'completed'
                    ? '0 8px 25px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : chapter.status === 'in_progress'
                    ? '0 8px 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white" />
                      )}
                      <span className="text-lg">{getStatusIcon(chapter.status)}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        第{chapter.order}章 {chapter.name}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">{chapter.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-white/90 text-sm">
                    <div className="font-medium">{chapter.knowledgePoints.length} 个知识点</div>
                    <div className="text-xs text-white/70 mt-1">
                      {chapter.knowledgePoints.filter(kp => kp.status === 'completed').length} 已完成
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-3 bg-black/30 rounded-full h-3 overflow-hidden border border-white/20">
                  <motion.div
                    className={`h-full rounded-full ${
                      chapter.status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-400'
                        : chapter.status === 'in_progress'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(chapter.knowledgePoints.filter(kp => kp.status === 'completed').length / chapter.knowledgePoints.length) * 100}%`
                    }}
                    transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                    style={{
                      boxShadow: chapter.status === 'completed'
                        ? '0 0 10px rgba(16, 185, 129, 0.5)'
                        : chapter.status === 'in_progress'
                        ? '0 0 8px rgba(245, 158, 11, 0.4)'
                        : 'none'
                    }}
                  />
                </div>
              </motion.div>

              {/* 知识点下拉菜单 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8 mt-2 space-y-2 overflow-hidden"
                  >
                    {chapter.knowledgePoints.map((kp, kpIndex) => (
                      <motion.div
                        key={kp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: kpIndex * 0.05 }}
                        className={`
                          cursor-pointer rounded-lg p-3 border transition-all duration-200 overflow-hidden
                          ${getStatusBorder(kp.status)}
                          bg-gradient-to-r ${getStatusColor(kp.status)}
                          hover:scale-[1.01] transform-gpu
                          ${hoveredNode === kp.id ? 'shadow-lg' : 'shadow-md'}
                          ${kp.status === 'completed' ? 'bg-opacity-85' : 'bg-opacity-75'}
                          hover:bg-opacity-90
                        `}
                        onClick={() => handleKnowledgePointClick(kp)}
                        onMouseEnter={() => handleNodeHover(kp.id, kp)}
                        onMouseLeave={() => handleNodeHover(null)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          boxShadow: kp.status === 'completed'
                            ? '0 4px 15px rgba(16, 185, 129, 0.2)'
                            : kp.status === 'in_progress'
                            ? '0 4px 12px rgba(245, 158, 11, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">{getStatusIcon(kp.status)}</span>
                            <div>
                              <h4 className="text-white font-medium">{kp.name}</h4>
                              <p className="text-white/70 text-xs mt-1">{kp.description}</p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-white/70">
                            <div className={`font-medium ${getDifficultyColor(kp.difficulty)}`}>
                              {kp.difficulty === 'basic' ? '基础' : 
                               kp.difficulty === 'intermediate' ? '中等' : '高级'}
                            </div>
                            <div>{kp.estimatedTime}分钟</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        }))}
        </div>
      </div>
    </div>
  )
}
