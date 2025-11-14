export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  profileStrength?: number
  createdAt: string
  updatedAt: string
  stack?: string[]
}

export interface InterviewSession {
  id: string
  userId: string
  title: string
  category: "technical" | "behavioral" | "case-study"
  question: string
  userResponse?: string
  aiAnalysis?: {
    score: number
    strengths: string[]
    improvements: string[]
    tips: string[]
  }
  recordingUrl?: string
  createdAt: string
  updatedAt: string
}

export interface VocabularyWord {
  id: string
  userId: string
  word: string
  definition: string
  usage: string
  examples: string[]
  reviewCount: number
  lastReviewedAt?: string
  createdAt: string
}

export interface GrowthMetric {
  id: string
  userId: string
  date: string
  conversationScore: number
  clarityScore: number
  confidenceScore: number
  overallScore: number
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}
