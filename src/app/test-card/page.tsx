'use client'

import React, { useState } from 'react'
import { KnowledgePointCard } from '@/components/ui/education/KnowledgePointCard'
import { sampleKnowledgePoints } from '@/data/knowledgePoints'

export default function TestCardPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState(sampleKnowledgePoints[0])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">知识点卡片测试</h1>
        
        <div className="space-y-4">
          {sampleKnowledgePoints.map((point) => (
            <button
              key={point.id}
              onClick={() => {
                setSelectedPoint(point)
                setIsOpen(true)
              }}
              className="block w-full max-w-md mx-auto p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-left transition-colors"
            >
              <h3 className="font-semibold">{point.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {point.difficulty} • {point.estimatedTime}分钟
              </p>
            </button>
          ))}
        </div>
      </div>

      <KnowledgePointCard
        knowledgePoint={selectedPoint}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}
