export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
  gradient: string
  knowledgePoints: number
  difficulty: 'basic' | 'intermediate' | 'advanced'
  estimatedHours: number
  chapters: string[]
  image: string
  status: 'available' | 'coming_soon' | 'beta'
}

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: '数学',
    description: '从基础代数到高等数学，构建完整的数学知识体系。包含函数、几何、概率统计等核心内容。',
    icon: '📐',
    color: '#3b82f6',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    knowledgePoints: 156,
    difficulty: 'intermediate',
    estimatedHours: 120,
    chapters: [
      '必修一：集合与常用逻辑用语',
      '必修一：函数概念与性质',
      '必修一：指数函数与对数函数',
      '必修一：三角函数',
      '必修二：立体几何初步',
      '必修二：平面解析几何初步',
      '选择性必修一：空间向量与立体几何',
      '选择性必修一：直线和圆的方程',
      '选择性必修一：圆锥曲线的方程',
      '选择性必修二：等式与不等式',
      '选择性必修二：数列',
      '选择性必修二：一元函数的导数及其应用',
      '选择性必修三：计数原理',
      '选择性必修三：概率',
      '选择性必修三：统计'
    ],
    image: '/images/subjects/mathematics.jpg',
    status: 'available'
  },
  {
    id: 'physics',
    name: '物理',
    description: '探索自然界的基本规律，从力学到电磁学，从经典物理到现代物理的完整知识图谱。',
    icon: '⚛️',
    color: '#10b981',
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    knowledgePoints: 134,
    difficulty: 'advanced',
    estimatedHours: 100,
    chapters: [
      '必修一：运动的描述',
      '必修一：匀变速直线运动的研究',
      '必修一：相互作用',
      '必修一：运动和力的关系',
      '必修二：抛物运动',
      '必修二：圆周运动',
      '必修二：万有引力与宇宙航行',
      '必修二：机械能及其守恒定律',
      '必修三：电场',
      '必修三：电路',
      '必修三：磁场',
      '选择性必修一：动量守恒定律',
      '选择性必修一：机械振动',
      '选择性必修一：机械波',
      '选择性必修二：气体、固体和液体',
      '选择性必修二：热力学定律',
      '选择性必修三：交变电流',
      '选择性必修三：电磁感应',
      '选择性必修三：传感器'
    ],
    image: '/images/subjects/physics.jpg',
    status: 'available'
  },
  {
    id: 'chemistry',
    name: '化学',
    description: '从原子结构到化学反应，理解物质的组成、性质和变化规律。',
    icon: '🧪',
    color: '#f59e0b',
    gradient: 'from-amber-500 via-amber-600 to-amber-700',
    knowledgePoints: 98,
    difficulty: 'intermediate',
    estimatedHours: 80,
    chapters: [
      '必修一：从实验学化学',
      '必修一：化学物质及其变化',
      '必修一：金属及其化合物',
      '必修一：非金属及其化合物',
      '必修二：物质结构 元素周期律',
      '必修二：化学反应与能量',
      '必修二：有机化合物',
      '必修二：化学与自然资源的开发利用',
      '选择性必修一：原子结构与性质',
      '选择性必修一：分子结构与性质',
      '选择性必修一：晶体结构与性质',
      '选择性必修二：化学反应与能量',
      '选择性必修二：化学反应速率和化学平衡',
      '选择性必修二：水溶液中的离子平衡',
      '选择性必修二：电化学基础',
      '选择性必修三：认识有机化合物',
      '选择性必修三：烃和卤代烃',
      '选择性必修三：烃的含氧衍生物',
      '选择性必修三：生命中的基础有机化学物质',
      '选择性必修三：进入合成有机高分子化合物的时代'
    ],
    image: '/images/subjects/chemistry.jpg',
    status: 'available'
  },
  {
    id: 'biology',
    name: '生物',
    description: '探索生命的奥秘，从细胞到生态系统，理解生命现象和生物进化。',
    icon: '🧬',
    color: '#06b6d4',
    gradient: 'from-cyan-500 via-cyan-600 to-cyan-700',
    knowledgePoints: 112,
    difficulty: 'basic',
    estimatedHours: 90,
    chapters: [
      '必修一：走进细胞',
      '必修一：组成细胞的分子',
      '必修一：细胞的基本结构',
      '必修一：细胞的物质输入和输出',
      '必修一：细胞的能量供应和利用',
      '必修一：细胞的生命历程',
      '必修二：遗传因子的发现',
      '必修二：基因和染色体的关系',
      '必修二：基因的本质',
      '必修二：基因的表达',
      '必修二：基因突变及其他变异',
      '必修二：从杂交育种到基因工程',
      '必修二：现代生物进化理论',
      '必修三：人体的内环境与稳态',
      '必修三：动物和人体生命活动的调节',
      '必修三：植物的激素调节',
      '必修三：种群和群落',
      '必修三：生态系统及其稳定性',
      '必修三：生态环境的保护'
    ],
    image: '/images/subjects/biology.jpg',
    status: 'available'
  },
  {
    id: 'chinese',
    name: '语文',
    description: '提升语言文字运用能力，培养文学素养和人文精神。',
    icon: '📚',
    color: '#ef4444',
    gradient: 'from-red-500 via-red-600 to-red-700',
    knowledgePoints: 89,
    difficulty: 'basic',
    estimatedHours: 110,
    chapters: [
      '必修上册：现当代散文阅读',
      '必修上册：现当代诗歌阅读',
      '必修上册：外国诗歌散文欣赏',
      '必修上册：古代诗文阅读',
      '必修下册：论述类文本阅读',
      '必修下册：文学类文本阅读',
      '必修下册：实用类文本阅读',
      '必修下册：古代诗文阅读',
      '选择性必修上册：论语选读',
      '选择性必修上册：大学之道',
      '选择性必修上册：人皆有不忍人之心',
      '选择性必修中册：中华文化的智慧之花——熟语',
      '选择性必修中册：修辞无处不在',
      '选择性必修中册：逻辑的力量',
      '选择性必修下册：中国革命传统作品选读',
      '选择性必修下册：中华文化传承与创新',
      '选择性必修下册：实用性阅读与交流'
    ],
    image: '/images/subjects/chinese.jpg',
    status: 'available'
  },
  {
    id: 'english',
    name: '英语',
    description: '全面提升英语听说读写能力，掌握语法词汇和跨文化交际技能。',
    icon: '🌍',
    color: '#8b5cf6',
    gradient: 'from-violet-500 via-violet-600 to-violet-700',
    knowledgePoints: 145,
    difficulty: 'intermediate',
    estimatedHours: 150,
    chapters: [
      '必修第一册：Welcome Unit + Teenage Life',
      '必修第一册：Travelling Around + Sports and Fitness',
      '必修第一册：Natural Disasters + Languages Around the World',
      '必修第二册：Cultural Heritage + Wildlife Protection',
      '必修第二册：The Internet + History and Traditions + Music',
      '必修第三册：Festivals and Celebrations + Morals and Virtues',
      '必修第三册：Diverse Cultures + Space Exploration + The Value of Money',
      '选择性必修第一册：People of Achievement + Looking into the Future',
      '选择性必修第一册：Fascinating Parks + Body Language + Working the Land',
      '选择性必修第二册：Science and Scientists + Bridging Cultures',
      '选择性必修第二册：Food and Culture + Journey Across a Vast Land + First Aid',
      '选择性必修第三册：Art + Healthy Lifestyle + Environmental Protection',
      '选择性必修第三册：Adversity and Courage + Poems',
      '选择性必修第四册：Science Fiction + Iconic Attractions',
      '选择性必修第四册：Sea Exploration + Sharing + Launching Your Career'
    ],
    image: '/images/subjects/english.jpg',
    status: 'available'
  },
  {
    id: 'history',
    name: '历史',
    description: '了解人类文明发展历程，培养历史思维和文化认同感。',
    icon: '🏛️',
    color: '#f97316',
    gradient: 'from-orange-500 via-orange-600 to-orange-700',
    knowledgePoints: 76,
    difficulty: 'basic',
    estimatedHours: 70,
    chapters: [
      '必修一：从中华文明起源到秦汉统一多民族封建国家的建立与巩固',
      '必修一：三国两晋南北朝的民族交融与隋唐统一多民族封建国家的发展',
      '必修一：辽宋夏金元时期的制度变化与经济发展',
      '必修一：明清中国版图的奠定与面临的挑战',
      '必修一：晚清时期的内忧外患与救亡图存',
      '必修一：辛亥革命与中华民国的建立',
      '必修一：中国共产党成立与新民主主义革命兴起',
      '必修一：中华民族的抗日战争和人民解放战争',
      '必修二：古代文明的产生与发展',
      '必修二：中古时期的世界',
      '必修二：走向整体的世界',
      '必修二：工业革命与马克思主义的诞生',
      '必修二：当今世界政治格局的多极化趋势',
      '必修二：冷战与国际格局的演变',
      '必修二：当今世界发展的特点与主要趋势',
      '选择性必修一：国家制度与社会治理',
      '选择性必修二：经济与社会生活',
      '选择性必修三：文化交流与传播'
    ],
    image: '/images/subjects/history.jpg',
    status: 'beta'
  },
  {
    id: 'politics',
    name: '政治',
    description: '学习马克思主义基本原理，培养正确的世界观、人生观、价值观。',
    icon: '🏛️',
    color: '#dc2626',
    gradient: 'from-red-600 via-red-700 to-red-800',
    knowledgePoints: 84,
    difficulty: 'intermediate',
    estimatedHours: 75,
    chapters: [
      '必修一：中国特色社会主义',
      '必修二：经济与社会',
      '必修三：政治与法治',
      '必修四：哲学与文化',
      '选修一：当代国际政治与经济',
      '选修二：法律与生活',
      '选修三：逻辑与思维'
    ],
    image: '/images/subjects/politics.jpg',
    status: 'available'
  },
  {
    id: 'geography',
    name: '地理',
    description: '认识地球家园，理解自然地理和人文地理的相互关系。',
    icon: '🌏',
    color: '#14b8a6',
    gradient: 'from-teal-500 via-teal-600 to-teal-700',
    knowledgePoints: 67,
    difficulty: 'basic',
    estimatedHours: 60,
    chapters: [
      '必修一：行星地球',
      '必修一：地球上的大气',
      '必修一：地球上的水',
      '必修一：地表形态的塑造',
      '必修一：自然地理环境的整体性与差异性',
      '必修二：人口的变化',
      '必修二：城市与城市化',
      '必修二：农业地域的形成与发展',
      '必修二：工业地域的形成与发展',
      '必修二：交通运输布局及其影响',
      '必修二：人类与地理环境的协调发展',
      '必修三：地理环境与区域发展',
      '必修三：区域生态环境建设',
      '必修三：区域自然资源综合开发利用',
      '必修三：区域经济发展',
      '必修三：区际联系与区域协调发展',
      '选择性必修一：自然地理基础',
      '选择性必修二：区域发展',
      '选择性必修三：环境保护'
    ],
    image: '/images/subjects/geography.jpg',
    status: 'coming_soon'
  }
]

// 获取可用学科
export const getAvailableSubjects = () => {
  return subjects.filter(subject => subject.status === 'available')
}

// 获取即将推出的学科
export const getComingSoonSubjects = () => {
  return subjects.filter(subject => subject.status === 'coming_soon')
}

// 获取测试版学科
export const getBetaSubjects = () => {
  return subjects.filter(subject => subject.status === 'beta')
}

// 根据难度获取学科
export const getSubjectsByDifficulty = (difficulty: Subject['difficulty']) => {
  return subjects.filter(subject => subject.difficulty === difficulty)
}

// 根据ID获取学科
export const getSubjectById = (id: string) => {
  return subjects.find(subject => subject.id === id)
}
