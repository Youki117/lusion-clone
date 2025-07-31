import { KnowledgePoint, Resource, Exercise } from '@/types'

// 数学必修一：集合与常用逻辑用语 - 示例知识点
export const sampleKnowledgePoints: KnowledgePoint[] = [
  {
    id: 'set-basic-concept',
    chapterId: 'math-required-1-sets',
    title: '集合的基本概念',
    content: `集合是数学中最基本的概念之一。集合是由确定的、互不相同的对象组成的整体。

**核心要点：**
1. **确定性**：集合中的元素必须是确定的，对于任意一个对象，要么属于这个集合，要么不属于这个集合。
2. **互异性**：集合中的元素必须是互不相同的，相同的对象在一个集合中只能出现一次。
3. **无序性**：集合中元素的排列顺序不影响集合本身。

**表示方法：**
- 列举法：{1, 2, 3, 4, 5}
- 描述法：{x | x是小于10的正整数}
- 图示法：韦恩图

**常用符号：**
- ∈ 属于
- ∉ 不属于
- ⊆ 包含于
- ⊇ 包含
- ∩ 交集
- ∪ 并集`,
    difficulty: 'basic',
    tags: ['集合', '基础概念', '数学符号', '韦恩图'],
    prerequisites: [],
    resources: [
      {
        id: 'set-concept-video',
        type: 'video',
        title: '集合基本概念详解',
        url: '/videos/math/set-basic-concept.mp4',
        description: '通过生动的动画演示集合的三大特性',
        duration: 480,
        thumbnail: '/images/thumbnails/set-concept.jpg'
      },
      {
        id: 'set-concept-interactive',
        type: 'interactive',
        title: '集合概念互动演示',
        url: '/interactive/math/set-concept',
        description: '通过拖拽操作理解集合的确定性、互异性和无序性'
      },
      {
        id: 'venn-diagram-3d',
        type: 'model3d',
        title: '3D韦恩图模型',
        url: '/models/math/venn-diagram-3d.glb',
        description: '立体韦恩图帮助理解集合间的关系'
      }
    ],
    exercises: [
      {
        id: 'set-basic-1',
        question: '下列各组对象能构成集合的是',
        options: [
          '所有的好人',
          '接近1的实数',
          '平面上到点O距离等于1的点',
          '很大的数'
        ],
        correctAnswer: 2,
        explanation: '集合的元素必须具有确定性。选项A、B、D中的"好人"、"接近1"、"很大"都是模糊的概念，不满足确定性。只有选项C中"到点O距离等于1的点"是确定的。',
        difficulty: 'basic',
        points: 5,
        tags: ['集合定义', '确定性']
      }
    ],
    estimatedTime: 25
  },
  {
    id: 'function-concept',
    chapterId: 'math-required-1-functions',
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
    tags: ['函数', '定义域', '值域', '对应关系', '函数性质'],
    prerequisites: ['set-basic-concept'],
    resources: [
      {
        id: 'function-concept-video',
        type: 'video',
        title: '函数概念深度解析',
        url: '/videos/math/function-concept.mp4',
        description: '从生活实例到数学定义，全面理解函数概念',
        duration: 720,
        thumbnail: '/images/thumbnails/function-concept.jpg'
      },
      {
        id: 'function-graph-3d',
        type: 'model3d',
        title: '3D函数图像展示',
        url: '/models/math/function-graphs-3d.glb',
        description: '立体展示各种函数的图像特征'
      },
      {
        id: 'function-interactive',
        type: 'interactive',
        title: '函数图像绘制器',
        url: '/interactive/math/function-plotter',
        description: '输入函数表达式，实时绘制函数图像'
      },
      {
        id: 'function-simulation',
        type: 'simulation',
        title: '函数性质探索',
        url: '/simulation/math/function-properties',
        description: '通过参数调节探索函数的单调性、奇偶性等性质'
      }
    ],
    exercises: [
      {
        id: 'function-basic-1',
        question: '函数f(x) = √(x-1) + 1/(x-2)的定义域是',
        options: [
          '[1, +∞)',
          '(2, +∞)',
          '[1, 2) ∪ (2, +∞)',
          '(-∞, 1] ∪ (2, +∞)'
        ],
        correctAnswer: 2,
        explanation: '要使函数有意义，需要满足：①x-1≥0，即x≥1；②x-2≠0，即x≠2。因此定义域为[1, 2) ∪ (2, +∞)。',
        difficulty: 'intermediate',
        points: 8,
        tags: ['定义域', '根式函数', '分式函数']
      }
    ],
    estimatedTime: 35
  },
  {
    id: 'quadratic-function',
    chapterId: 'math-required-1-functions',
    title: '二次函数',
    content: `二次函数是最重要的基本初等函数之一，在数学和实际应用中都有广泛的用途。

**标准形式：**
f(x) = ax² + bx + c (a ≠ 0)

**图像特征：**
- 图像是一条抛物线
- 当a > 0时，开口向上；当a < 0时，开口向下
- 对称轴：x = -b/(2a)
- 顶点坐标：(-b/(2a), (4ac-b²)/(4a))

**三种表示形式：**
1. **一般式**：f(x) = ax² + bx + c
2. **顶点式**：f(x) = a(x - h)² + k，顶点为(h, k)
3. **交点式**：f(x) = a(x - x₁)(x - x₂)，x₁、x₂为与x轴交点的横坐标

**重要性质：**
- 单调性：在对称轴左侧和右侧的单调性相反
- 最值：在顶点处取得最大值或最小值
- 零点：通过判别式Δ = b² - 4ac判断零点个数`,
    difficulty: 'intermediate',
    tags: ['二次函数', '抛物线', '顶点', '对称轴', '最值'],
    prerequisites: ['function-concept'],
    resources: [
      {
        id: 'quadratic-function-video',
        type: 'video',
        title: '二次函数全面解析',
        url: '/videos/math/quadratic-function.mp4',
        description: '从图像到性质，深入理解二次函数',
        duration: 900,
        thumbnail: '/images/thumbnails/quadratic-function.jpg'
      },
      {
        id: 'parabola-3d-model',
        type: 'model3d',
        title: '3D抛物线模型',
        url: '/models/math/parabola-3d.glb',
        description: '立体展示抛物线的形状和参数变化'
      },
      {
        id: 'quadratic-interactive',
        type: 'interactive',
        title: '二次函数参数调节器',
        url: '/interactive/math/quadratic-adjuster',
        description: '通过滑块调节a、b、c参数，观察图像变化'
      }
    ],
    exercises: [
      {
        id: 'quadratic-1',
        question: '二次函数f(x) = x² - 4x + 3的顶点坐标是',
        options: [
          '(2, -1)',
          '(-2, -1)',
          '(2, 1)',
          '(-2, 1)'
        ],
        correctAnswer: 0,
        explanation: '对于f(x) = x² - 4x + 3，对称轴x = -(-4)/(2×1) = 2，顶点纵坐标f(2) = 4 - 8 + 3 = -1，所以顶点坐标为(2, -1)。',
        difficulty: 'intermediate',
        points: 6,
        tags: ['二次函数', '顶点坐标']
      }
    ],
    estimatedTime: 40
  }
]

// 根据ID获取知识点
export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  return sampleKnowledgePoints.find(point => point.id === id)
}

// 根据章节ID获取知识点列表
export const getKnowledgePointsByChapter = (chapterId: string): KnowledgePoint[] => {
  return sampleKnowledgePoints.filter(point => point.chapterId === chapterId)
}

// 获取所有知识点
export const getAllKnowledgePoints = (): KnowledgePoint[] => {
  return sampleKnowledgePoints
}
