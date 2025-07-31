'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, Loader2 } from 'lucide-react'

interface AIQueryInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  preloadedContent?: string
  className?: string
}

export function AIQueryInput({ 
  onSendMessage, 
  isLoading = false,
  placeholder = "向AI提问...",
  preloadedContent = '',
  className = '' 
}: AIQueryInputProps) {
  const [inputValue, setInputValue] = useState(preloadedContent)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return
    
    onSendMessage(inputValue.trim())
    setInputValue('')
  }

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 当预加载内容变化时更新输入框
  React.useEffect(() => {
    if (preloadedContent && preloadedContent.trim()) {
      setInputValue(`关于以下内容，我想了解：\n\n${preloadedContent}\n\n`)
      // 聚焦到输入框
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
      }, 100)
    }
  }, [preloadedContent])

  return (
    <motion.div
      className={`bg-white/5 border border-white/10 rounded-lg p-3 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-2">
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-3 h-3 text-white" />
        </div>
        
        <div className="flex-1 space-y-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm resize-none focus:outline-none"
            rows={2}
            disabled={isLoading}
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <Send className="w-3 h-3 text-white" />
              )}
              <span className="text-white text-xs">
                {isLoading ? '发送中...' : '发送'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
