'use client'

import { useSearchParams } from 'next/navigation'
import { getSubjectById, subjects } from '@/data/subjects'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const searchParams = useSearchParams()
  const [debugInfo, setDebugInfo] = useState<any>({})

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
    
    setDebugInfo({
      subjectParam,
      subjectId,
      subject,
      allSubjects: subjects.map(s => ({ id: s.id, name: s.name })),
      availableParams: Object.keys(subjectIdMap)
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 调试信息</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">URL 参数</h2>
          <div className="space-y-2">
            <div><strong>subject参数:</strong> {debugInfo.subjectParam}</div>
            <div><strong>映射后ID:</strong> {debugInfo.subjectId}</div>
            <div><strong>找到学科:</strong> {debugInfo.subject ? '✅ 是' : '❌ 否'}</div>
          </div>
        </div>

        {debugInfo.subject && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">学科信息</h2>
            <div className="space-y-2">
              <div><strong>ID:</strong> {debugInfo.subject.id}</div>
              <div><strong>名称:</strong> {debugInfo.subject.name}</div>
              <div><strong>图标:</strong> {debugInfo.subject.icon}</div>
              <div><strong>章节数:</strong> {debugInfo.subject.chapters?.length}</div>
              <div><strong>知识点数:</strong> {debugInfo.subject.knowledgePoints}</div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">可用参数</h2>
          <div className="grid grid-cols-3 gap-2">
            {debugInfo.availableParams?.map((param: string) => (
              <a
                key={param}
                href={`/education?subject=${param}`}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-center transition-colors"
              >
                {param}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">所有学科</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {debugInfo.allSubjects?.map((subject: any) => (
              <div key={subject.id} className="bg-gray-700 px-3 py-2 rounded">
                <strong>{subject.id}</strong>: {subject.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">测试链接</h2>
          <div className="space-y-2">
            <a href="/education?subject=math" className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors">
              📐 数学 (math → mathematics)
            </a>
            <a href="/education?subject=physics" className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              ⚛️ 物理 (physics → physics)
            </a>
            <a href="/test-graph" className="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
              🧪 测试页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
