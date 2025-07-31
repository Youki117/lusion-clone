// Basic types for the application
export interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  href: string
  tags: string[]
}

// Education and Knowledge Graph Types
export interface Subject {
  id: string
  name: string
  description: string
  chapters: Chapter[]
  color: string
  icon?: string
}

export interface Chapter {
  id: string
  subjectId: string
  name: string
  description: string
  knowledgePoints: KnowledgePoint[]
  order: number
}

export interface KnowledgePoint {
  id: string
  chapterId: string
  title: string
  content: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  tags: string[]
  prerequisites: string[] // IDs of prerequisite knowledge points
  resources: Resource[]
  exercises: Exercise[]
  estimatedTime: number // in minutes
}

export interface Resource {
  id: string
  type: 'video' | 'article' | 'interactive' | 'model3d' | 'simulation'
  title: string
  url: string
  description: string
  duration?: number // for videos, in seconds
  thumbnail?: string
}

export interface Exercise {
  id: string
  knowledgePointId?: string
  type?: 'multiple_choice' | 'fill_blank' | 'calculation' | 'proof' | 'application'
  question: string
  options?: string[] // for multiple choice
  correctAnswer: string | string[] | number
  explanation: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  points: number
  tags?: string[]
}

// Knowledge Graph Visualization Types
export interface GraphNode {
  id: string
  knowledgePoint: KnowledgePoint
  position: {
    x: number
    y: number
    z?: number // for 3D visualization
  }
  visual: {
    color: string
    size: number
    shape: 'circle' | 'square' | 'diamond' | 'triangle'
    isHighlighted: boolean
    isSelected: boolean
    opacity: number
  }
  connections: string[] // IDs of connected nodes
}

export interface GraphEdge {
  id: string
  source: string // source node ID
  target: string // target node ID
  type: 'prerequisite' | 'related' | 'sequence' | 'application'
  strength: number // 0-1, connection strength
  visual: {
    color: string
    width: number
    style: 'solid' | 'dashed' | 'dotted'
    animated: boolean
  }
}

// AI and Chat Types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  knowledgeContext?: KnowledgeContext
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: string
  type: 'image' | 'file' | 'exercise' | 'knowledge_point'
  name: string
  url?: string
  data?: any
}

export interface KnowledgeContext {
  currentSubject?: Subject
  currentChapter?: Chapter
  currentKnowledgePoint?: KnowledgePoint
  relatedPoints: KnowledgePoint[]
  userProgress: UserProgress
  difficulty: 'basic' | 'intermediate' | 'advanced'
}

export interface ConversationSession {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  knowledgeContext: KnowledgeContext
  startTime: Date
  lastActivity: Date
  status: 'active' | 'paused' | 'completed'
}

// User and Progress Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: UserPreferences
  progress: UserProgress
  createdAt: Date
  lastLogin: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  visualMode: '2d' | '3d'
  difficulty: 'basic' | 'intermediate' | 'advanced'
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
  }
}

export interface UserProgress {
  subjectProgress: SubjectProgress[]
  totalPoints: number
  level: number
  achievements: Achievement[]
  streakDays: number
  lastStudyDate: Date
}

export interface SubjectProgress {
  subjectId: string
  completedChapters: string[]
  completedKnowledgePoints: string[]
  masteredKnowledgePoints: string[]
  currentChapter?: string
  currentKnowledgePoint?: string
  timeSpent: number // in minutes
  exercisesCompleted: number
  exercisesCorrect: number
  lastStudied: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'progress' | 'streak' | 'mastery' | 'exploration'
}

// Additional types for UserProvider
export interface LearningProgress {
  currentLevel: number
  totalXP: number
  completedLessons: string[]
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
  weeklyGoal: number
  weeklyProgress: number
}

export interface UserStatistics {
  totalStudyTime: number // in minutes
  lessonsCompleted: number
  averageScore: number
  strongestSubjects: string[]
  weakestSubjects: string[]
  recentActivity: ActivityRecord[]
  monthlyProgress: MonthlyProgress[]
}

export interface ActivityRecord {
  id: string
  type: 'lesson_completed' | 'exercise_completed' | 'achievement_unlocked' | 'streak_milestone'
  timestamp: Date
  details: {
    subjectId?: string
    lessonId?: string
    score?: number
    timeSpent?: number
    achievementId?: string
  }
}

export interface MonthlyProgress {
  month: string // YYYY-MM format
  lessonsCompleted: number
  totalStudyTime: number
  averageScore: number
  streakDays: number
}
