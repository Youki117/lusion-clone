import { ChatMessage, KnowledgeContext } from '@/types'

// DeepSeek API 配置
const DEEPSEEK_API_BASE_URL = 'https://api.deepseek.com'
const DEEPSEEK_MODEL = 'deepseek-chat'

// API 错误类型
export class DeepSeekAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'DeepSeekAPIError'
  }
}

// DeepSeek API 请求接口
interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekChatRequest {
  model: string
  messages: DeepSeekMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
  top_p?: number
}

interface DeepSeekChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// 流式响应接口
interface DeepSeekStreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }[]
}

export class DeepSeekService {
  private apiKey: string | null = null

  constructor() {
    // 从环境变量或本地存储获取API密钥
    this.apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 
                  (typeof window !== 'undefined' ? localStorage.getItem('deepseek_api_key') : null)
  }

  // 设置API密钥
  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepseek_api_key', apiKey)
    }
  }

  // 获取API密钥状态
  hasApiKey(): boolean {
    return !!this.apiKey
  }

  // 构建系统提示词
  private buildSystemPrompt(context?: KnowledgeContext): string {
    let systemPrompt = `你是一个专业的AI学习助手，专门帮助学生学习高中数学、物理、化学、生物等学科。

你的特点：
1. 耐心细致，善于用简单易懂的语言解释复杂概念
2. 能够提供具体的例子和练习题
3. 会根据学生的理解程度调整解释的深度
4. 鼓励学生思考，引导学生找到解题思路
5. 回答简洁明了，重点突出

请用中文回答所有问题。`

    if (context?.currentKnowledgePoint) {
      systemPrompt += `\n\n当前学习的知识点：${context.currentKnowledgePoint.title}
难度等级：${context.currentKnowledgePoint.difficulty}
知识点内容：${context.currentKnowledgePoint.content.substring(0, 500)}...`
    }

    if (context?.difficulty) {
      systemPrompt += `\n\n请根据学生的水平（${context.difficulty}）调整回答的深度和复杂程度。`
    }

    return systemPrompt
  }

  // 转换聊天历史为DeepSeek格式
  private convertChatHistory(chatHistory: ChatMessage[]): DeepSeekMessage[] {
    return chatHistory
      .slice(-10) // 只保留最近10条消息，避免token过多
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
  }

  // 发送聊天请求
  async sendChatRequest(
    userMessage: string,
    context?: KnowledgeContext,
    chatHistory: ChatMessage[] = [],
    stream: boolean = false
  ): Promise<string> {
    if (!this.apiKey) {
      throw new DeepSeekAPIError('API密钥未设置，请先配置DeepSeek API密钥')
    }

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: this.buildSystemPrompt(context)
      },
      ...this.convertChatHistory(chatHistory),
      {
        role: 'user',
        content: userMessage
      }
    ]

    const requestBody: DeepSeekChatRequest = {
      model: DEEPSEEK_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: false, // 暂时不支持流式，后续可以扩展
      top_p: 0.9
    }

    // 创建 AbortController 来处理超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

    try {
      const response = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new DeepSeekAPIError(
          errorData.error?.message || `API请求失败: ${response.status}`,
          response.status,
          errorData.error?.code
        )
      }

      const data: DeepSeekChatResponse = await response.json()

      if (!data.choices || data.choices.length === 0) {
        throw new DeepSeekAPIError('API返回数据格式错误：没有找到回复内容')
      }

      return data.choices[0].message.content || '抱歉，我没有生成有效的回复。'

    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DeepSeekAPIError) {
        throw error
      }

      // 处理 AbortError (超时)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new DeepSeekAPIError('请求超时，请检查网络连接后重试')
      }

      // 网络错误或其他错误
      throw new DeepSeekAPIError(
        `请求失败: ${error instanceof Error ? error.message : '未知错误'}`
      )
    }
  }

  // 生成学习建议
  async generateLearningTips(
    knowledgePoint: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): Promise<string[]> {
    if (!this.apiKey) {
      return ['请先配置API密钥以获取个性化学习建议']
    }

    const prompt = `请为"${knowledgePoint}"这个${difficulty}难度的知识点生成3-5条具体的学习建议。
要求：
1. 建议要具体可操作
2. 适合${difficulty}水平的学生
3. 每条建议不超过30字
4. 用简洁的中文表达
5. 以数组格式返回，每条建议一行

请直接返回建议内容，不要其他解释。`

    try {
      const response = await this.sendChatRequest(prompt)
      // 简单解析返回的建议
      const tips = response
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.?\s*/, '').trim())
        .filter(tip => tip.length > 0 && tip.length <= 50)
        .slice(0, 5)

      return tips.length > 0 ? tips : ['继续努力学习，你一定能掌握这个知识点！']
    } catch (error) {
      console.error('生成学习建议失败:', error)
      return ['请继续努力学习，遇到问题随时向我提问！']
    }
  }

  // 检查API连接状态
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false
    }

    try {
      await this.sendChatRequest('你好')
      return true
    } catch (error) {
      console.error('API连接测试失败:', error)
      return false
    }
  }
}

// 导出单例实例
export const deepseekService = new DeepSeekService()
