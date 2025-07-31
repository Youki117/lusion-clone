'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Subject, KnowledgePoint, GraphNode, GraphEdge } from '@/types'

interface KnowledgeGraphContextType {
  subjects: Subject[]
  setSubjects: (subjects: Subject[]) => void
  selectedSubject: Subject | null
  setSelectedSubject: (subject: Subject | null) => void
  selectedKnowledgePoint: KnowledgePoint | null
  setSelectedKnowledgePoint: (point: KnowledgePoint | null) => void
  graphNodes: GraphNode[]
  setGraphNodes: (nodes: GraphNode[]) => void
  graphEdges: GraphEdge[]
  setGraphEdges: (edges: GraphEdge[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredNodes: GraphNode[]
  viewMode: '2d' | '3d'
  setViewMode: (mode: '2d' | '3d') => void
  zoomLevel: number
  setZoomLevel: (level: number) => void
  highlightNode: (nodeId: string) => void
  clearHighlights: () => void
}

const KnowledgeGraphContext = createContext<KnowledgeGraphContextType | undefined>(undefined)

export const useKnowledgeGraph = () => {
  const context = useContext(KnowledgeGraphContext)
  if (!context) {
    throw new Error('useKnowledgeGraph must be used within a KnowledgeGraphProvider')
  }
  return context
}

interface KnowledgeGraphProviderProps {
  children: React.ReactNode
}

export const KnowledgeGraphProvider: React.FC<KnowledgeGraphProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<KnowledgePoint | null>(null)
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([])
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d')
  const [zoomLevel, setZoomLevel] = useState(1)

  // Filter nodes based on search query
  const filteredNodes = React.useMemo(() => {
    if (!searchQuery.trim()) return graphNodes
    
    return graphNodes.filter(node => 
      node.knowledgePoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.knowledgePoint.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.knowledgePoint.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [graphNodes, searchQuery])

  const highlightNode = useCallback((nodeId: string) => {
    setGraphNodes(prev => prev.map(node => ({
      ...node,
      visual: {
        ...node.visual,
        isHighlighted: node.id === nodeId
      }
    })))
  }, [])

  const clearHighlights = useCallback(() => {
    setGraphNodes(prev => prev.map(node => ({
      ...node,
      visual: {
        ...node.visual,
        isHighlighted: false
      }
    })))
  }, [])

  return (
    <KnowledgeGraphContext.Provider 
      value={{ 
        subjects,
        setSubjects,
        selectedSubject,
        setSelectedSubject,
        selectedKnowledgePoint,
        setSelectedKnowledgePoint,
        graphNodes,
        setGraphNodes,
        graphEdges,
        setGraphEdges,
        isLoading,
        setIsLoading,
        searchQuery,
        setSearchQuery,
        filteredNodes,
        viewMode,
        setViewMode,
        zoomLevel,
        setZoomLevel,
        highlightNode,
        clearHighlights
      }}
    >
      {children}
    </KnowledgeGraphContext.Provider>
  )
}
