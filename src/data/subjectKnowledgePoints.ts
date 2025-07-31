import { KnowledgePoint, Resource, Exercise } from '@/types'

// 数学学科知识点数据
export const mathematicsKnowledgePoints: KnowledgePoint[] = [
  {
    id: 'math-set-concept',
    chapterId: 'math-ch1-sets',
    title: '集合的基本概念',
    content: `集合是数学中最基本的概念之一，是由确定的、互不相同的对象组成的整体。

**核心要点：**
1. **确定性**：集合中的元素必须是确定的
2. **互异性**：集合中的元素必须是互不相同的
3. **无序性**：集合中元素的排列顺序不影响集合本身

**表示方法：**
- 列举法：{1, 2, 3, 4, 5}
- 描述法：{x | x是小于10的正整数}
- 图示法：韦恩图

**常用符号：**
- ∈ 属于  - ∉ 不属于
- ⊆ 包含于 - ⊇ 包含
- ∩ 交集   - ∪ 并集`,
    difficulty: 'basic',
    tags: ['集合', '基础概念', '数学符号'],
    prerequisites: [],
    resources: [
      {
        id: 'math-set-video-1',
        type: 'video',
        title: '集合基本概念详解',
        url: '/videos/math/set-concept.mp4',
        description: '通过生动的动画演示集合的三大特性',
        duration: 480
      },
      {
        id: 'math-set-interactive-1',
        type: 'interactive',
        title: '集合概念互动演示',
        url: '/interactive/math/set-concept',
        description: '通过拖拽操作理解集合的确定性、互异性和无序性'
      },
      {
        id: 'math-set-3d-1',
        type: 'model3d',
        title: '3D韦恩图模型',
        url: '/models/math/venn-diagram.glb',
        description: '立体韦恩图帮助理解集合间的关系'
      }
    ],
    exercises: [
      {
        id: 'math-set-ex-1',
        question: '下列各组对象能构成集合的是',
        options: ['所有的好人', '接近1的实数', '平面上到点O距离等于1的点', '很大的数'],
        correctAnswer: 2,
        explanation: '集合的元素必须具有确定性。只有选项C中"到点O距离等于1的点"是确定的。',
        difficulty: 'basic',
        points: 5,
        tags: ['集合定义', '确定性']
      }
    ],
    estimatedTime: 25
  },
  {
    id: 'math-function-concept',
    chapterId: 'math-ch2-functions',
    title: '函数的概念',
    content: `函数是数学中描述两个变量之间对应关系的重要概念。

**定义：**
设A、B是非空的数集，如果按照某种确定的对应关系f，使对于集合A中的任意一个数x，在集合B中都有唯一确定的数f(x)和它对应，那么就称f：A→B为从集合A到集合B的一个函数。

**三要素：**
1. **定义域**：自变量x的取值范围
2. **值域**：函数值的集合
3. **对应关系**：从定义域到值域的映射规则

**表示方法：**
- 解析法：f(x) = x² + 1
- 列表法：用表格表示
- 图像法：坐标系中的图形

**重要性质：**
- 单调性：递增或递减
- 奇偶性：关于原点或y轴对称
- 周期性：函数值按一定周期重复`,
    difficulty: 'intermediate',
    tags: ['函数', '定义域', '值域', '对应关系'],
    prerequisites: ['math-set-concept'],
    resources: [
      {
        id: 'math-func-video-1',
        type: 'video',
        title: '函数概念深度解析',
        url: '/videos/math/function-concept.mp4',
        description: '从生活实例到数学定义，全面理解函数概念',
        duration: 720
      },
      {
        id: 'math-func-3d-1',
        type: 'model3d',
        title: '3D函数图像展示',
        url: '/models/math/function-graphs.glb',
        description: '立体展示各种函数的图像特征'
      },
      {
        id: 'math-func-sim-1',
        type: 'simulation',
        title: '函数性质探索',
        url: '/simulation/math/function-properties',
        description: '通过参数调节探索函数的单调性、奇偶性等性质'
      }
    ],
    exercises: [
      {
        id: 'math-func-ex-1',
        question: '函数f(x) = √(x-1) + 1/(x-2)的定义域是',
        options: ['[1, +∞)', '(2, +∞)', '[1, 2) ∪ (2, +∞)', '(-∞, 1] ∪ (2, +∞)'],
        correctAnswer: 2,
        explanation: '要使函数有意义，需要满足：①x-1≥0，即x≥1；②x-2≠0，即x≠2。因此定义域为[1, 2) ∪ (2, +∞)。',
        difficulty: 'intermediate',
        points: 8,
        tags: ['定义域', '根式函数', '分式函数']
      }
    ],
    estimatedTime: 35
  }
  // TODO: 添加更多数学知识点
  // 预留扩充接口：可以继续添加更多章节的知识点
]

