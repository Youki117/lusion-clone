import { ChatMessage, KnowledgeContext } from '@/types'
import { deepseekService, DeepSeekAPIError } from './deepseekService'
import { VisionAIService, ImageAnalysisResult } from './visionAIService'

// AI响应模板（作为fallback使用）
const responseTemplates = {
  greeting: [
    "你好！我是你的AI学习助手，很高兴为你服务！",
    "欢迎来到AI学习平台！我可以帮你解答数学问题。",
    "Hi！我是专门为数学学习设计的AI助手，有什么可以帮你的吗？"
  ],

  explanation: [
    "让我来详细解释一下这个概念。",
    "这是一个很好的问题！我来为你分析一下。",
    "我理解你的疑问，让我从基础开始讲解。",
    "这个知识点确实需要仔细理解，我来帮你梳理一下。"
  ],

  example: [
    "让我给你举个具体的例子来说明。",
    "通过一个实际例子，你会更容易理解。",
    "我用一个简单的例子来演示这个概念。",
    "举例说明总是最好的学习方法，来看这个例子。"
  ],

  practice: [
    "练习是巩固知识的最好方法！",
    "让我们通过一些练习题来加深理解。",
    "我为你准备了一些针对性的练习题。",
    "做题是检验学习效果的好方法，我们开始吧！"
  ],

  encouragement: [
    "你问得很好！这说明你在认真思考。",
    "不要担心，每个人学习都有这个过程。",
    "你的学习态度很棒！继续保持。",
    "这个问题很有深度，你的思考很到位。"
  ],

  apiKeyMissing: [
    "抱歉，AI助手需要配置API密钥才能正常工作。请联系管理员配置DeepSeek API密钥。",
    "当前AI功能不可用，请确保已正确配置API密钥。",
    "需要先设置API密钥才能使用AI学习助手功能。"
  ],

  apiError: [
    "抱歉，AI助手暂时遇到了一些问题，请稍后再试。",
    "网络连接似乎有问题，请检查网络后重试。",
    "AI服务暂时不可用，我们正在努力修复中。"
  ]
}

// 知识点相关的详细解释
const knowledgeExplanations: Record<string, string[]> = {
  '集合的概念': [
    "集合是数学中最基本的概念之一。简单来说，集合就是把一些确定的、不同的对象放在一起形成的整体。",
    "集合有三个重要特性：确定性（元素是否属于集合是明确的）、互异性（集合中的元素各不相同）、无序性（元素的排列顺序不影响集合）。",
    "我们通常用大写字母A、B、C等表示集合，用小写字母a、b、c等表示集合中的元素。如果a是集合A的元素，我们写作a∈A。"
  ],
  
  '集合的表示方法': [
    "集合主要有两种表示方法：列举法和描述法。",
    "列举法：把集合中的元素一一列举出来，写在大括号内。例如：A = {1, 2, 3, 4, 5}",
    "描述法：用集合中元素的共同特征来表示集合。例如：B = {x | x是小于10的正整数}"
  ],
  
  '集合间的关系': [
    "集合之间主要有三种关系：子集、真子集和相等。",
    "如果集合A的每一个元素都是集合B的元素，那么A是B的子集，记作A⊆B。",
    "如果A⊆B，且A≠B，那么A是B的真子集，记作A⊊B。",
    "如果A⊆B且B⊆A，那么A=B。"
  ]
}

// 生成AI响应
export class AIService {
  private static getRandomResponse(templates: string[]): string {
    return templates[Math.floor(Math.random() * templates.length)]
  }

  private static analyzeUserMessage(message: string): {
    intent: 'greeting' | 'explanation' | 'example' | 'practice' | 'question' | 'other'
    keywords: string[]
  } {
    const lowerMessage = message.toLowerCase()
    
    // 检测意图
    let intent: 'greeting' | 'explanation' | 'example' | 'practice' | 'question' | 'other' = 'other'
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      intent = 'greeting'
    } else if (lowerMessage.includes('解释') || lowerMessage.includes('是什么') || lowerMessage.includes('概念')) {
      intent = 'explanation'
    } else if (lowerMessage.includes('例子') || lowerMessage.includes('举例') || lowerMessage.includes('示例')) {
      intent = 'example'
    } else if (lowerMessage.includes('练习') || lowerMessage.includes('题目') || lowerMessage.includes('做题')) {
      intent = 'practice'
    } else if (lowerMessage.includes('?') || lowerMessage.includes('？') || lowerMessage.includes('怎么') || lowerMessage.includes('为什么')) {
      intent = 'question'
    }

    // 提取关键词
    const keywords = []
    const mathKeywords = ['集合', '函数', '数列', '不等式', '三角函数', '指数', '对数']
    for (const keyword of mathKeywords) {
      if (lowerMessage.includes(keyword)) {
        keywords.push(keyword)
      }
    }

