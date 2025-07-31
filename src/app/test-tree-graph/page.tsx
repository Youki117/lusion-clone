'use client'

import React from 'react'
import { TreeKnowledgeGraph } from '@/components/ui/education/TreeKnowledgeGraph'
import { getSubjectById } from '@/data/subjects'

export default function TestTreeGraphPage() {
  const mathSubject = getSubjectById('mathematics')
  
  if (!mathSubject) {
    return <div>学科数据未找到</div>
  }

  const handleNodeClick = (node: any) => {
    console.log('节点点击:', node)
  }

  const handleNodeHover = (node: any) => {
    console.log('节点悬停:', node)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          树形知识图谱测试
        </h1>
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 h-[800px]">
          <TreeKnowledgeGraph
            subject={mathSubject}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
          />
        </div>
      </div>
    </div>
  )
}
