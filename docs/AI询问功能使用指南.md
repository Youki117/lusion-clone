# AI询问功能使用指南

## 📋 概述

AI询问功能是lusion-clone项目中知识卡片的重要增强功能，为学习者提供智能化的问答体验。该功能采用外置扩展设计，不影响原有布局，支持浮动对话气泡和完整AI对话窗口。

## 🎯 主要特性

### 1. 外置扩展设计
- **保持原布局**：知识内容和3D模型/资源保持原有两栏布局
- **外置AI区域**：AI询问功能作为独立区域添加在学习资源下方
- **浮动对话气泡**：右侧显示优雅的对话气泡预览
- **完整对话窗口**：点击后展开完整的AI对话界面

### 2. 智能内容预加载
- **复制检测**：自动监听用户复制操作
- **内容预填充**：复制的文本自动填入AI询问框
- **自动唤起**：复制内容时AI窗口自动打开

### 3. 快捷提问选项
- **知识点讲解**：一键获取详细的知识点解释
- **相关题型分析**：分析可能的考试题型和知识点联动
- **学习建议**：获取个性化的学习方法和记忆技巧

### 4. 优雅的用户界面
- **透明背景**：使用渐变背景和毛玻璃效果
- **最小化功能**：支持窗口最小化以节省空间
- **消息气泡**：区分用户和AI消息的视觉样式

## 🚀 使用方法

### 1. 启动AI助手
```typescript
// 步骤1：点击学习资源下方的"开启AI助手"按钮
// 步骤2：右侧出现浮动对话气泡预览
// 步骤3：点击"打开AI对话"进入完整对话界面

// 复制内容自动预加载：
// 选中知识点文本 → Ctrl+C → AI助手自动启动并预加载内容
```

### 2. 快捷提问
```typescript
const quickOptions = [
  {
    icon: Lightbulb,
    text: '知识点讲解',
    prompt: `请详细讲解"${knowledgePointTitle}"这个知识点...`
  },
  {
    icon: Target,
    text: '相关题型分析',
    prompt: `请分析"${knowledgePointTitle}"可能会出现的题型...`
  },
  {
    icon: BookOpen,
    text: '学习建议',
    prompt: `针对"${knowledgePointTitle}"这个知识点，请给出学习方法...`
  }
]
```

### 3. 消息交互
- **发送消息**：输入问题后点击发送按钮或按Enter键
- **复制消息**：悬停在消息上显示复制按钮
- **滚动查看**：消息列表自动滚动到最新消息

## 🎨 界面设计

### 1. 布局结构
```
┌─────────────────────────────────────────────────────────────┐
│                    知识卡片头部                              │
├─────────────────┬───────────────────────────────────────────┤
│                 │              3D模型                       │
│   知识点内容     ├───────────────────────────────────────────┤
│   (flex-1)      │             学习资源                       │
│                 ├───────────────────────────────────────────┤
│                 │           [开启AI助手]                     │
└─────────────────┴───────────────────────────────────────────┘
                                    ┌─────────────────┐
                                    │   浮动对话气泡   │ (右侧)
                                    └─────────────────┘
```

### 2. 颜色方案
- **AI窗口背景**：`from-indigo-900/20 to-purple-900/20`
- **用户消息**：`bg-blue-600/20 border-blue-500/30`
- **AI消息**：`bg-white/5 border-white/10`
- **快捷按钮**：`hover:bg-white/5`

### 3. 动画效果
- **窗口展开**：`width: 0 → 400px`，spring动画
- **消息出现**：`opacity: 0, y: 10 → opacity: 1, y: 0`
- **加载状态**：旋转动画的加载指示器

## 🔧 技术实现

### 1. 核心组件
```typescript
// AI询问窗口组件
<AIQueryPanel
  isOpen={isAIQueryOpen}
  onClose={() => setIsAIQueryOpen(false)}
  knowledgePointTitle={knowledgePoint.title}
  preloadedContent={copiedContent}
  className="flex-shrink-0"
/>
```

### 2. 状态管理
```typescript
const [isAIQueryOpen, setIsAIQueryOpen] = useState(false)
const [copiedContent, setCopiedContent] = useState('')
const [messages, setMessages] = useState<Message[]>([])
const [isLoading, setIsLoading] = useState(false)
```

### 3. 复制检测
```typescript
useEffect(() => {
  const handleCopy = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()
    
    if (selectedText && selectedText.length > 10) {
      setCopiedContent(selectedText)
      if (!isAIQueryOpen) {
        setIsAIQueryOpen(true)
      }
    }
  }

  document.addEventListener('copy', handleCopy)
  return () => document.removeEventListener('copy', handleCopy)
}, [isAIQueryOpen])
```

## 📱 响应式设计

### 1. 桌面端 (>= 1024px)
- 完整三栏布局
- AI窗口宽度：400px
- 3D模型区域：320px (AI开启时) / 384px (AI关闭时)

### 2. 平板端 (768px - 1023px)
- 保持三栏布局，调整间距
- AI窗口宽度：350px
- 减少内边距

### 3. 移动端 (< 768px)
- AI窗口覆盖显示
- 全屏模式
- 触摸优化的交互

## 🧪 测试指南

### 1. 功能测试
访问测试页面：`http://localhost:3001/test-ai-query`

测试步骤：
1. 点击知识点卡片打开详情
2. 点击消息图标打开AI询问窗口
3. 选择知识点内容并复制，验证自动预加载
4. 测试快捷选项功能
5. 验证消息发送和接收
6. 测试窗口最小化/最大化功能

### 2. 性能测试
- 布局切换动画流畅度
- 消息列表滚动性能
- 复制检测响应速度
- 内存使用情况

### 3. 兼容性测试
- 不同浏览器的兼容性
- 移动设备的触摸交互
- 键盘导航支持

## 🔮 未来扩展

### 1. AI集成
- 接入真实的AI API（如OpenAI、Claude等）
- 支持流式响应
- 上下文记忆功能

### 2. 个性化功能
- 学习偏好记录
- 问题历史管理
- 智能推荐问题

### 3. 协作功能
- 分享对话记录
- 导出学习笔记
- 多人协作讨论

## 📊 使用统计

可以通过以下指标评估AI询问功能的使用效果：
- AI窗口打开频率
- 快捷选项使用率
- 复制预加载触发次数
- 平均对话轮数
- 用户满意度评分

---

**注意**：当前版本使用模拟AI响应，实际部署时需要集成真实的AI服务。