    return { intent, keywords }
  }

  private static generateContextualResponse(
    intent: string,
    keywords: string[],
    context?: KnowledgeContext
  ): string {
    let response = ''

    // 根据意图生成基础响应
    switch (intent) {
      case 'greeting':
        response = this.getRandomResponse(responseTemplates.greeting)
        break
      case 'explanation':
        response = this.getRandomResponse(responseTemplates.explanation)
        break
      case 'example':
        response = this.getRandomResponse(responseTemplates.example)
        break
      case 'practice':
        response = this.getRandomResponse(responseTemplates.practice)
        break
      default:
        response = this.getRandomResponse(responseTemplates.explanation)
    }

    // 添加上下文相关内容
    if (context?.currentKnowledgePoint) {
      const kpTitle = context.currentKnowledgePoint.title
      
      if (intent === 'explanation' && knowledgeExplanations[kpTitle]) {
        const explanations = knowledgeExplanations[kpTitle]
        response += '\n\n' + explanations[Math.floor(Math.random() * explanations.length)]
      }
      
      // 添加难度相关的建议
      if (context.currentKnowledgePoint.difficulty === 'advanced') {
        response += '\n\n💡 这是一个高难度知识点，建议你先确保掌握了前置知识再深入学习。'
      } else if (context.currentKnowledgePoint.difficulty === 'basic') {
        response += '\n\n✨ 这是基础知识点，掌握好它对后续学习很重要！'
      }
    }

    // 添加关键词相关内容
    if (keywords.length > 0) {
      response += `\n\n我注意到你提到了"${keywords.join('、')}"，这些都是数学中的重要概念。`
    }

    return response
  }

  static async generateResponse(
    userMessage: string,
    context?: KnowledgeContext,
    chatHistory?: ChatMessage[]
  ): Promise<string> {
    // 首先尝试使用DeepSeek API
    if (deepseekService.hasApiKey()) {
      try {
        const response = await deepseekService.sendChatRequest(
          userMessage,
          context,
          chatHistory || []
        )
        return response
      } catch (error) {
        console.error('DeepSeek API调用失败:', error)

        // 如果是API密钥问题，返回相应提示
        if (error instanceof DeepSeekAPIError && error.status === 401) {
          return this.getRandomResponse(responseTemplates.apiKeyMissing)
        }

        // 其他API错误，返回错误提示
        return this.getRandomResponse(responseTemplates.apiError) +
               `\n\n错误详情: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }

    // 如果没有API密钥，使用模拟响应
    console.warn('DeepSeek API密钥未配置，使用模拟响应')

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const analysis = this.analyzeUserMessage(userMessage)
    let response = this.generateContextualResponse(analysis.intent, analysis.keywords, context)

    // 根据聊天历史调整响应
    if (chatHistory && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1]
      if (lastMessage.role === 'assistant' && chatHistory.length > 2) {
        // 如果是连续对话，添加连接词
        const connectors = ['另外，', '还有，', '补充一点，', '顺便说一下，']
        if (Math.random() > 0.7) {
          response = this.getRandomResponse(connectors) + response
        }
      }
    }

    // 添加鼓励性结尾
    if (Math.random() > 0.6) {
      const encouragements = [
        '\n\n有什么不明白的地方随时问我！',
        '\n\n希望这个解释对你有帮助！',
        '\n\n你还想了解什么相关内容吗？',
        '\n\n继续加油，你一定能掌握这个知识点！'
      ]
      response += this.getRandomResponse(encouragements)
    }

    // 添加模拟模式提示
    response += '\n\n💡 *当前为演示模式，配置API密钥后可获得更智能的回答*'

    return response
  }

  // 生成学习建议
  static async generateLearningTips(
    knowledgePoint: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): Promise<string[]> {
    // 首先尝试使用DeepSeek API
    if (deepseekService.hasApiKey()) {
      try {
        return await deepseekService.generateLearningTips(knowledgePoint, difficulty)
      } catch (error) {
        console.error('生成学习建议失败:', error)
        // 如果API调用失败，使用默认建议
      }
    }

    // 使用默认建议
    const tips = []

    if (difficulty === 'basic') {
      tips.push('建议多做基础练习题，打好基础')
      tips.push('可以通过画图或实例来理解概念')
      tips.push('不要急于求成，确保每个基础概念都理解透彻')
    } else if (difficulty === 'intermediate') {
      tips.push('尝试将新知识与已学内容联系起来')
      tips.push('多思考概念之间的关系和应用场景')
      tips.push('适当增加练习难度，提升解题能力')
    } else if (difficulty === 'advanced') {
      tips.push('需要大量练习来熟练掌握')
      tips.push('建议寻找多种解题方法，培养数学思维')
      tips.push('可以尝试一些竞赛题目来挑战自己')
    }

    return tips
  }

  // 设置API密钥
  static setApiKey(apiKey: string): void {
    deepseekService.setApiKey(apiKey)
  }

  // 检查API密钥状态
  static hasApiKey(): boolean {
    return deepseekService.hasApiKey()
  }

  // 测试API连接
  static async testConnection(): Promise<boolean> {
    return await deepseekService.testConnection()
  }

  // 生成练习题建议
  static generateExerciseSuggestions(knowledgePoint: string): string[] {
    const suggestions = [
      `针对"${knowledgePoint}"，我建议你从基础题开始练习`,
      '先做几道概念理解题，确保理论基础扎实',
      '然后尝试一些应用题，看看能否灵活运用',
      '最后可以挑战一些综合性较强的题目'
    ]

    return suggestions
  }

  // 分析图片内容（使用视觉AI服务）
  static async analyzeImage(
    imageData: string,
    userQuestion?: string,
    context?: KnowledgeContext
  ): Promise<string> {
    try {
      // 检查是否配置了视觉AI服务
      const visionConfig = this.getVisionAIConfig()
      if (!visionConfig) {
        return '抱歉，图片分析功能需要配置视觉AI服务。请联系管理员配置 OpenAI、Gemini 或 Claude 的 API 密钥。'
      }

      const visionService = new VisionAIService(visionConfig)

      // 构建分析提示
      const analysisPrompt = this.buildImageAnalysisPrompt(userQuestion, context)

      // 分析图片
      const analysisResult = await visionService.analyzeImage(imageData, analysisPrompt)

      // 将分析结果转换为用户友好的回答
      return this.formatImageAnalysisResponse(analysisResult, userQuestion)

    } catch (error) {
      console.error('图片分析失败:', error)
      return '抱歉，图片分析遇到了问题。请检查图片格式是否正确，或稍后重试。如果问题持续存在，请尝试用文字描述你的问题。'
    }
  }

  // 获取视觉AI配置
  private static getVisionAIConfig() {
    // 优先级：OpenAI > Gemini > Claude
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const claudeKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY

    if (openaiKey) {
      return {
        provider: 'openai' as const,
        apiKey: openaiKey,
        model: 'gpt-4-vision-preview'
      }
    }

    if (geminiKey) {
      return {
        provider: 'gemini' as const,
        apiKey: geminiKey,
        model: 'gemini-pro-vision'
      }
    }

    if (claudeKey) {
      return {
        provider: 'claude' as const,
        apiKey: claudeKey,
        model: 'claude-3-sonnet-20240229'
      }
    }

    return null
  }

  // 构建图片分析提示
  private static buildImageAnalysisPrompt(userQuestion?: string, context?: KnowledgeContext): string {
    let prompt = '请分析这张图片中的学习内容，特别关注：\n'
    prompt += '1. 图片中的文字内容（如题目、公式等）\n'
    prompt += '2. 数学公式或图形的识别\n'
    prompt += '3. 题目的解题思路和步骤\n'
    prompt += '4. 相关的知识点和概念\n\n'

    if (context) {
      prompt += `当前学习上下文：\n`
      if (context.currentSubject) prompt += `- 学科：${context.currentSubject.name}\n`
      if (context.currentChapter) prompt += `- 章节：${context.currentChapter.name}\n`
      if (context.currentKnowledgePoint) prompt += `- 知识点：${context.currentKnowledgePoint.title}\n`
      prompt += '\n'
    }

    if (userQuestion) {
      prompt += `用户的具体问题：${userQuestion}\n\n`
    }

    prompt += '请用中文回答，语言要清晰易懂，适合学生理解。如果是数学题，请提供详细的解题步骤。'

    return prompt
  }

  // 格式化图片分析响应
  private static formatImageAnalysisResponse(
    analysisResult: ImageAnalysisResult,
    userQuestion?: string
  ): string {
    let response = '📸 **图片分析结果**\n\n'

    // 基础描述
    response += `**图片内容：**\n${analysisResult.description}\n\n`

    // 数学公式
    if (analysisResult.mathEquations && analysisResult.mathEquations.length > 0) {
      response += '**识别到的数学公式：**\n'
      analysisResult.mathEquations.forEach((equation, index) => {
        response += `${index + 1}. ${equation}\n`
      })
      response += '\n'
    }

    // 学科信息
    if (analysisResult.subjects && analysisResult.subjects.length > 0) {
      response += `**涉及学科：** ${analysisResult.subjects.join('、')}\n\n`
    }

    // 难度评估
    if (analysisResult.difficulty) {
      const difficultyMap = {
        basic: '基础',
        intermediate: '中等',
        advanced: '高级'
      }
      response += `**难度等级：** ${difficultyMap[analysisResult.difficulty]}\n\n`
    }

    // 学习建议
    if (analysisResult.suggestions && analysisResult.suggestions.length > 0) {
      response += '**学习建议：**\n'
      analysisResult.suggestions.forEach((suggestion, index) => {
        response += `${index + 1}. ${suggestion}\n`
      })
      response += '\n'
    }

    // 针对用户问题的回答
    if (userQuestion) {
      response += '**针对你的问题：**\n'
      response += '基于图片内容，我建议你可以从以下几个方面来思考和解决这个问题。如果需要更详细的解答，请告诉我具体哪个步骤需要帮助。\n\n'
    }

    response += '💡 **提示：** 如果你需要更详细的解题步骤或有其他疑问，请继续提问！'

    return response
  }
}