// 物理学科知识点数据
export const physicsKnowledgePoints: KnowledgePoint[] = [
  {
    id: 'physics-motion-concept',
    chapterId: 'physics-ch1-motion',
    title: '运动的描述',
    content: `运动是物理学研究的基本现象，描述运动需要建立合适的参考系和坐标系。

**基本概念：**
1. **质点**：用来代替物体的有质量的点
2. **参考系**：描述物体运动时选定的标准物体
3. **坐标系**：在参考系上建立的坐标体系

**位移和路程：**
- **位移**：从初位置到末位置的有向线段，是矢量
- **路程**：物体运动轨迹的长度，是标量

**速度和速率：**
- **平均速度**：位移与时间的比值，v = Δx/Δt
- **瞬时速度**：某一时刻的速度
- **速率**：速度的大小，是标量

**加速度：**
- 描述速度变化快慢的物理量
- a = Δv/Δt，单位：m/s²`,
    difficulty: 'basic',
    tags: ['运动学', '质点', '参考系', '位移', '速度'],
    prerequisites: [],
    resources: [
      {
        id: 'physics-motion-video-1',
        type: 'video',
        title: '运动描述基础',
        url: '/videos/physics/motion-description.mp4',
        description: '通过实例理解参考系、位移、速度等概念',
        duration: 600
      },
      {
        id: 'physics-motion-3d-1',
        type: 'model3d',
        title: '3D运动轨迹演示',
        url: '/models/physics/motion-trajectory.glb',
        description: '立体展示物体在不同参考系下的运动轨迹'
      },
      {
        id: 'physics-motion-sim-1',
        type: 'simulation',
        title: '运动分析仿真',
        url: '/simulation/physics/motion-analysis',
        description: '交互式分析不同运动的位移、速度、加速度关系'
      }
    ],
    exercises: [
      {
        id: 'physics-motion-ex-1',
        question: '关于位移和路程，下列说法正确的是',
        options: [
          '位移和路程都是矢量',
          '位移和路程都是标量',
          '位移是矢量，路程是标量',
          '位移是标量，路程是矢量'
        ],
        correctAnswer: 2,
        explanation: '位移是从初位置指向末位置的有向线段，是矢量；路程是运动轨迹的长度，是标量。',
        difficulty: 'basic',
        points: 6,
        tags: ['位移', '路程', '矢量', '标量']
      }
    ],
    estimatedTime: 30
  }
  // TODO: 添加更多物理知识点
  // 预留扩充接口：可以继续添加更多章节的知识点
]

