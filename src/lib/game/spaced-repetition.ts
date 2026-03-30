/**
 * SM-2 Spaced Repetition Algorithm
 * Adapted for quiz question review scheduling
 */

export interface SRCard {
  questionId: string
  easeFactor: number  // starts at 2.5
  interval: number    // days until next review
  repetitions: number
  nextReview: string  // ISO date "YYYY-MM-DD"
  lastReview: string
}

const MIN_EASE_FACTOR = 1.3
const INITIAL_EASE_FACTOR = 2.5

/**
 * Quality ratings (0-5):
 * 5 - Perfect response
 * 4 - Correct with hesitation
 * 3 - Correct with difficulty
 * 2 - Incorrect, easy recall after seeing answer
 * 1 - Incorrect, remembered after seeing answer
 * 0 - Complete blackout
 */
export function sm2Update(card: SRCard, quality: number, today: string): SRCard {
  const q = Math.max(0, Math.min(5, quality))

  let { easeFactor, interval, repetitions } = card

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Incorrect response — reset
    repetitions = 0
    interval = 1
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor)

  // Calculate next review date
  const nextDate = new Date(today)
  nextDate.setDate(nextDate.getDate() + interval)
  const nextReview = nextDate.toISOString().slice(0, 10)

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReview: today,
  }
}

export function createSRCard(questionId: string, today: string): SRCard {
  return {
    questionId,
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReview: today,
    lastReview: today,
  }
}

export function isDueForReview(card: SRCard, today: string): boolean {
  return card.nextReview <= today
}

export function qualityFromCorrectness(correct: boolean, responseTimeMs: number): number {
  if (!correct) return 1
  if (responseTimeMs < 5000) return 5   // fast & correct
  if (responseTimeMs < 10000) return 4  // correct with some thought
  return 3                               // correct but slow
}
