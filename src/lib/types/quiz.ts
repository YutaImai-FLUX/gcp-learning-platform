export type CertificationId = "cdl" | "ace" | "pca" | "pde" | "pmle" | "pcne" | "pcse" | "pcd"
export type DifficultyLevel = "easy" | "medium" | "hard"
export type CertificationLevel = "Foundational" | "Associate" | "Professional"
export type QuizMode = "practice" | "exam" | "domain"

export interface CertDomain {
  name: string
  percentage: number
  topics: string[]
}

export interface ExamInfo {
  cost: string
  format: string
  delivery: string
  validity: string
  retakePolicy: string
  languages: string[]
  note: string
}

export interface StudyResource {
  name: string
  type: "course" | "lab" | "practice" | "book" | "doc" | "video"
  provider: string
  duration?: string
  isFree: boolean
  description: string
}

export interface WeeklyPlan {
  week: number
  theme: string
  topics: string[]
  goal: string
}

export interface Certification {
  id: CertificationId
  name: string
  shortName: string
  level: CertificationLevel
  durationMinutes: number
  questionCount: number
  passingScore: number
  description: string
  color: string
  bgColor: string
  icon: string
  domains: CertDomain[]
  studyGuide: string[]
  keyServices: string[]
  examTips?: string[]
  estimatedStudyHours?: number
  prerequisites?: string[]
  examInfo?: ExamInfo
  officialResources?: StudyResource[]
  weeklyStudyPlan?: WeeklyPlan[]
}

export interface QuizQuestion {
  id: string
  certId: CertificationId
  domain: string
  difficulty: DifficultyLevel
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  tags: string[]
}

export interface QuizSession {
  certId: CertificationId
  mode: QuizMode
  domain?: string
  questions: QuizQuestion[]
  answers: (number | null)[]
  currentIndex: number
  startTime: number
  endTime?: number
  completed: boolean
}

export interface QuizResult {
  certId: CertificationId
  totalQuestions: number
  correctAnswers: number
  score: number
  passed: boolean
  timeTakenSeconds: number
  domainScores: Record<string, { correct: number; total: number }>
  wrongQuestions: QuizQuestion[]
}
