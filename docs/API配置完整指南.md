# 🔑 API配置完整指南

## 🎯 配置方式总览

您可以通过以下两种方式配置各个AI模型的API密钥：

### 1. **环境变量配置（推荐）**
### 2. **界面内配置（动态配置）**

---

## 🔧 方式一：环境变量配置

### **配置文件位置**
```
lusion-clone/.env.local
```

### **配置步骤**
1. 打开项目根目录的 `.env.local` 文件
2. 取消注释（删除 `#`）并填入您的API密钥：

```env
# DeepSeek API（用于文本对话）
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# OpenAI GPT-4 Vision（用于图片分析，推荐）
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here

# Google Gemini Vision（备选）
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here

# Anthropic Claude Vision（备选）
NEXT_PUBLIC_CLAUDE_API_KEY=your-claude-api-key-here
```

### **重启服务**
配置完成后需要重启开发服务器：
```bash
npm run dev
```

---

## 🖥️ 方式二：界面内配置

### **访问配置界面**
1. 访问 `/education` 页面
2. 点击右下角聊天按钮 💬
3. 点击设置按钮 ⚙️（齿轮图标）
4. 选择 "AI模型配置"

### **配置界面功能**
- ✅ **多模型支持**：同时配置多个AI服务
- ✅ **密钥隐藏**：自动隐藏敏感信息
- ✅ **连接测试**：验证API密钥有效性
- ✅ **一键清除**：快速删除配置
- ✅ **获取链接**：直接跳转到API密钥获取页面

---

## 🤖 支持的AI模型

### **1. DeepSeek（必需）**
- **用途**：文本对话和问答
- **获取地址**：https://platform.deepseek.com/api_keys
- **密钥格式**：`sk-...`
- **说明**：主要的对话AI，必须配置

### **2. OpenAI GPT-4 Vision（推荐）**
- **用途**：图片分析和视觉理解
- **获取地址**：https://platform.openai.com/api-keys
- **密钥格式**：`sk-...`
- **说明**：图片分析效果最佳，特别适合数学公式识别

### **3. Google Gemini Vision（备选）**
- **用途**：图片分析
- **获取地址**：https://makersuite.google.com/app/apikey
- **密钥格式**：`AI...`
- **说明**：免费额度较高，响应速度快

### **4. Anthropic Claude Vision（备选）**
- **用途**：图片分析
- **获取地址**：https://console.anthropic.com/
- **密钥格式**：`sk-ant-...`
- **说明**：理解能力强，适合复杂题目分析

---

## 📋 配置要求

### **必需配置**
- ✅ **DeepSeek API**：用于基础文本对话

### **可选配置（至少选一个）**
- 🔸 **OpenAI GPT-4 Vision**：推荐，效果最佳
- 🔸 **Google Gemini Vision**：免费额度高
- 🔸 **Anthropic Claude Vision**：理解能力强

### **配置优先级**
系统会按以下优先级自动选择视觉AI服务：
1. OpenAI GPT-4 Vision
2. Google Gemini Vision  
3. Anthropic Claude Vision

---

## 🔐 安全说明

### **环境变量方式**
- ✅ 密钥存储在服务器环境中
- ✅ 不会暴露给客户端
- ✅ 适合生产环境

### **界面配置方式**
- ⚠️ 密钥存储在浏览器本地存储中
- ⚠️ 仅适合个人开发和测试
- ⚠️ 清除浏览器数据会丢失配置

### **安全建议**
1. **生产环境**：使用环境变量配置
2. **开发测试**：可使用界面配置
3. **定期更换**：定期更新API密钥
4. **权限控制**：设置API密钥的使用限制

---

## 🚀 使用流程

### **首次配置**
1. 获取所需的API密钥
2. 选择配置方式（环境变量或界面）
3. 填入API密钥
4. 测试连接是否正常
5. 开始使用AI功能

### **功能测试**
1. **文本对话**：发送文字问题测试DeepSeek
2. **图片分析**：上传题目图片测试视觉AI
3. **格式化显示**：检查回答格式是否正确

---

## 🆘 常见问题

### **Q: 为什么需要配置多个API？**
A: 不同AI服务有不同优势：
- DeepSeek：成本低，文本对话效果好
- 视觉AI：支持图片分析，DeepSeek目前不支持

### **Q: 可以只配置一个API吗？**
A: 可以，但功能会受限：
- 只配置DeepSeek：无法分析图片
- 只配置视觉AI：无法进行文本对话

### **Q: API密钥安全吗？**
A: 
- 环境变量方式：安全，推荐生产使用
- 界面配置方式：存储在本地，仅适合个人使用

### **Q: 如何获取免费的API密钥？**
A: 
- DeepSeek：注册即送免费额度
- OpenAI：新用户有免费额度
- Gemini：Google提供免费额度
- Claude：Anthropic提供免费额度

### **Q: API调用失败怎么办？**
A: 
1. 检查API密钥是否正确
2. 确认账户余额是否充足
3. 检查网络连接是否正常
4. 查看浏览器控制台错误信息

---

## 📊 费用说明

### **大概费用参考**
- **DeepSeek**：约 ¥0.001/1K tokens（非常便宜）
- **OpenAI GPT-4V**：约 $0.01/1K tokens
- **Gemini**：有免费额度，超出后付费
- **Claude**：有免费额度，超出后付费

### **节省费用建议**
1. 优先使用DeepSeek进行文本对话
2. 仅在需要时使用视觉AI分析图片
3. 设置API使用限制
4. 定期检查使用量

---

**配置完成后，您就可以享受完整的AI学习助手功能了！** 🎉
