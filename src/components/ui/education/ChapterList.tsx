'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Star,
  Play,
  CheckCircle,
  Circle,
  Brain,
  Target,
  Book,
  FileText,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react'
import { KnowledgePoint } from '@/types'
import { getChaptersBySubject } from '@/data/subjectKnowledgePoints'
import { getSubjectById } from '@/data/subjects'

interface ChapterListProps {
  subjectId: string
  onKnowledgePointClick: (knowledgePoint: KnowledgePointWithStatus) => void
  onProgressUpdate?: (progress: LearningProgress) => void
  className?: string
}

// 学习状态类型
type LearningStatus = 'completed' | 'in_progress' | 'not_started'

// 扩展知识点接口
interface KnowledgePointWithStatus extends KnowledgePoint {
  status: LearningStatus
}

// 三级层次结构的数据类型
interface BookLevel {
  id: string
  name: string
  chapters: ChapterLevel[]
  status: LearningStatus
  progress: number
}

interface ChapterLevel {
  id: string
  name: string
  knowledgePoints: KnowledgePointWithStatus[]
  status: LearningStatus
  progress: number
}

// 学习进度统计
export interface LearningProgress {
  totalChapters: number
  completedChapters: number
  inProgressChapters: number
  totalKnowledgePoints: number
  completedKnowledgePoints: number
  overallProgress: number
}

interface BookItemProps {
  book: BookLevel
  onKnowledgePointClick: (knowledgePoint: KnowledgePointWithStatus) => void
  isExpanded: boolean
  onToggle: () => void
  expandedChapters: Set<string>
  onChapterToggle: (chapterId: string) => void
}

interface ChapterItemProps {
  chapter: ChapterLevel
  onKnowledgePointClick: (knowledgePoint: KnowledgePointWithStatus) => void
  isExpanded: boolean
  onToggle: () => void
}

// 模拟学习状态生成（基于确定性算法）
function generateLearningStatus(id: string, index: number): LearningStatus {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index
  const statusValue = hash % 10
  if (statusValue >= 7) return 'completed'
  if (statusValue >= 4) return 'in_progress'
  return 'not_started'
}

// 将subjects数据转换为三级层次结构
function organizeSubjectData(subjectId: string): BookLevel[] {
  const subject = getSubjectById(subjectId)
  if (!subject) return []

  const knowledgePointsData = getChaptersBySubject(subjectId)
  const booksMap = new Map<string, BookLevel>()

  // 解析章节名称，提取书籍和章节信息
  subject.chapters.forEach((chapterName, index) => {
    const parts = chapterName.split('：')
    if (parts.length >= 2) {
      const bookName = parts[0] // 如 "必修一"
      const chapterTitle = parts[1] // 如 "集合与常用逻辑用语"

      // 创建或获取书籍
      if (!booksMap.has(bookName)) {
        booksMap.set(bookName, {
          id: `book-${bookName.replace(/\s+/g, '-')}`,
          name: bookName,
          chapters: [],
          status: 'not_started',
          progress: 0
        })
      }

      const book = booksMap.get(bookName)!

      // 查找对应的知识点数据
      const matchingChapter = knowledgePointsData.find(kp => {
        const kpTitle = kp.name.split('：')[1] || kp.name
        return kpTitle.includes(chapterTitle) || chapterTitle.includes(kpTitle)
      })

      // 为知识点添加学习状态
      const originalKnowledgePoints = matchingChapter?.knowledgePoints || []
      const knowledgePointsWithStatus: KnowledgePointWithStatus[] = originalKnowledgePoints.map((kp, kpIndex) => ({
        ...kp,
        status: generateLearningStatus(kp.id, kpIndex)
      }))

      // 计算章节进度
      const completedKPs = knowledgePointsWithStatus.filter(kp => kp.status === 'completed').length
      const totalKPs = knowledgePointsWithStatus.length
      const chapterProgress = totalKPs > 0 ? Math.round((completedKPs / totalKPs) * 100) : 0

      // 确定章节状态
      let chapterStatus: LearningStatus = 'not_started'
      if (completedKPs === totalKPs && totalKPs > 0) {
        chapterStatus = 'completed'
      } else if (completedKPs > 0 || knowledgePointsWithStatus.some(kp => kp.status === 'in_progress')) {
        chapterStatus = 'in_progress'
      }

      // 创建章节
      const chapterNumber = book.chapters.length + 1
      book.chapters.push({
        id: matchingChapter?.id || `chapter-${bookName}-${chapterNumber}`,
        name: `第${chapterNumber}章：${chapterTitle}`,
        knowledgePoints: knowledgePointsWithStatus,
        status: chapterStatus,
        progress: chapterProgress
      })
    }
  })

  // 计算书籍进度和状态
  booksMap.forEach(book => {
    const completedChapters = book.chapters.filter(ch => ch.status === 'completed').length
    const totalChapters = book.chapters.length
    book.progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

    if (completedChapters === totalChapters && totalChapters > 0) {
      book.status = 'completed'
    } else if (completedChapters > 0 || book.chapters.some(ch => ch.status === 'in_progress')) {
      book.status = 'in_progress'
    } else {
      book.status = 'not_started'
    }
  })

  return Array.from(booksMap.values())
}

