'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Settings,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { AIService } from '@/services/aiService'

interface ApiKeyConfigProps {
  isOpen: boolean
  onClose: () => void
  onApiKeySet?: (hasKey: boolean) => void
}

export function ApiKeyConfig({ isOpen, onClose, onApiKeySet }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasExistingKey, setHasExistingKey] = useState(false)

  // 检查是否已有API密钥
  useEffect(() => {
    if (isOpen) {
      const hasKey = AIService.hasApiKey()
      setHasExistingKey(hasKey)
      if (hasKey) {
        setApiKey('sk-' + '*'.repeat(40)) // 显示掩码
      }
    }
  }, [isOpen])

  // 处理API密钥输入
  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    setTestResult(null)
    setErrorMessage('')
  }

  // 测试API连接
  const testApiConnection = async () => {
    if (!apiKey || apiKey.includes('*')) {
      setErrorMessage('请输入有效的API密钥')
      return
    }

    setIsLoading(true)
    setTestResult(null)
    setErrorMessage('')

    try {
      // 设置API密钥
      AIService.setApiKey(apiKey)
      
      // 测试连接
      const isConnected = await AIService.testConnection()
      
      if (isConnected) {
        setTestResult('success')
        setHasExistingKey(true)
        onApiKeySet?.(true)
        
        // 2秒后自动关闭
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setTestResult('error')
        setErrorMessage('API连接测试失败，请检查密钥是否正确')
      }
    } catch (error) {
      setTestResult('error')
      setErrorMessage(error instanceof Error ? error.message : '连接测试失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 清除API密钥
  const clearApiKey = () => {
    setApiKey('')
    setHasExistingKey(false)
    setTestResult(null)
    setErrorMessage('')
    
    // 清除存储的密钥
    if (typeof window !== 'undefined') {
      localStorage.removeItem('deepseek_api_key')
    }
    
    onApiKeySet?.(false)
  }

  // 处理保存
  const handleSave = () => {
    if (hasExistingKey && apiKey.includes('*')) {
      // 如果是已有密钥且未修改，直接关闭
      onClose()
    } else {
      // 测试新密钥
      testApiConnection()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">API密钥配置</h3>
              <p className="text-gray-400 text-sm">配置DeepSeek API密钥以启用AI功能</p>
            </div>
          </div>

          {/* API密钥输入 */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                DeepSeek API密钥
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 获取API密钥提示 */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">如何获取API密钥？</p>
                  <p className="text-blue-200 text-xs leading-relaxed">
                    访问 <a 
                      href="https://platform.deepseek.com/api_keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline inline-flex items-center"
                    >
                      DeepSeek平台 <ExternalLink className="w-3 h-3 ml-1" />
                    </a> 注册账号并创建API密钥
                  </p>
                </div>
              </div>
            </div>

            {/* 错误信息 */}
            {errorMessage && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* 成功信息 */}
            {testResult === 'success' && (
              <motion.div
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <p className="text-green-300 text-sm">API密钥配置成功！</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            
            {hasExistingKey && !apiKey.includes('*') && (
              <button
                onClick={clearApiKey}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                清除
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={isLoading || (!apiKey || (hasExistingKey && apiKey.includes('*')))}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>测试中...</span>
                </>
              ) : (
                <span>{hasExistingKey && apiKey.includes('*') ? '确定' : '保存并测试'}</span>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
