'use client'

import React from 'react'
import { TreeKnowledgeGraph } from '@/components/ui/education/TreeKnowledgeGraph'
import { getSubjectById } from '@/data/subjects'

export default function TestGraphPage() {
  const mathSubject = getSubjectById('math')

  const handleNodeClick = (node: any) => {
    console.log('节点点击:', node)
    alert(`点击了节点: ${node.name}`)
  }

  const handleNodeHover = (node: any) => {
    console.log('节点悬停:', node)
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🌌 知识图谱3D可视化测试
        </h1>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
          <h2 className="text-xl text-white mb-3 flex items-center">
            <span className="mr-2">🚀</span>
            技术实现亮点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                CSS 3D Transform实现
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                避免Three.js的SSR问题
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                智能布局算法优化
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">🎯</span>
                节点悬停和点击交互
              </div>
              <div className="flex items-center">
                <span className="text-purple-400 mr-2">🎨</span>
                状态可视化系统
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">⚡</span>
                流畅的3D旋转动画
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] bg-gray-900 rounded-lg overflow-hidden">
          {mathSubject ? (
            <TreeKnowledgeGraph
              subject={mathSubject}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              加载中...
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl text-white mb-2">🎯 功能特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-2">视觉设计</h3>
              <ul className="space-y-1">
                <li>• 📚 学科节点（中心，最大）</li>
                <li>• 📖 章节节点（环绕分布）</li>
                <li>• 🎯 知识点节点（分散分布）</li>
                <li>• 🎨 状态颜色编码</li>
                <li>• ✨ 悬停发光效果</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">交互功能</h3>
              <ul className="space-y-1">
                <li>• 🖱️ 鼠标悬停显示详情</li>
                <li>• 🎯 点击节点深入探索</li>
                <li>• 📊 实时状态更新</li>
                <li>• 🔍 智能信息面板</li>
                <li>• 📱 响应式设计</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