// 计算整体学习进度
function calculateLearningProgress(books: BookLevel[]): LearningProgress {
  const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0)
  const completedChapters = books.reduce((sum, book) =>
    sum + book.chapters.filter(ch => ch.status === 'completed').length, 0)
  const inProgressChapters = books.reduce((sum, book) =>
    sum + book.chapters.filter(ch => ch.status === 'in_progress').length, 0)

  const totalKnowledgePoints = books.reduce((sum, book) =>
    sum + book.chapters.reduce((chSum, ch) => chSum + ch.knowledgePoints.length, 0), 0)
  const completedKnowledgePoints = books.reduce((sum, book) =>
    sum + book.chapters.reduce((chSum, ch) =>
      chSum + ch.knowledgePoints.filter(kp => kp.status === 'completed').length, 0), 0)

  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

  return {
    totalChapters,
    completedChapters,
    inProgressChapters,
    totalKnowledgePoints,
    completedKnowledgePoints,
    overallProgress
  }
}

// 学习进度统计组件
function LearningProgressStats({ progress }: { progress: LearningProgress }) {
  return (
    <motion.div
      className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">学习进度</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 已完成章节 */}
        <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div>
            <p className="text-green-300 text-sm font-medium">已完成章节</p>
            <div className="flex items-center space-x-2 mt-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white text-lg font-bold">
                {progress.completedChapters}/{progress.totalChapters}
              </span>
            </div>
          </div>
        </div>

        {/* 进行中章节 */}
        <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div>
            <p className="text-blue-300 text-sm font-medium">进行中章节</p>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-white text-lg font-bold">
                {progress.inProgressChapters}/{progress.totalChapters}
              </span>
            </div>
          </div>
        </div>

        {/* 总体进度 */}
        <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div>
            <p className="text-purple-300 text-sm font-medium">总体进度</p>
            <div className="flex items-center space-x-2 mt-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-white text-lg font-bold">{progress.overallProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>整体学习进度</span>
          <span>{progress.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// 获取状态样式
function getStatusStyles(status: LearningStatus) {
  switch (status) {
    case 'completed':
      return {
        bg: 'bg-green-500/10 hover:bg-green-500/15',
        border: 'border-green-500/20',
        text: 'text-green-300',
        icon: CheckCircle,
        iconColor: 'text-green-400'
      }
    case 'in_progress':
      return {
        bg: 'bg-blue-500/10 hover:bg-blue-500/15',
        border: 'border-blue-500/20',
        text: 'text-blue-300',
        icon: TrendingUp,
        iconColor: 'text-blue-400'
      }
    default:
      return {
        bg: 'bg-gray-500/10 hover:bg-gray-500/15',
        border: 'border-gray-500/20',
        text: 'text-gray-300',
        icon: Circle,
        iconColor: 'text-gray-400'
      }
  }
}

// 书籍组件
function BookItem({ book, onKnowledgePointClick, isExpanded, onToggle, expandedChapters, onChapterToggle }: BookItemProps) {
  const statusStyles = getStatusStyles(book.status)
  const StatusIcon = statusStyles.icon

  return (
    <div className="mb-4">
      <motion.button
        className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all duration-200 ${statusStyles.bg} ${statusStyles.border}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
            <div className={`p-2 rounded-lg ${statusStyles.bg}`}>
              <StatusIcon className={`w-5 h-5 ${statusStyles.iconColor}`} />
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold text-lg">{book.name}</h3>
            <p className="text-gray-400 text-sm">
              {book.chapters.length} 个章节 • {book.chapters.reduce((total, ch) => total + ch.knowledgePoints.length, 0)} 个知识点
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-white font-medium">{book.progress}%</div>
          <div className="text-xs text-gray-400 mt-1">
            {book.chapters.filter(ch => ch.status === 'completed').length}/{book.chapters.length} 已完成
          </div>
        </div>
      </motion.button>

      {/* 进度条 */}
      <div className="mt-2 px-5">
        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
          <motion.div
            className={`h-1.5 rounded-full ${
              book.status === 'completed'
                ? 'bg-green-500'
                : book.status === 'in_progress'
                ? 'bg-blue-500'
                : 'bg-gray-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${book.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 ml-6 space-y-2">
              {book.chapters.map((chapter) => (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  onKnowledgePointClick={onKnowledgePointClick}
                  isExpanded={expandedChapters.has(chapter.id)}
                  onToggle={() => onChapterToggle(chapter.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 知识点组件
function KnowledgePointItem({
  knowledgePoint,
  onClick
}: {
  knowledgePoint: KnowledgePointWithStatus
  onClick: () => void
}) {
  const statusStyles = getStatusStyles(knowledgePoint.status)
  const StatusIcon = statusStyles.icon

  const getDifficultyColor = (difficulty: KnowledgePoint['difficulty']) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
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
    <motion.div
      className={`ml-8 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${statusStyles.bg} ${statusStyles.border}`}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <StatusIcon className={`w-4 h-4 ${statusStyles.iconColor}`} />
          <h5 className="text-white font-medium text-sm">{knowledgePoint.title}</h5>
          <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(knowledgePoint.difficulty)}`}>
            {getDifficultyText(knowledgePoint.difficulty)}
          </div>
        </div>
        <div className="flex items-center space-x-3 text-gray-400 text-xs">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{knowledgePoint.estimatedTime}分钟</span>
          </div>
          <Play className="w-3 h-3 text-blue-400" />
        </div>
      </div>

      {knowledgePoint.tags && knowledgePoint.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {knowledgePoint.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {knowledgePoint.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-md">
              +{knowledgePoint.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

function ChapterItem({ chapter, onKnowledgePointClick, isExpanded, onToggle }: ChapterItemProps) {
  const statusStyles = getStatusStyles(chapter.status)
  const StatusIcon = statusStyles.icon

  return (
    <div className="mb-3">
      <motion.button
        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${statusStyles.bg} ${statusStyles.border}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
            <StatusIcon className={`w-4 h-4 ${statusStyles.iconColor}`} />
          </div>
          <div className="text-left">
            <h4 className="text-white font-medium">{chapter.name}</h4>
            <p className="text-gray-400 text-sm">
              {chapter.knowledgePoints.length} 个知识点 • {chapter.knowledgePoints.reduce((total, kp) => total + kp.estimatedTime, 0)} 分钟
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-white text-sm font-medium">{chapter.progress}%</div>
          <div className="text-xs text-gray-400">
            {chapter.knowledgePoints.filter(kp => kp.status === 'completed').length}/{chapter.knowledgePoints.length} 已完成
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3">
              {chapter.knowledgePoints.map((knowledgePoint) => (
                <KnowledgePointItem
                  key={knowledgePoint.id}
                  knowledgePoint={knowledgePoint}
                  onClick={() => {
                    console.log('知识点点击:', knowledgePoint.title)
                    onKnowledgePointClick(knowledgePoint)
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ChapterList({ subjectId, onKnowledgePointClick, onProgressUpdate, className = '' }: ChapterListProps) {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set())
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const books = organizeSubjectData(subjectId)
  const learningProgress = useMemo(() => calculateLearningProgress(books), [books])

  // 当进度数据变化时，通知父组件
  React.useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(learningProgress)
    }
  }, [learningProgress.totalChapters, learningProgress.completedChapters, learningProgress.inProgressChapters, learningProgress.overallProgress, onProgressUpdate])

  const toggleBook = (bookId: string) => {
    const newExpanded = new Set(expandedBooks)
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId)
    } else {
      newExpanded.add(bookId)
    }
    setExpandedBooks(newExpanded)
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const expandAll = () => {
    setExpandedBooks(new Set(books.map(b => b.id)))
    setExpandedChapters(new Set(books.flatMap(b => b.chapters.map(c => c.id))))
  }

  const collapseAll = () => {
    setExpandedBooks(new Set())
    setExpandedChapters(new Set())
  }

  if (books.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">暂无章节内容</h3>
          <p className="text-gray-400 mb-4">
            该学科的知识点内容正在准备中，敬请期待！
          </p>
          <div className="text-sm text-gray-500">
            💡 提示：你可以先体验其他已有内容的学科
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* 学科内容头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-400" />
            <span>学科内容</span>
          </h2>
          <p className="text-gray-400 text-sm">
            共 {books.length} 个教材，{learningProgress.totalChapters} 个章节，{learningProgress.totalKnowledgePoints} 个知识点
          </p>
        </div>

        <div className="flex space-x-2">
          <motion.button
            onClick={expandAll}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-sm rounded-lg transition-colors border border-blue-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            展开全部
          </motion.button>
          <motion.button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 text-sm rounded-lg transition-colors border border-gray-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            收起全部
          </motion.button>
        </div>
      </div>

      {/* 三级层次结构：教材 → 章节 → 知识点 */}
      <div className="space-y-4">
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onKnowledgePointClick={onKnowledgePointClick}
            isExpanded={expandedBooks.has(book.id)}
            onToggle={() => toggleBook(book.id)}
            expandedChapters={expandedChapters}
            onChapterToggle={toggleChapter}
          />
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1">学习提示</h4>
            <p className="text-blue-200 text-sm leading-relaxed">
              点击任意知识点可以打开详细的学习卡片，包含完整内容、3D模型演示和多媒体资源。
              建议按照章节顺序学习，注意前置知识点的掌握。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
