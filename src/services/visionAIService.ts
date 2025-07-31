/**
 * 视觉AI服务 - 支持图片识别和分析
 * 当DeepSeek不支持图片时，使用其他AI服务处理图片内容
 */

export interface VisionAIConfig {
  provider: 'openai' | 'gemini' | 'claude'
  apiKey: string
  model?: string
}

export interface ImageAnalysisResult {
  description: string
  detectedText?: string
  mathEquations?: string[]
  subjects?: string[]
  difficulty?: 'basic' | 'intermediate' | 'advanced'
  suggestions?: string[]
}

export class VisionAIService {
  private config: VisionAIConfig

  constructor(config: VisionAIConfig) {
    this.config = config
  }

  /**
   * 分析上传的图片
   */
  async analyzeImage(
    imageData: string, // base64 encoded image
    prompt?: string
  ): Promise<ImageAnalysisResult> {
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.analyzeWithOpenAI(imageData, prompt)
        case 'gemini':
          return await this.analyzeWithGemini(imageData, prompt)
        case 'claude':
          return await this.analyzeWithClaude(imageData, prompt)
        default:
          throw new Error(`不支持的AI服务提供商: ${this.config.provider}`)
      }
    } catch (error) {
      console.error('图片分析失败:', error)
      throw new Error('图片分析失败，请稍后重试')
    }
  }

  /**
   * 使用 OpenAI GPT-4 Vision 分析图片
   */
  private async analyzeWithOpenAI(
    imageData: string,
    prompt?: string
  ): Promise<ImageAnalysisResult> {
    const systemPrompt = `你是一个专业的教育AI助手，擅长分析学习相关的图片内容。
请分析这张图片并提供以下信息：
1. 图片内容的详细描述
2. 如果包含文字，请提取出来
3. 如果包含数学公式或方程，请识别并列出
4. 判断涉及的学科领域
5. 评估难度等级
6. 提供学习建议

请用中文回答，格式要清晰易懂。`

    const userPrompt = prompt || '请分析这张图片中的学习内容，帮我理解和解答相关问题。'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    return this.parseAnalysisResult(content)
  }

  /**
   * 使用 Google Gemini Vision 分析图片
   */
  private async analyzeWithGemini(
    imageData: string,
    prompt?: string
  ): Promise<ImageAnalysisResult> {
    // Gemini API 实现
    const systemPrompt = `分析这张学习相关的图片，提供详细的教育分析。`
    const userPrompt = prompt || '请帮我分析这张图片中的学习内容。'

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `${systemPrompt}\n\n${userPrompt}` },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.candidates[0]?.content?.parts[0]?.text || ''

    return this.parseAnalysisResult(content)
  }

  /**
   * 使用 Claude Vision 分析图片
   */
  private async analyzeWithClaude(
    imageData: string,
    prompt?: string
  ): Promise<ImageAnalysisResult> {
    const systemPrompt = `你是一个专业的教育AI助手，请分析学习相关的图片内容。`
    const userPrompt = prompt || '请分析这张图片中的学习内容。'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageData
                }
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text || ''

    return this.parseAnalysisResult(content)
  }

  /**
   * 解析AI返回的分析结果
   */
  private parseAnalysisResult(content: string): ImageAnalysisResult {
    // 简单的文本解析，实际项目中可以使用更复杂的NLP处理
    const result: ImageAnalysisResult = {
      description: content
    }

    // 尝试提取数学公式
    const mathRegex = /(?:公式|方程|等式)[：:]\s*([^。\n]+)/gi
    const mathMatches = content.match(mathRegex)
    if (mathMatches) {
      result.mathEquations = mathMatches.map(match => 
        match.replace(/(?:公式|方程|等式)[：:]\s*/, '').trim()
      )
    }

    // 尝试识别学科
    const subjects = []
    if (/数学|几何|代数|微积分|统计/.test(content)) subjects.push('数学')
    if (/物理|力学|电学|光学/.test(content)) subjects.push('物理')
    if (/化学|分子|原子|反应/.test(content)) subjects.push('化学')
    if (/生物|细胞|基因|DNA/.test(content)) subjects.push('生物')
    if (subjects.length > 0) {
      result.subjects = subjects
    }

    // 尝试判断难度
    if (/基础|简单|入门/.test(content)) {
      result.difficulty = 'basic'
    } else if (/高级|复杂|困难/.test(content)) {
      result.difficulty = 'advanced'
    } else {
      result.difficulty = 'intermediate'
    }

    return result
  }

  /**
   * 检查服务是否可用
   */
  async checkAvailability(): Promise<boolean> {
    try {
      // 简单的健康检查
      return !!this.config.apiKey
    } catch {
      return false
    }
  }
}
