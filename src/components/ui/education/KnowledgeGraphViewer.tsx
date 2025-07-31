'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'
import { TreeKnowledgeGraph } from './TreeKnowledgeGraph'
import { KnowledgePointPanel } from './KnowledgePointPanel'
import { KnowledgePointCard } from './KnowledgePointCard'
import { GraphNode, GraphEdge, KnowledgePoint } from '@/types'
import { getSubjectById } from '@/data/subjects'
import { getKnowledgePointsBySubject, getKnowledgePointById } from '@/data/subjectKnowledgePoints'
import SubjectStarfield from './SubjectStarfield'

interface KnowledgeGraphViewerProps {
  className?: string
}

// 生成学科特定数据的函数
function generateSubjectData(subjectId?: string): { nodes: GraphNode[], edges: GraphEdge[] } {
  // 使用新的知识点数据源
  const sampleKnowledgePoints = subjectId ? getKnowledgePointsBySubject(subjectId) : []

  // 生成节点
  const nodes: GraphNode[] = sampleKnowledgePoints.map((kp, index) => {
    const angle = (index / sampleKnowledgePoints.length) * 2 * Math.PI
    const radius = 8
    const difficultyColors = {
      basic: '#10b981',
      intermediate: '#f59e0b',
      advanced: '#ef4444'
    }
    
    return {
      id: kp.id,
      knowledgePoint: kp,
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 4
      },
      visual: {
        color: difficultyColors[kp.difficulty],
        size: kp.difficulty === 'basic' ? 0.8 : kp.difficulty === 'intermediate' ? 1.0 : 1.2,
        shape: 'circle',
        isHighlighted: false,
        isSelected: false,
        opacity: 0.8
      },
      connections: kp.prerequisites
    }
  })

  // 生成边
  const edges: GraphEdge[] = []
  nodes.forEach(node => {
    node.knowledgePoint.prerequisites.forEach(prereqId => {
      const prereqNode = nodes.find(n => n.id === prereqId)
      if (prereqNode) {
        edges.push({
          id: `edge-${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          type: 'prerequisite',
          strength: 0.8,
          visual: {
            color: '#6366f1',
            width: 2,
            style: 'solid',
            animated: false
          }
        })
      }
    })
  })

  return { nodes, edges }
}

export function KnowledgeGraphViewer({ className = '' }: KnowledgeGraphViewerProps) {
  const searchParams = useSearchParams()
  const {
    graphNodes,
    setGraphNodes,
    graphEdges,
    setGraphEdges,
    selectedKnowledgePoint,
    viewMode
  } = useKnowledgeGraph()

  const [showPanel, setShowPanel] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<any>(null)
  const [hoveredNode, setHoveredNode] = useState<any>(null)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  // 知识点卡片状态
  const [selectedKnowledgePointForCard, setSelectedKnowledgePointForCard] = useState<KnowledgePoint | null>(null)
  const [isKnowledgeCardOpen, setIsKnowledgeCardOpen] = useState(false)


  // 监听URL参数变化
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
    setIsInitialized(true)
  }, [searchParams])

  // 处理窗口尺寸变化
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // 当选中知识点时显示面板
  useEffect(() => {
    setShowPanel(!!selectedKnowledgePoint)
  }, [selectedKnowledgePoint])



  const handleClosePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  const handleNodeClick = useCallback((node: any) => {
    console.log('节点点击:', node)

    // 检查节点类型，只对知识点级别的节点打开知识卡片
    // 如果节点有 knowledgePoints 属性，说明这是一个章节，不打开知识卡片
    if (node && node.knowledgePoints && Array.isArray(node.knowledgePoints)) {
      console.log('章节点击，不打开知识卡片:', node.name)
      return
    }

    // 检查节点名称是否包含"必修"、"选择性必修"等章节特征
    if (node && node.name && (
      node.name.includes('必修') ||
      node.name.includes('选择性必修') ||
      node.name.includes('第') && node.name.includes('章')
    )) {
      console.log('检测到章节节点（根据名称），不打开知识卡片:', node.name)
      return
    }

    // 如果节点有知识点数据，打开知识点卡片
    if (node && node.knowledgePoint) {
      setSelectedKnowledgePointForCard(node.knowledgePoint)
      setIsKnowledgeCardOpen(true)
    } else if (node && node.id) {
      // 尝试通过ID获取知识点数据
      const knowledgePoint = getKnowledgePointById(node.id)
      if (knowledgePoint) {
        setSelectedKnowledgePointForCard(knowledgePoint)
        setIsKnowledgeCardOpen(true)
      } else {
        // 如果没有找到知识点数据，并且节点名称不是"知识点"开头，则不打开卡片
        if (node.name && !node.name.startsWith('知识点')) {
          console.log('非知识点节点，不打开知识卡片:', node.name)
          return
        }

        // 如果没有找到知识点数据，创建一个临时的知识点对象用于展示
        const tempKnowledgePoint = {
          id: node.id,
          chapterId: 'temp-chapter',
          title: node.title || node.name || '知识点',
          content: node.description || '这是一个示例知识点，详细内容正在准备中...',
          difficulty: (node.difficulty as 'basic' | 'intermediate' | 'advanced') || 'basic',
          tags: ['示例', '待完善'],
          prerequisites: [],
          resources: [
            {
              id: 'temp-resource-1',
              type: 'article' as const,
              title: '相关学习资料',
              url: '#',
              description: '更多学习资源正在准备中'
            }
          ],
          exercises: [],
          estimatedTime: node.estimatedTime || 30
        }
        setSelectedKnowledgePointForCard(tempKnowledgePoint)
        setIsKnowledgeCardOpen(true)
      }
    }
  }, [])

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node)
  }, [])

  // 知识点卡片关闭处理
  const handleCloseKnowledgeCard = useCallback(() => {
    setIsKnowledgeCardOpen(false)
    setSelectedKnowledgePointForCard(null)
  }, [])

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 学科主题星空背景 - 移除蓝色背景让星空显示 */}
      <div className="absolute inset-0">
        <SubjectStarfield
          subject={currentSubject}
          width={dimensions.width}
          height={dimensions.height}
          className="opacity-80"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 flex h-full">
        {/* 图谱显示区域 */}
        <div className="flex-1 relative min-w-0">
          {currentSubject ? (
            <TreeKnowledgeGraph
              subject={currentSubject}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>正在加载知识图谱...</p>
              </div>
            </div>
          )}

          {/* 学科信息覆盖层 */}
          {currentSubject && (
            <motion.div
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-medium mb-1 flex items-center space-x-2">
                <span>{currentSubject.icon}</span>
                <span>{currentSubject.name}</span>
              </h3>
              <p className="text-xs text-gray-300">
                3D知识图谱可视化
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {currentSubject.chapters.length} 个章节 | {currentSubject.knowledgePoints} 个知识点
              </p>
            </motion.div>
          )}
        </div>

        {/* 右侧知识点详情面板 */}
        <KnowledgePointPanel
          isOpen={showPanel}
          onClose={handleClosePanel}
        />
      </div>

      {/* 知识点卡片 */}
      {selectedKnowledgePointForCard && (
        <KnowledgePointCard
          knowledgePoint={selectedKnowledgePointForCard}
          isOpen={isKnowledgeCardOpen}
          onClose={handleCloseKnowledgeCard}
        />
      )}
    </div>
  )
}
