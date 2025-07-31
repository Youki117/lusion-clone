'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, X } from 'lucide-react'

// 增强的Markdown渲染函数
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let currentListItems: React.ReactNode[] = []
  let currentTableRows: React.ReactNode[] = []
  let listIndex = 0
  let tableIndex = 0
  let isInTable = false

  // 处理行内的**粗体**格式
  const processInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-gray-800">
            {part.replace(/\*\*/g, '')}
          </strong>
        )
      }
      return part
    })
  }

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <div key={`list-${listIndex++}`} className="space-y-1 mb-2">
          {currentListItems}
        </div>
      )
      currentListItems = []
    }
  }

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      elements.push(
        <div key={`table-${tableIndex++}`} className="mb-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-xs">
            <tbody>
              {currentTableRows}
            </tbody>
          </table>
        </div>
      )
      currentTableRows = []
      isInTable = false
    }
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushList()
      flushTable()
      elements.push(<div key={`br-${index}`} className="h-2" />)
      return
    }

    // 检测表格行（包含 | 分隔符）
    if (trimmedLine.includes('|') && trimmedLine.split('|').length >= 3) {
      flushList()

      // 跳过表格分隔行（如 |---|---|）
      if (trimmedLine.match(/^\|[\s\-\|:]+\|$/)) {
        return
      }

      isInTable = true
      const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '')

      // 判断是否为表头（第一行或包含特殊格式）
      const isHeader = currentTableRows.length === 0 || cells.some(cell => cell.includes('**'))

      currentTableRows.push(
        <tr key={`table-row-${index}`} className={isHeader ? 'bg-gray-100' : 'bg-white'}>
          {cells.map((cell, cellIndex) => {
            const CellTag = isHeader ? 'th' : 'td'
            return (
              <CellTag
                key={cellIndex}
                className={`border border-gray-300 px-2 py-1 text-left ${
                  isHeader ? 'font-semibold bg-gray-50' : ''
                }`}
              >
                {processInlineFormatting(cell)}
              </CellTag>
            )
          })}
        </tr>
      )
      return
    } else if (isInTable) {
      // 如果之前在表格中，但当前行不是表格行，则结束表格
      flushTable()
    }

    // 处理标题
    if (trimmedLine.startsWith('### ')) {
      flushList()
      flushTable()
      elements.push(
        <h3 key={`h3-${index}`} className="font-semibold text-sm mt-3 mb-2 text-blue-600">
          {trimmedLine.replace('### ', '')}
        </h3>
      )
      return
    }

    if (trimmedLine.startsWith('## ')) {
      flushList()
      flushTable()
      elements.push(
        <h2 key={`h2-${index}`} className="font-bold text-base mt-3 mb-2 text-blue-700">
          {trimmedLine.replace('## ', '')}
        </h2>
      )
      return
    }

    // 处理编号列表项
    if (trimmedLine.match(/^\d+\.\s+\*\*.*\*\*:/)) {
      flushTable()
      const match = trimmedLine.match(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/)
      if (match) {
        const [, number, title, description] = match
        elements.push(
          <div key={`numbered-item-${index}`} className="mb-2">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 font-medium text-sm">{number}.</span>
              <div className="flex-1">
                <span className="font-semibold text-gray-800 text-sm">{title}</span>
                {description && <span className="text-gray-600 text-sm">: {description}</span>}
              </div>
            </div>
          </div>
        )
      }
      return
    }

    // 处理普通编号列表项
    if (trimmedLine.match(/^\d+\.\s/)) {
      flushTable()
      elements.push(
        <div key={`list-${index}`} className="ml-2 mb-1">
          <span className="font-medium text-sm">{trimmedLine}</span>
        </div>
      )
      return
    }

    // 普通段落
    flushList()
    flushTable()
    elements.push(
      <p key={`para-${index}`} className="mb-2 leading-relaxed text-sm text-gray-700">
        {processInlineFormatting(trimmedLine)}
      </p>
    )
  })

  // 处理最后的列表和表格
  flushList()
  flushTable()

  return elements
}

interface ChatBubble {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface FloatingChatBubblesProps {
  isVisible: boolean
  onClose: () => void
  bubbles: ChatBubble[]
  className?: string
  style?: React.CSSProperties
}

export function FloatingChatBubbles({
  isVisible,
  onClose,
  bubbles,
  className = '',
  style = {}
}: FloatingChatBubblesProps) {
  if (!isVisible) return null

  return (
    <div className={`${className} relative w-[480px] h-full`} style={style}>
      <AnimatePresence>
        {/* 头部关闭按钮 */}
        <div className="flex justify-end mb-4">
          <motion.button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* 对话内容区域 - 移除背景容器 */}
        <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto pr-2 chat-messages">

            {/* 对话气泡 */}
            {bubbles.map((bubble, index) => (
              <motion.div
                key={bubble.id}
                className={`flex ${bubble.type === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
              >
                <div className={`max-w-[360px] ${bubble.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${bubble.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* 头像 - 马卡龙色 */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      bubble.type === 'user'
                        ? 'bg-gradient-to-br from-pink-400 to-rose-400'
                        : 'bg-gradient-to-br from-purple-400 to-indigo-400'
                    }`}>
                      {bubble.type === 'user' ? (
                        <User className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>

                    {/* 消息气泡 - 马卡龙色 */}
                    <div className={`relative ${
                      bubble.type === 'user'
                        ? 'bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200/60'
                        : 'bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/60'
                    } rounded-xl px-4 py-3 backdrop-blur-sm shadow-lg`}>
                      {/* 气泡尖角 - 马卡龙色 */}
                      <div className={`absolute top-3 w-0 h-0 ${
                        bubble.type === 'user'
                          ? 'right-[-6px] border-l-[6px] border-l-pink-100 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'
                          : 'left-[-6px] border-r-[6px] border-r-purple-50 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'
                      }`} />

                      <div className={`text-sm leading-relaxed ${
                        bubble.type === 'user' ? 'text-rose-800' : 'text-indigo-800'
                      }`}>
                        {renderMarkdown(bubble.content)}
                      </div>

                      {/* 时间戳 */}
                      <div className={`text-xs mt-2 ${
                        bubble.type === 'user' ? 'text-rose-500' : 'text-indigo-500'
                      }`}>
                        {bubble.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}


        </div>
      </AnimatePresence>
    </div>
  )
}
