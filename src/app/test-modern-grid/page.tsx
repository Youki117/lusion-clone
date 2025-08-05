'use client'

import React from 'react'
import { ModernSubjectGrid } from '@/components/ui/ModernSubjectGrid'
import { ModernSectionHeader } from '@/components/ui/ModernSectionHeader'
import { BookOpen, Zap, Star } from 'lucide-react'

export default function TestModernGridPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-12">
        <ModernSectionHeader
          title="现代化学科网格测试"
          subtitle="测试所有现代化功能和动画效果，包括渐变色、粒子动画、3D效果等"
          icon={<Star className="w-8 h-8 text-yellow-400" />}
          stats={[
            {
              icon: <BookOpen className="w-4 h-4" />,
              label: '个学科',
              value: 9,
              color: '#3b82f6'
            },
            {
              icon: <Zap className="w-4 h-4" />,
              label: '个功能',
              value: 15,
              color: '#fbbf24'
            }
          ]}
        />
        
        <ModernSubjectGrid className="mt-8" />
      </div>
    </div>
  )
} 