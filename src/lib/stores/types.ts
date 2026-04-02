import type { CertificationId, DifficultyLevel } from "@/lib/types/quiz"
import type { SRCard } from "@/lib/game/spaced-repetition"

// ─── User Profile ───
export interface UserProfile {
  displayName: string
  gcpExperience: "none" | "beginner" | "intermediate" | "advanced"
  targetCerts: CertificationId[]
  dailyStudyMinutes: number
  examDate?: string // ISO date string
  createdAt: number
}

// ─── Activity & Streak ───
export interface ActivityEntry {
  date: string // "YYYY-MM-DD"
  xpEarned: number
  actions: number
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string // "YYYY-MM-DD"
}

// ─── Cert Progress (extends existing) ───
export interface CertProgressExtended {
  certId: CertificationId
  completedModuleSectionIds: string[]
  completedLabIds: string[]
  completedLabStepIds: string[]
  quizHighScore: number
  quizAttempts: number
  domainScores: Record<string, { correct: number; total: number }>
  lastStudiedAt: number
}

// ─── Quiz History (for spaced repetition) ───
export interface QuizAttempt {
  certId: CertificationId
  questionId: string
  correct: boolean
  difficulty: DifficultyLevel
  domain: string
  timestamp: number
}

// ─── Demo Completion ───
export interface DemoCompletion {
  demoId: string
  firstInteractionAt: number
  interactionCount: number
  challengeCompleted: boolean
}

// ─── Achievement ───
export type AchievementCategory = "milestone" | "mastery" | "streak" | "explorer" | "specialist"

export interface AchievementDef {
  id: string
  nameJa: string
  descriptionJa: string
  icon: string // lucide icon name
  category: AchievementCategory
  xpReward: number
  condition: (state: GameState) => boolean
}

// ─── Notification Queue ───
export interface GameNotification {
  id: string
  type: "xp" | "level_up" | "achievement" | "streak"
  payload: {
    xp?: number
    level?: number
    achievementId?: string
    streakDays?: number
  }
  timestamp: number
}

// ─── Dungeon Progress ───
export interface DungeonRoomProgress {
  roomId: string
  certId: CertificationId
  cleared: boolean
  clearedAt?: number
  bestScore?: number
}

// ─── Full Game State ───
export interface GameState {
  version: number
  profile: UserProfile | null
  xp: number
  level: number
  certProgress: Partial<Record<CertificationId, CertProgressExtended>>
  activityLog: ActivityEntry[]
  streaks: StreakData
  unlockedAchievements: string[]
  quizHistory: QuizAttempt[]
  demoCompletions: Record<string, DemoCompletion>
  dungeonProgress: Record<string, DungeonRoomProgress> // keyed by roomId
  srCards: Record<string, SRCard> // keyed by card/question ID
  notifications: GameNotification[]
  lastActiveAt: number
  createdAt: number
}

// ─── Store Actions ───
export interface GameActions {
  // XP
  addXP: (amount: number, source: string) => void
  // Cert Progress
  completeModuleSection: (certId: CertificationId, sectionId: string) => void
  completeLab: (certId: CertificationId, labId: string) => void
  completeLabStep: (certId: CertificationId, stepId: string) => void
  updateQuizScore: (certId: CertificationId, score: number, domainScores: Record<string, { correct: number; total: number }>) => void
  // Quiz History
  addQuizAttempt: (attempt: Omit<QuizAttempt, "timestamp">) => void
  // Demo
  trackDemoInteraction: (demoId: string) => void
  // Dungeon
  clearDungeonRoom: (certId: CertificationId, roomId: string, score?: number) => void
  // Spaced Repetition
  updateSRCard: (card: SRCard) => void
  // Activity & Streak
  recordActivity: (xpEarned: number) => void
  // Achievements
  checkAndUnlockAchievements: () => void
  // Notifications
  dismissNotification: (id: string) => void
  clearNotifications: () => void
  // Profile
  setProfile: (profile: UserProfile) => void
  // Reset
  resetAll: () => void
}

export type GameStore = GameState & GameActions
