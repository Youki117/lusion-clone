'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ChatMessage, KnowledgeContext, ConversationSession } from '@/types'
import { AIService } from '@/services/aiService'

interface AIContextType {
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  chatHistory: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  clearHistory: () => void
  currentSession: ConversationSession | null
  setCurrentSession: (session: ConversationSession | null) => void
  knowledgeContext: KnowledgeContext | null
  setKnowledgeContext: (context: KnowledgeContext | null) => void
  error: string | null
  setError: (error: string | null) => void
  sendMessage: (content: string, role: 'user' | 'assistant') => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

interface AIProviderProps {
  children: React.ReactNode
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null)
  const [knowledgeContext, setKnowledgeContext] = useState<KnowledgeContext | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addMessage = useCallback((message: ChatMessage) => {
    setChatHistory(prev => [...prev, message])
    
    // Update current session if exists
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message]
      } : null)
    }
  }, [currentSession])

  const clearHistory = useCallback(() => {
    setChatHistory([])
    setCurrentSession(null)
    setKnowledgeContext(null)
    setError(null)
  }, [])

  const sendMessage = useCallback(async (content: string, role: 'user' | 'assistant') => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      role,
      timestamp: new Date(),
      knowledgeContext: knowledgeContext || undefined
    }

    addMessage(message)

    // If it's a user message, generate AI response
    if (role === 'user') {
      setIsProcessing(true)
      setError(null)

      try {
        // Generate AI response with timeout protection
        const aiResponse = await Promise.race([
          AIService.generateResponse(
            content,
            knowledgeContext || undefined,
            chatHistory
          ),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('AI响应超时')), 45000)
          )
        ])

        // Add AI response
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date(),
          knowledgeContext: knowledgeContext || undefined
        }

        addMessage(aiMessage)
      } catch (error) {
        console.error('AI response error:', error)

        // 根据错误类型提供不同的错误信息
        let errorMessage = '抱歉，AI助手暂时无法响应，请稍后再试。'

        if (error instanceof Error) {
          if (error.message.includes('超时')) {
            errorMessage = '请求超时，请检查网络连接后重试。'
          } else if (error.message.includes('API密钥')) {
            errorMessage = '请先配置API密钥以使用AI功能。'
          } else if (error.message.includes('网络')) {
            errorMessage = '网络连接异常，请检查网络后重试。'
          }
        }

        setError(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    } else {
      setIsProcessing(false)
    }
  }, [knowledgeContext, addMessage, chatHistory])

  return (
    <AIContext.Provider 
      value={{ 
        isProcessing,
        setIsProcessing,
        chatHistory,
        addMessage,
        clearHistory,
        currentSession,
        setCurrentSession,
        knowledgeContext,
        setKnowledgeContext,
        error,
        setError,
        sendMessage
      }}
    >
      {children}
    </AIContext.Provider>
  )
}
