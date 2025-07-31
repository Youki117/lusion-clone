'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  MoreVertical,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  Settings,
  Key,
  Image as ImageIcon,
  Camera
} from 'lucide-react'
import { useAI } from '@/components/providers/AIProvider'
import { useKnowledgeGraph } from '@/components/providers/KnowledgeGraphProvider'
import { ChatMessage } from '@/types'
import { ApiKeyConfig } from './ApiKeyConfig'
import { MultiApiConfig } from './MultiApiConfig'
import { ImageUpload } from './ImageUpload'
import { MessageContent } from './MessageContent'
import { AIService } from '@/services/aiService'

interface MessageBubbleProps {
  message: ChatMessage
  isTyping?: boolean
}

function MessageBubble({ message, isTyping = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : isSystem ? 'bg-purple-500' : 'bg-green-500'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* 消息内容 */}
        <div className={`relative ${isUser ? 'bg-blue-500' : 'bg-gray-700'} rounded-2xl px-4 py-3 text-white`}>
          {/* 消息文本 */}
          <div className="text-sm leading-relaxed">
            {isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-gray-400 text-xs ml-2">AI正在思考...</span>
              </div>
            ) : (
              <MessageContent content={message.content} />
            )}
          </div>

          {/* 知识上下文标签 */}
          {message.knowledgeContext && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center space-x-2 text-xs text-white/80">
                <BookOpen className="w-3 h-3" />
                <span>相关知识点: {message.knowledgeContext.currentKnowledgePoint?.title}</span>
              </div>
            </div>
          )}

          {/* 时间戳 */}
          <div className={`text-xs text-white/60 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* 消息尾巴 */}
          <div className={`absolute top-3 ${isUser ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'} w-0 h-0 border-t-4 border-b-4 border-transparent ${
            isUser ? 'border-l-4 border-l-blue-500' : 'border-r-4 border-r-gray-700'
          }`} />
        </div>
      </div>
    </motion.div>
  )
}

function QuickActions({ onActionClick }: { onActionClick: (action: string) => void }) {
  const actions = [
    { id: 'explain', icon: Lightbulb, label: '解释概念', color: 'bg-yellow-500' },
    { id: 'example', icon: Target, label: '举个例子', color: 'bg-green-500' },
    { id: 'practice', icon: Zap, label: '练习题目', color: 'bg-purple-500' },
    { id: 'related', icon: BookOpen, label: '相关知识', color: 'bg-blue-500' }
  ]

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className={`flex items-center space-x-2 px-3 py-2 ${action.color} text-white text-xs rounded-full hover:opacity-80 transition-opacity`}
        >
          <action.icon className="w-3 h-3" />
          <span>{action.label}</span>
        </button>
      ))}
    </motion.div>
  )
}

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className = '' }: ChatInterfaceProps) {
  const {
    chatHistory,
    isProcessing,
    sendMessage,
    clearHistory,
    knowledgeContext
  } = useAI()

  const { selectedKnowledgePoint } = useKnowledgeGraph()

  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [showMultiApiConfig, setShowMultiApiConfig] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [currentImage, setCurrentImage] = useState<{ data: string; file: File } | null>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 检查API密钥状态
  useEffect(() => {
    setHasApiKey(AIService.hasApiKey())
  }, [])

  // 处理全局错误
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // 过滤掉浏览器扩展相关的错误
      if (event.message.includes('listener indicated an asynchronous response') ||
          event.message.includes('message channel closed')) {
        console.warn('忽略浏览器扩展错误:', event.message)
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 过滤掉浏览器扩展相关的Promise拒绝
      if (event.reason?.message?.includes('listener indicated an asynchronous response') ||
          event.reason?.message?.includes('message channel closed')) {
        console.warn('忽略浏览器扩展Promise拒绝:', event.reason?.message)
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, isProcessing, scrollToBottom])

  // 当图片上传状态改变时也滚动到底部
  useEffect(() => {
    if (showImageUpload) {
      // 延迟滚动，等待动画完成
      setTimeout(scrollToBottom, 300)
    }
  }, [showImageUpload, scrollToBottom])

  // 检测滚动位置
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollIndicator(!isNearBottom && chatHistory.length > 3)
  }, [chatHistory.length])

  // 添加滚动监听
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // 发送消息
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isProcessing) return

    const message = inputValue.trim()
    setInputValue('')
    setShowQuickActions(false)

    // 发送用户消息
    sendMessage(message, 'user')
  }, [inputValue, isProcessing, sendMessage])

  // 处理API密钥设置
  const handleApiKeySet = useCallback((hasKey: boolean) => {
    setHasApiKey(hasKey)
  }, [])

  // 处理图片上传
  const handleImageSelect = useCallback(async (imageData: string, file: File) => {
    setCurrentImage({ data: imageData, file })
    setIsAnalyzingImage(true)
    setShowQuickActions(false)

    try {
      // 构建包含图片的消息
      const userMessage = inputValue.trim() || '请帮我分析这张图片中的题目'

      // 发送用户消息（包含图片信息）
      sendMessage(`${userMessage} [已上传图片: ${file.name}]`, 'user')

      // 分析图片
      const analysisResult = await AIService.analyzeImage(
        imageData,
        userMessage,
        knowledgeContext || undefined
      )

      // 发送AI分析结果
      sendMessage(analysisResult, 'assistant')

      // 清空输入
      setInputValue('')

    } catch (error) {
      console.error('图片分析失败:', error)
      sendMessage('抱歉，图片分析失败了。请检查网络连接或稍后重试。', 'assistant')
    } finally {
      setIsAnalyzingImage(false)
    }
  }, [inputValue, sendMessage, knowledgeContext])

  // 移除图片
  const handleImageRemove = useCallback(() => {
    setCurrentImage(null)
    setShowImageUpload(false)
  }, [])

  // 处理快捷操作
  const handleQuickAction = useCallback((action: string) => {
    const actionMessages = {
      explain: `请解释一下${selectedKnowledgePoint?.title || '当前知识点'}的概念`,
      example: `能给我举个关于${selectedKnowledgePoint?.title || '这个知识点'}的例子吗？`,
      practice: `我想做一些关于${selectedKnowledgePoint?.title || '这个知识点'}的练习题`,
      related: `${selectedKnowledgePoint?.title || '这个知识点'}还有哪些相关的知识？`
    }

    const message = actionMessages[action as keyof typeof actionMessages]
    setInputValue(message)
    setTimeout(() => handleSendMessage(), 100)
  }, [selectedKnowledgePoint, handleSendMessage])

  // 处理键盘事件
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // 语音录制切换
  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording)
    // TODO: 实现语音识别功能
  }, [isRecording])

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      {/* 聊天头部 */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium">AI学习助手</h3>
              {hasApiKey ? (
                <div className="w-2 h-2 bg-green-400 rounded-full" title="API已连接" />
              ) : (
                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="演示模式" />
              )}
            </div>
            <p className="text-gray-400 text-sm">
              {selectedKnowledgePoint ? `正在学习: ${selectedKnowledgePoint.title}` :
               hasApiKey ? '准备为你答疑解惑' : '演示模式 - 点击设置配置API'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMultiApiConfig(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="AI模型配置"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 relative min-h-0">
        <div
          ref={messagesContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth chat-messages"
        >
        {/* 欢迎消息 */}
        {chatHistory.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">你好！我是你的AI学习助手</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-3">
              我可以帮你解答数学问题、解释概念、提供练习题，让学习变得更加轻松有趣！
            </p>
            {!hasApiKey && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 max-w-md mx-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-4 h-4 text-yellow-400" />
                  <p className="text-yellow-300 text-sm font-medium">当前为演示模式</p>
                </div>
                <p className="text-yellow-200 text-xs leading-relaxed mb-2">
                  配置DeepSeek API密钥后可获得更智能、更准确的AI回答
                </p>
                <button
                  onClick={() => setShowApiConfig(true)}
                  className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                >
                  立即配置 →
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 聊天消息 */}
        {chatHistory.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* AI正在输入 */}
        {isProcessing && (
          <MessageBubble
            message={{
              id: 'typing',
              content: '',
              role: 'assistant',
              timestamp: new Date()
            }}
            isTyping={true}
          />
        )}

          <div ref={messagesEndRef} />
        </div>

        {/* 滚动指示器 */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors z-10"
              title="滚动到底部"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 快捷操作 */}
      <AnimatePresence>
        {showQuickActions && chatHistory.length === 0 && (
          <motion.div
            className="px-4 pb-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuickActions onActionClick={handleQuickAction} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 输入区域 */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <div className="flex items-end space-x-3">
          {/* 图片上传按钮 */}
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className={`p-2 transition-colors ${
              showImageUpload
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
            title="上传图片"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* 输入框 */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
              rows={1}
              style={{
                minHeight: '48px',
                height: Math.min(Math.max(48, inputValue.split('\n').length * 24), 128)
              }}
            />
            
            {/* 字符计数 */}
            <div className="absolute bottom-1 right-1 text-xs text-gray-500">
              {inputValue.length}/500
            </div>
          </div>

          {/* 语音按钮 */}
          <button
            onClick={toggleRecording}
            className={`p-2 transition-colors ${
              isRecording 
                ? 'text-red-500 bg-red-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 提示文本 */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          {knowledgeContext && (
            <span>当前上下文: {knowledgeContext.currentKnowledgePoint?.title}</span>
          )}
        </div>

        {/* 图片上传区域 */}
        <AnimatePresence>
          {showImageUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ImageUpload
                onImageSelect={handleImageSelect}
                onRemove={handleImageRemove}
                isLoading={isAnalyzingImage}
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* API密钥配置弹窗 */}
      <ApiKeyConfig
        isOpen={showApiConfig}
        onClose={() => setShowApiConfig(false)}
        onApiKeySet={handleApiKeySet}
      />

      {/* 多API配置弹窗 */}
      <MultiApiConfig
        isOpen={showMultiApiConfig}
        onClose={() => setShowMultiApiConfig(false)}
        onConfigUpdate={() => {
          setHasApiKey(AIService.hasApiKey())
        }}
      />
    </div>
  )
}
