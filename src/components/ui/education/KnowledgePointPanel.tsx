'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Clock, 
  Star, 
  BookOpen, 
  Play, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Target,
  Award,
  Users
} from 'lucide-react'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'
import { KnowledgePoint, Resource, Exercise } from '@/types'

interface KnowledgePointPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

function ResourceItem({ resource }: { resource: Resource }) {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'article': return <FileText className="w-4 h-4" />
      case 'interactive': return <Target className="w-4 h-4" />
      case 'model3d': return <Award className="w-4 h-4" />
      case 'simulation': return <Users className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getResourceColor = (type: Resource['type']) => {
    switch (type) {
      case 'video': return 'text-red-400'
      case 'article': return 'text-blue-400'
      case 'interactive': return 'text-green-400'
      case 'model3d': return 'text-purple-400'
      case 'simulation': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <motion.div
      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${getResourceColor(resource.type)}`}>
        {getResourceIcon(resource.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{resource.title}</h4>
        <p className="text-xs text-gray-400 truncate">{resource.description}</p>
        {resource.duration && (
          <div className="flex items-center space-x-1 mt-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              {Math.floor(resource.duration / 60)}:{(resource.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400" />
    </motion.div>
  )
}

function ExerciseItem({ exercise }: { exercise: Exercise }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <motion.div
      className="border border-white/10 rounded-lg overflow-hidden"
      initial={false}
      animate={{ backgroundColor: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-white">{exercise.question}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
          <span className="text-xs text-gray-400">{exercise.points}分</span>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-3 space-y-3">
              {exercise.options && (
                <div>
                  <h5 className="text-xs font-medium text-gray-300 mb-2">选项:</h5>
                  <div className="space-y-1">
                    {exercise.options.map((option, index) => (
                      <div key={index} className="text-sm text-gray-400">
                        {String.fromCharCode(65 + index)}. {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h5 className="text-xs font-medium text-gray-300 mb-1">解析:</h5>
                <p className="text-sm text-gray-400">{exercise.explanation}</p>
              </div>
              
              <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                开始练习
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function KnowledgePointPanel({ isOpen, onClose, className = '' }: KnowledgePointPanelProps) {
  const { selectedKnowledgePoint } = useKnowledgeGraph()
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'exercises'>('overview')

  if (!selectedKnowledgePoint) return null

  const getDifficultyColor = (difficulty: KnowledgePoint['difficulty']) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed right-0 top-0 h-full w-96 bg-black/40 backdrop-blur-xl border-l border-white/20 z-50 ${className}`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="flex flex-col h-full">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white">知识点详情</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* 标签页 */}
            <div className="flex border-b border-white/20">
              {[
                { key: 'overview', label: '概览' },
                { key: 'resources', label: '资源' },
                { key: 'exercises', label: '练习' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* 标题和难度 */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {selectedKnowledgePoint.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(selectedKnowledgePoint.difficulty)}`}>
                          {selectedKnowledgePoint.difficulty}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{selectedKnowledgePoint.estimatedTime}分钟</span>
                        </div>
                      </div>
                    </div>

                    {/* 内容描述 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">内容描述</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {selectedKnowledgePoint.content}
                      </p>
                    </div>

                    {/* 标签 */}
                    {selectedKnowledgePoint.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">标签</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedKnowledgePoint.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 前置知识 */}
                    {selectedKnowledgePoint.prerequisites.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">前置知识</h4>
                        <div className="space-y-2">
                          {selectedKnowledgePoint.prerequisites.map((prereq, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg"
                            >
                              <BookOpen className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">{prereq}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {selectedKnowledgePoint.resources.length > 0 ? (
                      selectedKnowledgePoint.resources.map((resource) => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>暂无学习资源</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'exercises' && (
                  <motion.div
                    key="exercises"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {selectedKnowledgePoint.exercises.length > 0 ? (
                      selectedKnowledgePoint.exercises.map((exercise) => (
                        <ExerciseItem key={exercise.id} exercise={exercise} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>暂无练习题目</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
