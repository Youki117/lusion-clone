'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 过滤掉常见的浏览器扩展错误
    const isExtensionError = error.message.includes('listener indicated an asynchronous response') ||
                            error.message.includes('message channel closed') ||
                            error.message.includes('Extension context invalidated')

    if (isExtensionError) {
      console.warn('检测到浏览器扩展相关错误，这通常不影响应用功能:', error.message)
      // 对于扩展错误，我们可以选择不显示错误界面
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
      }, 1000)
    }
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback UI，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认的错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="max-w-md mx-auto text-center p-8 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                出现了一些问题
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                应用遇到了意外错误，请尝试刷新页面
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                刷新页面
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                重试
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  错误详情 (开发模式)
                </summary>
                <div className="mt-2 p-3 bg-black/30 rounded text-xs text-red-300 font-mono overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>错误:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>堆栈:</strong>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 简化的错误边界 Hook 版本
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Application error:', error, errorInfo)
    
    // 过滤浏览器扩展错误
    const isExtensionError = error.message.includes('listener indicated an asynchronous response') ||
                            error.message.includes('message channel closed') ||
                            error.message.includes('Extension context invalidated')

    if (isExtensionError) {
      console.warn('浏览器扩展错误已被忽略:', error.message)
      return false // 不处理此错误
    }

    return true // 处理此错误
  }, [])

  return { handleError }
}
