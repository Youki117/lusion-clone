'use client'

import React, { useState } from 'react'
import { KnowledgePointCard } from '@/components/ui/education/KnowledgePointCard'
import { sampleKnowledgePoints } from '@/data/knowledgePoints'

export default function TestAIQueryPage() {
  const [selectedPoint, setSelectedPoint] = useState(sampleKnowledgePoints[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">AI询问功能测试</h1>
        
        <div className="space-y-4 mb-8">
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

        <div className="text-gray-400 text-sm space-y-2">
          <p>🔍 <strong>测试功能：</strong></p>
          <p>1. 点击知识点卡片打开详情</p>
          <p>2. 点击右上角的消息图标打开AI询问窗口</p>
          <p>3. 选择知识点内容并复制，AI窗口会自动打开并预加载内容</p>
          <p>4. 使用快捷选项快速提问</p>
          <p>5. 观察三栏布局的动画效果</p>
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
