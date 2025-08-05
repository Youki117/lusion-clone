'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  Lightbulb, 
  BookOpen, 
  Target,
  Loader2,
  X
} from 'lucide-react'
import { AIService } from '@/services/aiService'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface AIQueryPanelProps {
  isOpen: boolean
  onClose: () => void
  knowledgePointTitle: string
  preloadedContent?: string
  className?: string
}

export function AIQueryPanel({ 
  isOpen, 
  onClose, 
  knowledgePointTitle, 
  preloadedContent = '',
  className = '' 
}: AIQueryPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 快捷选项
  const quickOptions = [
    {
      icon: Lightbulb,
      text: '知识点讲解',
      prompt: `请详细讲解"${knowledgePointTitle}"这个知识点，包括核心概念、重要性和应用场景。`
    },
    {
      icon: Target,
      text: '相关题型分析',
      prompt: `请分析"${knowledgePointTitle}"可能会出现的题型，以及与其他知识点的联动关系。`
    },
    {
      icon: BookOpen,
      text: '学习建议',
      prompt: `针对"${knowledgePointTitle}"这个知识点，请给出具体的学习方法和记忆技巧。`
    }
  ]

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 预加载内容处理
  useEffect(() => {
    if (preloadedContent && preloadedContent.trim()) {
      setInputValue(`关于以下内容，我想了解：\n\n${preloadedContent}\n\n`)
      // 聚焦到输入框
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
      }, 100)
    }
  }, [preloadedContent])

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    try {
      // 构建知识点上下文
      const context = {
        relatedPoints: [],
        userProgress: {
          subjectProgress: [],
          totalPoints: 0,
          level: 1,
          achievements: [],
          streakDays: 0,
          lastStudyDate: new Date()
        },
        difficulty: 'basic' as const
      }

      // 调用真实的AI服务
      const response = await AIService.generateResponse(
        messageContent,
        context,
        messages.map(msg => ({
          id: msg.id,
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        }))
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI响应失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，AI服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 使用快捷选项
  const handleQuickOption = (prompt: string) => {
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  // 复制消息内容
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50 ${className}`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0
          }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* 头部 */}
          <div className="flex-shrink-0 p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-medium text-white">AI助手</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                title="关闭"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* 快捷选项 */}
          {messages.length === 0 && (
            <div className="flex-shrink-0 p-4 border-b border-white/10">
              <h4 className="text-xs font-medium text-gray-400 mb-3">快捷提问</h4>
              <div className="space-y-2">
                {quickOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickOption(option.prompt)}
                    className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <option.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 chat-messages">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                <Bot className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                <p>你好！我是AI学习助手</p>
                <p className="text-xs mt-1">有什么关于"{knowledgePointTitle}"的问题吗？</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-indigo-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`relative group ${
                      message.type === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'bg-white/5 border border-white/10'
                    } rounded-lg p-3`}>
                      <div className="text-sm text-white whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <button
                        onClick={() => handleCopyMessage(message.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                        title="复制"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      <span className="text-sm text-gray-400">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="flex-shrink-0 p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
