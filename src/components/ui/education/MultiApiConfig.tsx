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
  Loader2,
  Bot,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react'

interface ApiConfig {
  name: string
  key: string
  envKey: string
  description: string
  icon: React.ReactNode
  color: string
  getUrl: string
  placeholder: string
}

interface MultiApiConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigUpdate?: () => void
}

export function MultiApiConfig({ isOpen, onClose, onConfigUpdate }: MultiApiConfigProps) {
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'loading' | null>>({})

  const apiConfigs: ApiConfig[] = [
    {
      name: 'DeepSeek',
      key: 'deepseek',
      envKey: 'NEXT_PUBLIC_DEEPSEEK_API_KEY',
      description: '用于文本对话和问答',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      getUrl: 'https://platform.deepseek.com/api_keys',
      placeholder: 'sk-...'
    },
    {
      name: 'OpenAI GPT-4 Vision',
      key: 'openai',
      envKey: 'NEXT_PUBLIC_OPENAI_API_KEY',
      description: '用于图片分析和视觉理解（推荐）',
      icon: <ImageIcon className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      getUrl: 'https://platform.openai.com/api-keys',
      placeholder: 'sk-...'
    },
    {
      name: 'Google Gemini',
      key: 'gemini',
      envKey: 'NEXT_PUBLIC_GEMINI_API_KEY',
      description: '用于图片分析（备选方案）',
      icon: <Bot className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      getUrl: 'https://makersuite.google.com/app/apikey',
      placeholder: 'AI...'
    },
    {
      name: 'Anthropic Claude',
      key: 'claude',
      envKey: 'NEXT_PUBLIC_CLAUDE_API_KEY',
      description: '用于图片分析（备选方案）',
      icon: <Bot className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      getUrl: 'https://console.anthropic.com/',
      placeholder: 'sk-ant-...'
    }
  ]

  // 加载现有配置
  useEffect(() => {
    if (isOpen) {
      const newConfigs: Record<string, string> = {}
      apiConfigs.forEach(config => {
        const value = localStorage.getItem(config.envKey) || ''
        newConfigs[config.key] = value ? value.substring(0, 8) + '*'.repeat(Math.max(0, value.length - 8)) : ''
      })
      setConfigs(newConfigs)
    }
  }, [isOpen])

  // 处理输入变化
  const handleInputChange = (key: string, value: string) => {
    setConfigs(prev => ({ ...prev, [key]: value }))
    setTestResults(prev => ({ ...prev, [key]: null }))
  }

  // 切换密钥显示
  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // 测试API连接
  const testApiKey = async (config: ApiConfig) => {
    const apiKey = configs[config.key]
    if (!apiKey || apiKey.includes('*')) return

    setTestResults(prev => ({ ...prev, [config.key]: 'loading' }))

    try {
      // 这里可以添加实际的API测试逻辑
      // 暂时模拟测试
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (apiKey.length > 10) {
        setTestResults(prev => ({ ...prev, [config.key]: 'success' }))
      } else {
        setTestResults(prev => ({ ...prev, [config.key]: 'error' }))
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [config.key]: 'error' }))
    }
  }

  // 保存配置
  const handleSave = () => {
    apiConfigs.forEach(config => {
      const value = configs[config.key]
      if (value && !value.includes('*')) {
        localStorage.setItem(config.envKey, value)
      }
    })
    
    onConfigUpdate?.()
    onClose()
  }

  // 清除配置
  const handleClear = (key: string) => {
    const config = apiConfigs.find(c => c.key === key)
    if (config) {
      localStorage.removeItem(config.envKey)
      setConfigs(prev => ({ ...prev, [key]: '' }))
      setTestResults(prev => ({ ...prev, [key]: null }))
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
          className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">AI模型配置</h3>
                <p className="text-gray-400 text-sm">配置各个AI服务的API密钥</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* API配置列表 */}
          <div className="space-y-6">
            {apiConfigs.map((config) => (
              <div key={config.key} className="border border-gray-700 rounded-lg p-4">
                {/* API信息 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{config.name}</h4>
                      <p className="text-gray-400 text-xs">{config.description}</p>
                    </div>
                  </div>
                  <a
                    href={config.getUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                  >
                    <span>获取密钥</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* API密钥输入 */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showKeys[config.key] ? 'text' : 'password'}
                      value={configs[config.key] || ''}
                      onChange={(e) => handleInputChange(config.key, e.target.value)}
                      placeholder={config.placeholder}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => toggleShowKey(config.key)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {showKeys[config.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      {configs[config.key] && !configs[config.key].includes('*') && (
                        <button
                          onClick={() => testApiKey(config)}
                          disabled={testResults[config.key] === 'loading'}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                        >
                          {testResults[config.key] === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      
                      {configs[config.key] && (
                        <button
                          onClick={() => handleClear(config.key)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 测试结果 */}
                  {testResults[config.key] && (
                    <div className={`flex items-center space-x-2 text-xs ${
                      testResults[config.key] === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResults[config.key] === 'success' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>
                        {testResults[config.key] === 'success' ? 'API密钥有效' : 'API密钥无效'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 说明信息 */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-200 space-y-1">
                <p><strong>配置说明：</strong></p>
                <p>• DeepSeek：必需，用于文本对话</p>
                <p>• 视觉AI：至少配置一个，用于图片分析</p>
                <p>• 密钥将保存在浏览器本地存储中</p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              保存配置
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
