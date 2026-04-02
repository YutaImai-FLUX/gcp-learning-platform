"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ListChecks, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { QUIZ_QUESTIONS } from "@/lib/data/quiz-questions"
import { useGameStore } from "@/lib/stores/useGameStore"

export default function QuestionsIndexPage() {
  const quizHistory = useGameStore((s) => s.quizHistory)

  const certStats = useMemo(() => {
    return CERTIFICATIONS.map((cert) => {
      const totalQuestions = QUIZ_QUESTIONS.filter((q) => q.certId === cert.id).length
      if (totalQuestions === 0) return null

      const certHistory = quizHistory.filter((h) => h.certId === cert.id)
      const answeredIds = new Set(certHistory.map((h) => h.questionId))
      const answeredCount = answeredIds.size
      const totalAttempts = certHistory.length
      const correctAttempts = certHistory.filter((h) => h.correct).length
      const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

      return { cert, totalQuestions, answeredCount, totalAttempts, accuracy }
    }).filter(Boolean)
  }, [quizHistory])

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ListChecks size={22} className="text-gcp-blue" />
          問題一覧
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          資格別の全問題と回答履歴・傾向分析
        </p>
      </motion.div>

      <div className="space-y-3">
        {certStats.map((item) => {
          if (!item) return null
          const { cert, totalQuestions, answeredCount, totalAttempts, accuracy } = item
          const coverageRate = Math.round((answeredCount / totalQuestions) * 100)

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href={`/learn/${cert.id}/questions`}>
                <Card className="border-border hover:border-current/30 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: cert.color }}
                      >
                        {cert.shortName.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-foreground">{cert.shortName}</h3>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">{cert.name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground">{totalQuestions}問</span>
                          <span className="text-xs text-muted-foreground">回答済: {answeredCount}/{totalQuestions}</span>
                          {totalAttempts > 0 && (
                            <span className={`text-xs font-bold ${accuracy >= 70 ? "text-green-600" : accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                              正答率 {accuracy}%
                            </span>
                          )}
                        </div>
                        <Progress value={coverageRate} className="h-1 mt-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {certStats.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          問題データがありません
        </div>
      )}
    </div>
  )
}
