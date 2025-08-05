'use client'

import React, { useState } from 'react'
import { ChapterList } from '@/components/ui/education/ChapterList'
import { KnowledgePoint } from '@/types'

export default function TestSearchPage() {
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<KnowledgePoint | null>(null)

  const handleKnowledgePointClick = (knowledgePoint: any) => {
    console.log('点击知识点:', knowledgePoint)
    setSelectedKnowledgePoint(knowledgePoint)
  }

  const handleProgressUpdate = (progress: any) => {
    console.log('进度更新:', progress)
  }

  const handleSearchResultsUpdate = (results: any) => {
    console.log('搜索结果更新:', results)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">搜索功能测试</h1>
        <ChapterList
          subjectId="mathematics"
          onKnowledgePointClick={handleKnowledgePointClick}
          onProgressUpdate={handleProgressUpdate}
          onSearchResultsUpdate={handleSearchResultsUpdate}
        />
      </div>
    </div>
  )
} 