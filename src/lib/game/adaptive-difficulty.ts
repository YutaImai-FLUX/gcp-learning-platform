import type { DifficultyLevel } from "@/lib/types/quiz"
import type { QuizAttempt } from "@/lib/stores/types"

const RECENT_WINDOW = 20

/**
 * Analyze recent quiz attempts and suggest difficulty level.
 * - >80% accuracy → increase difficulty
 * - <50% accuracy → decrease difficulty
 * - Otherwise → stay at current
 */
export function suggestDifficulty(
  history: QuizAttempt[],
  currentDifficulty: DifficultyLevel = "easy"
): DifficultyLevel {
  const recent = history.slice(-RECENT_WINDOW)
  if (recent.length < 5) return currentDifficulty

  const correctCount = recent.filter((a) => a.correct).length
  const accuracy = correctCount / recent.length

  if (accuracy >= 0.8) {
    return currentDifficulty === "easy" ? "medium" : currentDifficulty === "medium" ? "hard" : "hard"
  }
  if (accuracy < 0.5) {
    return currentDifficulty === "hard" ? "medium" : currentDifficulty === "medium" ? "easy" : "easy"
  }

  return currentDifficulty
}

/**
 * Get accuracy stats by domain for a specific cert
 */
export function getDomainAccuracy(
  history: QuizAttempt[],
  certId: string
): Record<string, { correct: number; total: number; accuracy: number }> {
  const certHistory = history.filter((a) => a.certId === certId)
  const domains: Record<string, { correct: number; total: number; accuracy: number }> = {}

  for (const attempt of certHistory) {
    if (!domains[attempt.domain]) {
      domains[attempt.domain] = { correct: 0, total: 0, accuracy: 0 }
    }
    domains[attempt.domain].total++
    if (attempt.correct) {
      domains[attempt.domain].correct++
    }
  }

  for (const domain of Object.keys(domains)) {
    const d = domains[domain]
    d.accuracy = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
  }

  return domains
}

/**
 * Identify weak domains (accuracy < 60%)
 */
export function getWeakDomains(
  history: QuizAttempt[],
  certId: string
): string[] {
  const domainStats = getDomainAccuracy(history, certId)
  return Object.entries(domainStats)
    .filter(([, stats]) => stats.total >= 3 && stats.accuracy < 60)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .map(([domain]) => domain)
}
