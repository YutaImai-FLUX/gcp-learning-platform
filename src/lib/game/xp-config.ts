import type { CertificationId, DifficultyLevel } from "@/lib/types/quiz"

// ─── XP Reward Table ───
export const XP_REWARDS = {
  quizCorrect: 10,
  moduleSectionComplete: 15,
  labStepComplete: 20,
  labFullComplete: 50,
  demoFirstInteraction: 30,
  dailyLogin: 5,
  achievementUnlock: 25,
} as const

// ─── Difficulty Multipliers ───
export const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
}

// ─── Streak Bonus ───
export const STREAK_BONUS_PER_DAY = 2
export const STREAK_BONUS_CAP = 20

// ─── Level Calculation ───
// threshold(n) = floor(100 * n^1.5)
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function levelFromXP(totalXP: number): number {
  let level = 1
  while (xpForLevel(level + 1) <= totalXP) {
    level++
  }
  return level
}

export function xpToNextLevel(totalXP: number): { current: number; required: number; progress: number } {
  const level = levelFromXP(totalXP)
  const currentThreshold = xpForLevel(level)
  const nextThreshold = xpForLevel(level + 1)
  const current = totalXP - currentThreshold
  const required = nextThreshold - currentThreshold
  return { current, required, progress: required > 0 ? current / required : 0 }
}

// ─── Level → Recommended Cert Mapping ───
export interface CertRecommendation {
  minLevel: number
  certIds: CertificationId[]
  labelJa: string
}

export const CERT_RECOMMENDATIONS: CertRecommendation[] = [
  { minLevel: 1, certIds: [], labelJa: "学習開始" },
  { minLevel: 10, certIds: ["cdl"], labelJa: "CDL (Foundational) 受験可能" },
  { minLevel: 20, certIds: ["ace"], labelJa: "ACE (Associate) 受験可能" },
  { minLevel: 30, certIds: ["pca", "pde", "pcd"], labelJa: "Professional系 受験可能" },
  { minLevel: 35, certIds: ["pmle", "pcne", "pcse"], labelJa: "専門Professional 受験可能" },
  { minLevel: 40, certIds: ["pca", "pde", "pmle", "pcne", "pcse", "pcd"], labelJa: "全資格マスター" },
]

export function getRecommendedCerts(level: number): CertRecommendation {
  const sorted = [...CERT_RECOMMENDATIONS].reverse()
  return sorted.find((r) => level >= r.minLevel) ?? CERT_RECOMMENDATIONS[0]
}
