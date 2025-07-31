'use client'

import React from 'react'

interface MessageContentProps {
  content: string
  className?: string
}

export function MessageContent({ content, className = '' }: MessageContentProps) {
  // 处理消息内容的格式化
  const formatContent = (text: string) => {
    // 将文本按行分割
    const lines = text.split('\n')
    const formattedElements: React.ReactNode[] = []
    
    let currentIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // 跳过空行，但保留间距
      if (line === '') {
        formattedElements.push(<br key={`br-${currentIndex++}`} />)
        continue
      }
      
      // 处理标题（以 ** 开头和结尾的）
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        const title = line.slice(2, -2)
        formattedElements.push(
          <div key={`title-${currentIndex++}`} className="font-bold text-blue-300 mt-3 mb-2 text-base">
            {title}
          </div>
        )
        continue
      }
      
      // 处理数字标题（如 **1. 有理数**）
      if (line.match(/^\*\*\d+\.\s+.+\*\*$/)) {
        const title = line.slice(2, -2)
        formattedElements.push(
          <div key={`numbered-title-${currentIndex++}`} className="font-bold text-blue-300 mt-4 mb-2 text-base">
            {title}
          </div>
        )
        continue
      }
      
      // 处理列表项（以 - 开头）
      if (line.startsWith('- ')) {
        const listItem = line.slice(2)
        formattedElements.push(
          <div key={`list-${currentIndex++}`} className="flex items-start space-x-2 my-1 ml-4">
            <span className="text-blue-400 mt-1">•</span>
            <span className="flex-1">{formatInlineText(listItem)}</span>
          </div>
        )
        continue
      }
      
      // 处理表格行（包含 | 的行）
      if (line.includes('|') && line.split('|').length > 2) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '')

        // 检查是否是表格分隔行
        if (cells.every(cell => cell.match(/^-+$/))) {
          continue // 跳过分隔行
        }

        // 判断是否是表头
        const isHeader = i === 0 || (i > 0 && lines[i + 1] && lines[i + 1].includes('---'))

        formattedElements.push(
          <div key={`table-row-${currentIndex++}`} className={`grid gap-2 py-2 px-3 rounded ${
            isHeader ? 'bg-blue-500/20 font-semibold text-blue-200' : 'bg-gray-700/30'
          } my-1`} style={{ gridTemplateColumns: `repeat(${Math.min(cells.length, 4)}, 1fr)` }}>
            {cells.map((cell, cellIndex) => (
              <div key={`cell-${cellIndex}`} className="text-sm">
                {formatInlineText(cell)}
              </div>
            ))}
          </div>
        )
        continue
      }

      // 处理代码块（以 ``` 开头的行）
      if (line.startsWith('```')) {
        const codeLines = []
        let j = i + 1

        // 查找代码块结束
        while (j < lines.length && !lines[j].trim().startsWith('```')) {
          codeLines.push(lines[j])
          j++
        }

        if (codeLines.length > 0) {
          formattedElements.push(
            <div key={`code-block-${currentIndex++}`} className="bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto">
              <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                {codeLines.join('\n')}
              </pre>
            </div>
          )
          i = j // 跳过代码块内容
          continue
        }
      }
      
      // 处理引用块（以 > 开头）
      if (line.startsWith('> ')) {
        const quote = line.slice(2)
        formattedElements.push(
          <div key={`quote-${currentIndex++}`} className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-500/10 rounded-r">
            <div className="text-blue-200 italic">
              {formatInlineText(quote)}
            </div>
          </div>
        )
        continue
      }

      // 处理数学公式（包含特殊数学符号）
      if (line.includes('√') || line.includes('π') || line.includes('≈') || line.includes('≠') || line.includes('≤') || line.includes('≥')) {
        formattedElements.push(
          <div key={`math-${currentIndex++}`} className="my-2 leading-relaxed bg-purple-500/10 px-3 py-2 rounded border-l-4 border-purple-400">
            <div className="text-purple-200 font-mono">
              {formatMathText(line)}
            </div>
          </div>
        )
        continue
      }

      // 处理普通段落
      formattedElements.push(
        <div key={`paragraph-${currentIndex++}`} className="my-2 leading-relaxed">
          {formatInlineText(line)}
        </div>
      )
    }
    
    return formattedElements
  }
  
  // 处理行内格式（粗体、代码等）
  const formatInlineText = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentText = text
    let partIndex = 0
    
    // 处理粗体文本（**text**）
    const boldRegex = /\*\*([^*]+)\*\*/g
    let lastIndex = 0
    let match
    
    while ((match = boldRegex.exec(currentText)) !== null) {
      // 添加粗体前的文本
      if (match.index > lastIndex) {
        const beforeText = currentText.slice(lastIndex, match.index)
        if (beforeText) {
          parts.push(
            <span key={`text-${partIndex++}`}>
              {formatCodeAndMath(beforeText)}
            </span>
          )
        }
      }
      
      // 添加粗体文本
      parts.push(
        <strong key={`bold-${partIndex++}`} className="font-semibold text-white">
          {match[1]}
        </strong>
      )
      
      lastIndex = match.index + match[0].length
    }
    
    // 添加剩余文本
    if (lastIndex < currentText.length) {
      const remainingText = currentText.slice(lastIndex)
      if (remainingText) {
        parts.push(
          <span key={`text-${partIndex++}`}>
            {formatCodeAndMath(remainingText)}
          </span>
        )
      }
    }
    
    return parts.length > 0 ? parts : formatCodeAndMath(currentText)
  }
  
  // 处理代码和数学公式
  const formatCodeAndMath = (text: string): React.ReactNode => {
    // 处理行内代码（`code`）
    const codeRegex = /`([^`]+)`/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match
    let partIndex = 0
    
    while ((match = codeRegex.exec(text)) !== null) {
      // 添加代码前的文本
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index)
        if (beforeText) {
          parts.push(<span key={`text-${partIndex++}`}>{beforeText}</span>)
        }
      }
      
      // 添加代码
      parts.push(
        <code key={`code-${partIndex++}`} className="bg-gray-800 text-green-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {match[1]}
        </code>
      )
      
      lastIndex = match.index + match[0].length
    }
    
    // 添加剩余文本
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText) {
        parts.push(<span key={`text-${partIndex++}`}>{remainingText}</span>)
      }
    }
    
    return parts.length > 0 ? parts : text
  }

  // 处理数学文本
  const formatMathText = (text: string): React.ReactNode => {
    // 高亮数学符号
    const mathSymbols = {
      '√': <span key="sqrt" className="text-yellow-300 font-bold">√</span>,
      'π': <span key="pi" className="text-yellow-300 font-bold">π</span>,
      '≈': <span key="approx" className="text-green-300 font-bold">≈</span>,
      '≠': <span key="neq" className="text-red-300 font-bold">≠</span>,
      '≤': <span key="leq" className="text-blue-300 font-bold">≤</span>,
      '≥': <span key="geq" className="text-blue-300 font-bold">≥</span>,
      '∞': <span key="inf" className="text-purple-300 font-bold">∞</span>,
      '±': <span key="pm" className="text-orange-300 font-bold">±</span>
    }

    const parts: React.ReactNode[] = []
    let currentText = text
    let partIndex = 0

    // 替换数学符号
    for (const [symbol, element] of Object.entries(mathSymbols)) {
      const symbolParts = currentText.split(symbol)
      if (symbolParts.length > 1) {
        const newParts: React.ReactNode[] = []
        for (let i = 0; i < symbolParts.length; i++) {
          if (i > 0) {
            newParts.push(React.cloneElement(element as React.ReactElement, { key: `${symbol}-${partIndex++}` }))
          }
          if (symbolParts[i]) {
            newParts.push(<span key={`text-${partIndex++}`}>{symbolParts[i]}</span>)
          }
        }
        currentText = ''
        parts.push(...newParts)
        break
      }
    }

    if (currentText) {
      parts.push(<span key={`remaining-${partIndex++}`}>{currentText}</span>)
    }

    return parts.length > 0 ? parts : formatInlineText(text)
  }

  return (
    <div className={`message-content ${className}`}>
      {formatContent(content)}
    </div>
  )
}
