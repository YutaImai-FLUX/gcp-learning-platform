"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sword, Layers, ListChecks, ArrowRight } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import { getQuestionsByCert } from "@/lib/data/quiz-questions"
import { getFlashCardsByCert } from "@/lib/data/flashcards"
import { getDungeonMap } from "@/lib/game/dungeon-config"
import type { CertificationId } from "@/lib/types/quiz"

interface CertStudyActionsProps {
  certId: CertificationId
  certColor: string
}

export function CertStudyActions({ certId, certColor }: CertStudyActionsProps) {
  const quizHistory = useGameStore((s) => s.quizHistory)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const srCards = useGameStore((s) => s.srCards)

  const stats = useMemo(() => {
    // Dungeon progress
    const dungeon = getDungeonMap(certId)
    const totalRooms = dungeon.rooms.length
    const clearedRooms = dungeon.rooms.filter(
      (r) => dungeonProgress[r.id]?.cleared
    ).length

    // Flashcard progress
    const flashcards = getFlashCardsByCert(certId)
    const totalCards = flashcards.length
    const reviewedCards = flashcards.filter((c) => srCards[c.id]).length

    // Question progress
    const allQuestions = getQuestionsByCert(certId)
    const totalQuestions = allQuestions.length
    const certHistory = quizHistory.filter((h) => h.certId === certId)
    const answeredIds = new Set(certHistory.map((h) => h.questionId))
    const answeredCount = answeredIds.size
    const correctCount = certHistory.filter((h) => h.correct).length
    const accuracy = certHistory.length > 0
      ? Math.round((correctCount / certHistory.length) * 100)
      : 0

    return {
      dungeon: { cleared: clearedRooms, total: totalRooms },
      flashcards: { reviewed: reviewedCards, total: totalCards },
      questions: { answered: answeredCount, total: totalQuestions, accuracy },
    }
  }, [certId, quizHistory, dungeonProgress, srCards])

  const actions = [
    {
      label: "ダンジョン冒険",
      description: "RPGバトルで攻略",
      href: `/dungeon/${certId}`,
      icon: Sword,
      progress: stats.dungeon.total > 0
        ? `${stats.dungeon.cleared}/${stats.dungeon.total} クリア`
        : null,
      progressValue: stats.dungeon.total > 0
        ? (stats.dungeon.cleared / stats.dungeon.total) * 100
        : 0,
    },
    {
      label: "フラッシュカード",
      description: "スワイプで用語暗記",
      href: `/flashcards/${certId}`,
      icon: Layers,
      progress: stats.flashcards.total > 0
        ? `${stats.flashcards.reviewed}/${stats.flashcards.total} 学習済`
        : null,
      progressValue: stats.flashcards.total > 0
        ? (stats.flashcards.reviewed / stats.flashcards.total) * 100
        : 0,
    },
    {
      label: "問題一覧",
      description: "全問題と回答履歴",
      href: `/learn/${certId}/questions`,
      icon: ListChecks,
      progress: stats.questions.total > 0
        ? `${stats.questions.answered}/${stats.questions.total} 回答済${stats.questions.accuracy > 0 ? ` (${stats.questions.accuracy}%)` : ""}`
        : null,
      progressValue: stats.questions.total > 0
        ? (stats.questions.answered / stats.questions.total) * 100
        : 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={action.href}>
              <div className="group relative rounded-xl border border-border bg-card p-4 hover:border-current/30 transition-all cursor-pointer overflow-hidden">
                {/* Progress bar background */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 transition-all"
                  style={{
                    width: `${action.progressValue}%`,
                    backgroundColor: certColor,
                    opacity: 0.6,
                  }}
                />

                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${certColor}18` }}
                  >
                    <Icon size={18} style={{ color: certColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground">{action.label}</h3>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
                    {action.progress && (
                      <p className="text-[10px] font-medium mt-1.5" style={{ color: certColor }}>
                        {action.progress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
