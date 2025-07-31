'use client'

import React from 'react'
import { MessageContent } from '@/components/ui/education/MessageContent'

const testMessage = `好的！我来帮你理清有理数和无理数的概念，尽量用简单易懂的方式讲解。

**1. 有理数（Rational Numbers）**

- **定义**：可以表示为两个整数之比（分数形式）的数，即 a/b（其中a、b是整数，b≠0）
- **特点**：
  - 包括：整数（如-2, 0, 5）、分数（如1/2, -3/4）、有限小数（如0.5）、无限循环小数（如0.333...）
  - 例子：2 = 2/1，0.75 = 3/4，0.333... = 1/3

**2. 无理数（Irrational Numbers）**

- **定义**：不能表示为两个整数之比的数，即无法写成a/b的形式
- **特点**：
  - 无限不循环小数
  - 常见例子：√2、π（圆周率）、e（自然常数）
  - √2 ≈ 1.41421356...（永远不循环）

**关键区别对比表**：

| 特征 | 有理数 | 无理数 |
|-----------|--------------------|-----------------------|
| 表示形式 | 可写为分数a/b | 不能写为分数 |
| 小数形式 | 有限或无限循环 | 无限不循环 |
| 例子 | 3, -1/2, 0.25 | √3, π, 黄金比例(1+√5)/2 |

**常见误区提醒**：

- 不是所有带根号的数都是无理数！比如√4 = 2是有理数
- 22/7 ≠ π，它只是π的近似分数，π本身是无理数

**小测试**：

判断下列数属于哪一类？
① 0.1010010001...（规律但不循环）
② 17/5
③ √9
④ 圆周率π

（答案：①无理数 ②有理数 ③有理数 ④无理数）

> 需要我用更具体的例子说明某个点吗？或者你想了解这些数在数轴上的分布特点？

\`\`\`javascript
// 判断有理数的简单代码示例
function isRational(decimal) {
  // 检查是否为有限小数或循环小数
  const str = decimal.toString();
  return str.includes('.') ? str.split('.')[1].length < 10 : true;
}
\`\`\`

**数学公式示例**：
- 黄金比例：φ = (1 + √5) / 2 ≈ 1.618...
- 圆的面积：A = πr²
- 勾股定理：a² + b² = c²`

export default function TestMessageFormatPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          消息格式化测试页面
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            AI回答格式化效果预览：
          </h2>
          
          <div className="bg-gray-700 rounded-2xl px-4 py-3 text-white">
            <MessageContent content={testMessage} />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/education" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            返回教育页面测试
          </a>
        </div>
      </div>
    </div>
  )
}
