"use client"

import { create } from "zustand"
import type { QuizSession, QuizResult, QuizQuestion } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"

interface QuizStore {
  session: QuizSession | null
  result: QuizResult | null
  startSession: (session: QuizSession) => void
  answerQuestion: (questionIndex: number, answerIndex: number) => void
  nextQuestion: () => void
  finishSession: () => void
  resetSession: () => void
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  session: null,
  result: null,

  startSession: (session) => set({ session, result: null }),

  answerQuestion: (questionIndex, answerIndex) => {
    const { session } = get()
    if (!session) return
    const answers = [...session.answers]
    answers[questionIndex] = answerIndex
    set({ session: { ...session, answers } })
  },

  nextQuestion: () => {
    const { session } = get()
    if (!session) return
    set({
      session: {
        ...session,
        currentIndex: Math.min(session.currentIndex + 1, session.questions.length - 1),
      },
    })
  },

  finishSession: () => {
    const { session } = get()
    if (!session) return

    const endTime = Date.now()
    const cert = CERTIFICATIONS.find((c) => c.id === session.certId)

    let correct = 0
    const domainScores: Record<string, { correct: number; total: number }> = {}
    const wrongQuestions: QuizQuestion[] = []

    session.questions.forEach((q, i) => {
      const domain = q.domain
      if (!domainScores[domain]) domainScores[domain] = { correct: 0, total: 0 }
      domainScores[domain].total++

      if (session.answers[i] === q.correctIndex) {
        correct++
        domainScores[domain].correct++
      } else {
        wrongQuestions.push(q)
      }
    })

    const score = Math.round((correct / session.questions.length) * 100)
    const passingScore = cert?.passingScore ?? 70

    const result: QuizResult = {
      certId: session.certId,
      totalQuestions: session.questions.length,
      correctAnswers: correct,
      score,
      passed: score >= passingScore,
      timeTakenSeconds: Math.round((endTime - session.startTime) / 1000),
      domainScores,
      wrongQuestions,
    }

    set({
      session: { ...session, endTime, completed: true },
      result,
    })
  },

  resetSession: () => set({ session: null, result: null }),
}))
