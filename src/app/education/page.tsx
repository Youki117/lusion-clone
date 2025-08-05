'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { KnowledgePointCard } from '@/components/ui/education/KnowledgePointCard'
import { ChapterList, LearningProgress } from '@/components/ui/education/ChapterList'
import { ChatInterface } from '@/components/ui/education/ChatInterface'
import { getSubjectById } from '@/data/subjects'
import { KnowledgePoint } from '@/types'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'
import {
  List,
  Brain,
  BookOpen,
  Sparkles,
  Menu,
  MessageCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Search,
  ArrowLeft,
  Home
} from 'lucide-react'

export default function EducationPage() {
  const searchParams = useSearchParams()
  const [currentSubject, setCurrentSubject] = useState<any>(null)
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    totalChapters: 0,
    completedChapters: 0,
    inProgressChapters: 0,
    totalKnowledgePoints: 0,
    completedKnowledgePoints: 0,
    overallProgress: 0
  })

  // 搜索功能
  const {
    searchQuery,
    setSearchQuery,
    filteredNodes,
    graphNodes,
    clearHighlights
  } = useKnowledgeGraph()

  // 知识点卡片状态
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<KnowledgePoint | null>(null)
  const [isKnowledgeCardOpen, setIsKnowledgeCardOpen] = useState(false)
  
  // 搜索结果状态
  const [searchResults, setSearchResults] = useState({ filtered: 0, total: 0 })

  useEffect(() => {
    const subjectParam = searchParams.get('subject') || 'math'
    // 映射URL参数到实际的学科ID
    const subjectIdMap: { [key: string]: string } = {
      'math': 'mathematics',
      'physics': 'physics',
      'chemistry': 'chemistry',
      'biology': 'biology',
      'chinese': 'chinese',
      'english': 'english',
      'history': 'history',
      'geography': 'geography',
      'politics': 'politics'
    }

    const subjectId = subjectIdMap[subjectParam] || 'mathematics'
    const subject = getSubjectById(subjectId)
    setCurrentSubject(subject)
  }, [searchParams])

  // 知识点点击处理
  const handleKnowledgePointClick = (knowledgePoint: KnowledgePoint) => {
    setSelectedKnowledgePoint(knowledgePoint)
    setIsKnowledgeCardOpen(true)
  }

  const handleProgressUpdate = useCallback((progress: LearningProgress) => {
    setLearningProgress(progress)
  }, [])

  // 知识点卡片关闭处理
  const handleCloseKnowledgeCard = () => {
    setIsKnowledgeCardOpen(false)
    setSelectedKnowledgePoint(null)
  }

  // 搜索处理函数
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [setSearchQuery])

  // 搜索结果更新处理函数
  const handleSearchResultsUpdate = useCallback((results: { filtered: number; total: number }) => {
    setSearchResults(results)
  }, [])

  // 使用真实的学习进度数据
  const progressData = {
    completed: learningProgress.completedChapters,
    inProgress: learningProgress.inProgressChapters,
    total: learningProgress.totalChapters,
    percentage: learningProgress.overallProgress
  }

  return (
    <div className="min-h-screen bg-black fixed inset-0 z-50">
      {/* 新的三栏布局 */}
      <div className="flex h-screen">
        {/* 左侧：学科信息和学习进度 */}
        <motion.div
          className="w-80 bg-black/40 backdrop-blur-sm border-r border-white/20 flex flex-col relative z-20"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 顶部导航 */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <Link href="/" className="block">
              <motion.div
                className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">返回主页</span>
              </motion.div>
              <div className="mt-1 text-xs text-gray-400">BACK TO HOME</div>
            </Link>
          </div>

          {/* 学科信息 */}
          <div className="p-6 flex-1 overflow-y-auto">
            {currentSubject ? (
              <div className="space-y-6">
                {/* 学科标题 */}
                <div>
                  <div className="flex items-start space-x-3 mb-4">
                    <span className="text-3xl flex-shrink-0">{currentSubject.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl font-bold text-white leading-tight">
                        {currentSubject.name} - AI智能学习
                      </h1>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {currentSubject.description}
                  </p>

                  <div className="text-xs text-gray-400 leading-relaxed">
                    {currentSubject.knowledgePoints} 个知识点 • {currentSubject.estimatedHours} 学时 • {currentSubject.chapters.length} 个章节
                  </div>
                </div>

                {/* 学习进度 */}
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>学习进度</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">已完成章节</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">{progressData.completed}/{progressData.total}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">进行中章节</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{progressData.inProgress}/{progressData.total}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">总体进度</span>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">{progressData.percentage}%</span>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-4">
                      <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressData.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 搜索框 */}
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>搜索知识点</span>
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="搜索知识点..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-gray-300">
                      找到 {searchResults.filtered} / {searchResults.total} 个知识点
                    </div>
                  )}
                </div>

                {/* 学习导航 */}
                <div className="space-y-2">
                  <motion.div
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <List className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-medium">学习路径</span>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p>正在加载学科信息...</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 中间：学习内容 */}
        <motion.div
          className="flex-1 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-full overflow-y-auto p-6">
            <ChapterList
              subjectId={currentSubject?.id || 'mathematics'}
              onKnowledgePointClick={handleKnowledgePointClick}
              onProgressUpdate={handleProgressUpdate}
              onSearchResultsUpdate={handleSearchResultsUpdate}
            />
          </div>
        </motion.div>

        {/* 右侧：AI问道傲天区 */}
        <motion.div
          className="w-96 bg-black/40 backdrop-blur-sm border-l border-white/20 flex flex-col relative z-20"
          initial={{ x: 384 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          {/* AI区域标题 */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white truncate">AI问道傲天区</h2>
                <p className="text-xs text-gray-400 mt-1 leading-tight">智能学习助手，随时为您答疑解惑</p>
              </div>
            </div>
          </div>

          {/* AI聊天界面 */}
          <div className="flex-1 min-h-0">
            <ChatInterface
              className="h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* 知识点卡片 */}
      {selectedKnowledgePoint && (
        <KnowledgePointCard
          knowledgePoint={selectedKnowledgePoint}
          isOpen={isKnowledgeCardOpen}
          onClose={handleCloseKnowledgeCard}
        />
      )}
    </div>
  )
}
