// 渐变色工具函数
export interface GradientConfig {
  primary: string
  secondary: string
  tertiary: string
  direction: string
  className: string
}

export const subjectGradients: Record<string, GradientConfig> = {
  mathematics: {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    tertiary: '#1e40af',
    direction: 'to-br',
    className: 'from-blue-500 via-blue-600 to-blue-700'
  },
  physics: {
    primary: '#10b981',
    secondary: '#059669',
    tertiary: '#047857',
    direction: 'to-br',
    className: 'from-emerald-500 via-emerald-600 to-emerald-700'
  },
  chemistry: {
    primary: '#f59e0b',
    secondary: '#d97706',
    tertiary: '#b45309',
    direction: 'to-br',
    className: 'from-amber-500 via-amber-600 to-amber-700'
  },
  biology: {
    primary: '#06b6d4',
    secondary: '#0891b2',
    tertiary: '#0e7490',
    direction: 'to-br',
    className: 'from-cyan-500 via-cyan-600 to-cyan-700'
  },
  chinese: {
    primary: '#ef4444',
    secondary: '#dc2626',
    tertiary: '#b91c1c',
    direction: 'to-br',
    className: 'from-red-500 via-red-600 to-red-700'
  },
  english: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    tertiary: '#6d28d9',
    direction: 'to-br',
    className: 'from-violet-500 via-violet-600 to-violet-700'
  },
  history: {
    primary: '#f97316',
    secondary: '#ea580c',
    tertiary: '#c2410c',
    direction: 'to-br',
    className: 'from-orange-500 via-orange-600 to-orange-700'
  },
  politics: {
    primary: '#dc2626',
    secondary: '#b91c1c',
    tertiary: '#991b1b',
    direction: 'to-br',
    className: 'from-red-600 via-red-700 to-red-800'
  },
  geography: {
    primary: '#14b8a6',
    secondary: '#0d9488',
    tertiary: '#0f766e',
    direction: 'to-br',
    className: 'from-teal-500 via-teal-600 to-teal-700'
  }
}

// 获取学科的渐变色配置
export const getSubjectGradient = (subjectId: string): GradientConfig => {
  return subjectGradients[subjectId] || subjectGradients.mathematics
}

// 生成CSS渐变字符串
export const generateGradientCSS = (config: GradientConfig): string => {
  return `linear-gradient(${config.direction}, ${config.primary}, ${config.secondary}, ${config.tertiary})`
}

// 生成悬停渐变CSS
export const generateHoverGradientCSS = (config: GradientConfig): string => {
  return `linear-gradient(${config.direction}, ${config.primary}40, ${config.secondary}30, ${config.tertiary}20)`
}

// 生成装饰性渐变CSS
export const generateDecorativeGradientCSS = (config: GradientConfig): string => {
  return `radial-gradient(circle at 30% 70%, ${config.primary}20 0%, transparent 50%), radial-gradient(circle at 70% 30%, ${config.secondary}15 0%, transparent 50%)`
} 