// 化学学科知识点数据
export const chemistryKnowledgePoints: KnowledgePoint[] = [
  {
    id: 'chemistry-atom-structure',
    chapterId: 'chemistry-ch1-atoms',
    title: '原子结构',
    content: `原子是化学变化中的最小粒子，由原子核和核外电子组成。

**原子构成：**
1. **原子核**：由质子和中子组成，位于原子中心
2. **核外电子**：在原子核外空间运动

**基本粒子：**
- **质子**：带正电荷，质量约为1u
- **中子**：不带电，质量约为1u  
- **电子**：带负电荷，质量约为1/1836u

**原子结构模型：**
- 道尔顿原子模型（实心球模型）
- 汤姆逊原子模型（葡萄干布丁模型）
- 卢瑟福原子模型（行星模型）
- 玻尔原子模型（轨道模型）
- 现代原子模型（电子云模型）

**核外电子排布：**
- 电子在原子核外分层排布
- 每层最多容纳的电子数：2n²`,
    difficulty: 'intermediate',
    tags: ['原子', '原子核', '电子', '原子结构'],
    prerequisites: [],
    resources: [
      {
        id: 'chemistry-atom-video-1',
        type: 'video',
        title: '原子结构探秘',
        url: '/videos/chemistry/atom-structure.mp4',
        description: '从历史发展角度理解原子结构模型的演变',
        duration: 540
      },
      {
        id: 'chemistry-atom-3d-1',
        type: 'model3d',
        title: '3D原子模型',
        url: '/models/chemistry/atom-model.glb',
        description: '立体展示原子内部结构和电子云分布'
      }
    ],
    exercises: [
      {
        id: 'chemistry-atom-ex-1',
        question: '原子核外第三层最多能容纳的电子数是',
        options: ['2个', '8个', '18个', '32个'],
        correctAnswer: 2,
        explanation: '根据2n²公式，第三层(n=3)最多容纳电子数为2×3²=18个。',
        difficulty: 'basic',
        points: 4,
        tags: ['电子排布', '原子结构']
      }
    ],
    estimatedTime: 40
  }
  // TODO: 添加更多化学知识点
]

// 根据学科ID获取知识点数据的统一接口
export const getKnowledgePointsBySubject = (subjectId: string): KnowledgePoint[] => {
  switch (subjectId) {
    case 'mathematics':
      return mathematicsKnowledgePoints
    case 'physics':
      return physicsKnowledgePoints
    case 'chemistry':
      return chemistryKnowledgePoints
    // TODO: 添加更多学科的知识点数据
    case 'biology':
      return [] // 预留生物学科接口
    case 'chinese':
      return [] // 预留语文学科接口
    case 'english':
      return [] // 预留英语学科接口
    case 'history':
      return [] // 预留历史学科接口
    case 'geography':
      return [] // 预留地理学科接口
    case 'politics':
      return [] // 预留政治学科接口
    default:
      return []
  }
}

// 根据知识点ID获取具体知识点
export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  const allKnowledgePoints = [
    ...mathematicsKnowledgePoints,
    ...physicsKnowledgePoints,
    ...chemistryKnowledgePoints
    // TODO: 添加其他学科的知识点数组
  ]
  return allKnowledgePoints.find(point => point.id === id)
}

// 根据章节ID获取知识点列表
export const getKnowledgePointsByChapter = (chapterId: string): KnowledgePoint[] => {
  const allKnowledgePoints = [
    ...mathematicsKnowledgePoints,
    ...physicsKnowledgePoints,
    ...chemistryKnowledgePoints
    // TODO: 添加其他学科的知识点数组
  ]
  return allKnowledgePoints.filter(point => point.chapterId === chapterId)
}

// 获取学科的章节列表（从知识点数据中提取）
export const getChaptersBySubject = (subjectId: string): Array<{id: string, name: string, knowledgePoints: KnowledgePoint[]}> => {
  const knowledgePoints = getKnowledgePointsBySubject(subjectId)
  const chaptersMap = new Map<string, KnowledgePoint[]>()
  
  knowledgePoints.forEach(point => {
    if (!chaptersMap.has(point.chapterId)) {
      chaptersMap.set(point.chapterId, [])
    }
    chaptersMap.get(point.chapterId)!.push(point)
  })
  
  return Array.from(chaptersMap.entries()).map(([chapterId, points]) => ({
    id: chapterId,
    name: getChapterName(chapterId), // 需要实现章节名称映射
    knowledgePoints: points
  }))
}

// 章节ID到名称的映射（预留扩充接口）
function getChapterName(chapterId: string): string {
  const chapterNames: Record<string, string> = {
    // 数学章节
    'math-ch1-sets': '第一章：集合与常用逻辑用语',
    'math-ch2-functions': '第二章：函数概念与性质',
    // 物理章节
    'physics-ch1-motion': '第一章：运动的描述',
    // 化学章节
    'chemistry-ch1-atoms': '第一章：原子结构与元素周期律',
    // TODO: 添加更多章节名称映射
  }
  return chapterNames[chapterId] || chapterId
}
