'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Settings,
  History,
  Bookmark,
  Download,
  Share
} from 'lucide-react'
import { ChatInterface } from './ChatInterface'
import { useAI } from '@/components/providers/AIProvider'

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function ChatSidebar({ isOpen, onToggle, className = '' }: ChatSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { chatHistory, clearHistory } = useAI()

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClearHistory = () => {
    if (window.confirm('确定要清除所有聊天记录吗？')) {
      clearHistory()
    }
  }

  const handleExportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: chatHistory,
      totalMessages: chatHistory.length
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* 浮动聊天按钮 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={onToggle}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* 消息数量徽章 */}
            {chatHistory.length > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {chatHistory.length > 99 ? '99+' : chatHistory.length}
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 聊天侧边栏 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700 z-50 flex flex-col ${className}`}
            initial={{ x: '100%' }}
            animate={{
              x: 0,
              width: isMinimized ? '80px' : '384px'
            }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* 头部控制栏 */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium text-sm">AI助手</h3>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {chatHistory.length > 0 ? `${chatHistory.length} 条消息` : '开始对话'}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center space-x-1">
                {/* 最小化按钮 */}
                <button
                  onClick={handleMinimize}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  title={isMinimized ? '展开' : '最小化'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>

                {/* 设置按钮 */}
                {!isMinimized && (
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                    title="设置"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                {/* 关闭按钮 */}
                <button
                  onClick={onToggle}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  title="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 设置面板 */}
            <AnimatePresence>
              {showSettings && !isMinimized && (
                <motion.div
                  className="border-b border-gray-700 p-4 bg-gray-800/50"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-white text-sm font-medium mb-3">聊天设置</h4>
                  <div className="space-y-3">
                    {/* 清除历史 */}
                    <button
                      onClick={handleClearHistory}
                      className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>清除聊天记录</span>
                    </button>

                    {/* 导出聊天 */}
                    <button
                      onClick={handleExportChat}
                      disabled={chatHistory.length === 0}
                      className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>导出聊天记录</span>
                    </button>

                    {/* 分享聊天 */}
                    <button
                      disabled={chatHistory.length === 0}
                      className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share className="w-4 h-4" />
                      <span>分享对话</span>
                    </button>

                    {/* 保存重要对话 */}
                    <button
                      disabled={chatHistory.length === 0}
                      className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>保存重要对话</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 聊天界面 */}
            {!isMinimized ? (
              <motion.div
                className="flex-1 flex flex-col min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ChatInterface className="flex-1" />
              </motion.div>
            ) : (
              /* 最小化状态的快捷操作 */
              <motion.div
                className="flex flex-col items-center py-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* 消息数量指示器 */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  {chatHistory.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chatHistory.length > 9 ? '9+' : chatHistory.length}
                    </div>
                  )}
                </div>

                {/* 快捷操作按钮 */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                    title="设置"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                    title="清除记录"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                    title="历史记录"
                  >
                    <History className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 状态指示器 */}
            <motion.div
              className="flex-shrink-0 flex items-center justify-center p-4 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className={isMinimized ? 'hidden' : ''}>AI助手在线</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景遮罩 */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
    </>
  )
}
