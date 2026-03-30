import type { DifficultyLevel } from "@/lib/types/quiz"
import type { StreakData, ActivityEntry } from "@/lib/stores/types"
import { XP_REWARDS, DIFFICULTY_MULTIPLIERS, STREAK_BONUS_PER_DAY, STREAK_BONUS_CAP } from "./xp-config"

/** Get today's date as YYYY-MM-DD */
export function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Calculate XP for a quiz correct answer with difficulty multiplier */
export function quizXP(difficulty: DifficultyLevel): number {
  return XP_REWARDS.quizCorrect * DIFFICULTY_MULTIPLIERS[difficulty]
}

/** Calculate streak bonus XP */
export function streakBonusXP(streakDays: number): number {
  return Math.min(streakDays * STREAK_BONUS_PER_DAY, STREAK_BONUS_CAP)
}

/** Update streak data based on current activity */
export function updateStreak(prev: StreakData, today: string): StreakData {
  if (prev.lastActiveDate === today) {
    return prev
  }

  const lastDate = new Date(prev.lastActiveDate)
  const todayDate = new Date(today)
  const diffMs = todayDate.getTime() - lastDate.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    const newStreak = prev.currentStreak + 1
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastActiveDate: today,
    }
  }

  return {
    currentStreak: 1,
    longestStreak: prev.longestStreak,
    lastActiveDate: today,
  }
}

/** Add or update today's activity entry */
export function updateActivityLog(log: ActivityEntry[], xpEarned: number): ActivityEntry[] {
  const today = todayString()
  const maxEntries = 365

  const existing = log.find((e) => e.date === today)
  if (existing) {
    return log.map((e) =>
      e.date === today
        ? { ...e, xpEarned: e.xpEarned + xpEarned, actions: e.actions + 1 }
        : e
    )
  }

  const updated = [...log, { date: today, xpEarned, actions: 1 }]
  return updated.length > maxEntries ? updated.slice(-maxEntries) : updated
}

/** Generate a unique notification ID */
export function generateNotificationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
