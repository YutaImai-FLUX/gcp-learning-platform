import type { QuizAttempt } from "@/lib/stores/types"
import type { CertificationId } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"

export interface WeakDomain {
  certId: CertificationId
  domain: string
  accuracy: number
  total: number
  correct: number
}

/**
 * Detect weak domains across all certs or for a specific cert
 */
export function detectWeakDomains(
  quizHistory: QuizAttempt[],
  certId?: CertificationId,
  threshold: number = 60
): WeakDomain[] {
  const filtered = certId
    ? quizHistory.filter((h) => h.certId === certId)
    : quizHistory

  const domainStats: Record<string, WeakDomain> = {}

  for (const attempt of filtered) {
    const key = `${attempt.certId}:${attempt.domain}`
    if (!domainStats[key]) {
      domainStats[key] = {
        certId: attempt.certId,
        domain: attempt.domain,
        accuracy: 0,
        total: 0,
        correct: 0,
      }
    }
    domainStats[key].total++
    if (attempt.correct) domainStats[key].correct++
  }

  return Object.values(domainStats)
    .map((d) => ({ ...d, accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0 }))
    .filter((d) => d.total >= 3 && d.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy)
}

/**
 * Recommend study actions based on weaknesses
 */
export function getStudyRecommendations(
  quizHistory: QuizAttempt[],
  certId: CertificationId
): string[] {
  const weak = detectWeakDomains(quizHistory, certId)
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return []

  const recommendations: string[] = []

  for (const w of weak.slice(0, 3)) {
    recommendations.push(
      `「${w.domain}」の正答率が${w.accuracy}%です。このドメインの学習モジュールを復習しましょう。`
    )
  }

  if (weak.length === 0 && quizHistory.filter((h) => h.certId === certId).length > 10) {
    recommendations.push("全ドメインの正答率が良好です！模擬試験モードで総合力を確認しましょう。")
  }

  return recommendations
}
