/**
 * 客户端错误处理工具
 * 只在浏览器环境中工作，完全避免SSR问题
 */

export interface ErrorInfo {
  message: string
  stack?: string
  source?: string
  timestamp: Date
  userAgent?: string
  url?: string
}

// 简单的客户端错误处理函数
let errorLog: ErrorInfo[] = []
let isInitialized = false
const maxLogSize = 100

// 初始化错误处理（只在客户端）
export function initializeErrorHandler() {
  if (typeof window === 'undefined' || isInitialized) {
    return
  }

  setupGlobalErrorHandlers()
  isInitialized = true
  console.log('客户端错误处理器已初始化')
}

function setupGlobalErrorHandlers() {
  // 处理 JavaScript 错误
  window.addEventListener('error', (event) => {
    handleError({
      message: event.message,
      stack: event.error?.stack,
      source: event.filename,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  })

  // 处理 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    handleError({
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      source: 'Promise',
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  })

  // 处理资源加载错误
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      handleError({
        message: `Resource loading error: ${(event.target as any)?.src || (event.target as any)?.href}`,
        source: 'Resource',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }
  }, true)
}

function handleError(errorInfo: ErrorInfo) {
  // 过滤掉已知的无害错误
  if (shouldIgnoreError(errorInfo)) {
    console.warn('忽略的错误:', errorInfo.message)
    return
  }

  // 记录错误
  logError(errorInfo)

  // 在开发环境中显示详细错误
  if (process.env.NODE_ENV === 'development') {
    console.error('全局错误捕获:', errorInfo)
  }
}

function shouldIgnoreError(errorInfo: ErrorInfo): boolean {
  const ignoredPatterns = [
    // 浏览器扩展相关错误
    'listener indicated an asynchronous response',
    'message channel closed',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://',
    
    // 网络相关的常见错误
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    
    // 第三方脚本错误
    'Script error',
    'Non-Error promise rejection captured',
    
    // 广告拦截器相关
    'adblock',
    'adblocker',
    
    // 其他常见的无害错误
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications'
  ]

  return ignoredPatterns.some(pattern =>
    errorInfo.message.toLowerCase().includes(pattern.toLowerCase())
  )
}

function logError(errorInfo: ErrorInfo) {
  // 添加到错误日志
  errorLog.unshift(errorInfo)

  // 保持日志大小限制
  if (errorLog.length > maxLogSize) {
    errorLog = errorLog.slice(0, maxLogSize)
  }
}

// 获取错误日志
export function getErrorLog(): ErrorInfo[] {
  return [...errorLog]
}

// 清除错误日志
export function clearErrorLog() {
  errorLog = []
}

// 手动报告错误
export function reportError(error: Error, context?: string) {
  if (typeof window === 'undefined') {
    return
  }

  handleError({
    message: error.message,
    stack: error.stack,
    source: context || 'Manual Report',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })
}

// 获取错误统计
export function getErrorStats() {
  const stats = {
    total: errorLog.length,
    bySource: {} as Record<string, number>,
    recent: errorLog.slice(0, 10)
  }

  errorLog.forEach(error => {
    const source = error.source || 'Unknown'
    stats.bySource[source] = (stats.bySource[source] || 0) + 1
  })

  return stats
}

// React Hook 用于在组件中使用错误处理
export function useErrorReporting() {
  const reportComponentError = (error: Error, errorInfo?: any) => {
    reportError(error, `React Component: ${errorInfo?.componentStack || 'Unknown'}`)
  }

  return { reportComponentError }
}
