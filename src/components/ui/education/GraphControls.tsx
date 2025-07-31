'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Layers,
  Target
} from 'lucide-react'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'

interface GraphControlsProps {
  className?: string
  onResetView?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onToggleGrid?: () => void
}

export function GraphControls({
  className = '',
  onResetView,
  onZoomIn,
  onZoomOut,
  onToggleGrid
}: GraphControlsProps) {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    zoomLevel,
    setZoomLevel,
    graphNodes,
    filteredNodes,
    clearHighlights
  } = useKnowledgeGraph()

  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(['basic', 'intermediate', 'advanced'])
  const [showConnections, setShowConnections] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [setSearchQuery])

  const handleDifficultyFilter = useCallback((difficulty: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }, [])

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedDifficulty(['basic', 'intermediate', 'advanced'])
    clearHighlights()
  }, [setSearchQuery, clearHighlights])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 搜索栏 */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
          <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-300">
            找到 {filteredNodes.length} / {graphNodes.length} 个节点
          </div>
        )}
      </motion.div>

      {/* 控制按钮组 */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* 视图模式切换 */}
        <div className="flex bg-black/20 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              viewMode === '2d'
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              viewMode === '3d'
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            3D
          </button>
        </div>



        {/* 缩放控制 */}
        <div className="flex bg-black/20 backdrop-blur-sm rounded-lg">
          <button
            onClick={onZoomOut}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomIn}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* 筛选器 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters 
              ? 'bg-blue-500 text-white' 
              : 'bg-black/20 backdrop-blur-sm text-gray-300 hover:text-white'
          }`}
          title="筛选器"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* 设置 */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${
            showSettings 
              ? 'bg-blue-500 text-white' 
              : 'bg-black/20 backdrop-blur-sm text-gray-300 hover:text-white'
          }`}
          title="设置"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* 重置视图 */}
        <button
          onClick={onResetView}
          className="p-2 bg-black/20 backdrop-blur-sm text-gray-300 hover:text-white rounded-lg transition-colors"
          title="重置视图"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 网格切换 */}
        <button
          onClick={onToggleGrid}
          className="p-2 bg-black/20 backdrop-blur-sm text-gray-300 hover:text-white rounded-lg transition-colors"
          title="切换网格"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </motion.div>

      {/* 筛选器面板 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium text-white mb-3">筛选条件</h3>
            
            {/* 难度筛选 */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300">难度等级</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'basic', label: '基础', color: 'bg-green-500' },
                  { key: 'intermediate', label: '中等', color: 'bg-yellow-500' },
                  { key: 'advanced', label: '困难', color: 'bg-red-500' }
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => handleDifficultyFilter(key)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs transition-all ${
                      selectedDifficulty.includes(key)
                        ? 'bg-white/20 text-white'
                        : 'bg-black/20 text-gray-400'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 重置按钮 */}
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
            >
              重置筛选
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium text-white mb-3">显示设置</h3>
            
            <div className="space-y-3">
              {/* 连接线显示 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">显示连接线</span>
                <button
                  onClick={() => setShowConnections(!showConnections)}
                  className="p-1"
                >
                  {showConnections ? (
                    <Eye className="w-4 h-4 text-blue-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* 标签显示 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">显示标签</span>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="p-1"
                >
                  {showLabels ? (
                    <Eye className="w-4 h-4 text-blue-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* 缩放级别 */}
              <div>
                <label className="text-xs text-gray-300 block mb-1">缩放级别</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{zoomLevel.toFixed(1)}x</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 难度图例 */}
      <motion.div
        className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="text-sm font-medium mb-2 text-white">难度图例</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>基础</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>中等</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>困难</span>
          </div>
        </div>
      </motion.div>

      {/* 统计信息 */}
      <motion.div
        className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <span>节点: {filteredNodes.length}/{graphNodes.length}</span>
          <span>缩放: {zoomLevel.toFixed(1)}x</span>
        </div>
      </motion.div>
    </div>
  )
}
