"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Zap, Trophy, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGameStore } from "@/lib/stores/useGameStore"
import { QUIZ_QUESTIONS, shuffleOptions } from "@/lib/data/quiz-questions"
import { detectWeakDomains } from "@/lib/game/weakness-detector"

const DAILY_COUNT = 5

function buildDailyQuestions() {
  const quizHistory = useGameStore.getState().quizHistory
  const weakDomains = detectWeakDomains(quizHistory)
  const weakDomainNames = new Set(weakDomains.map((w) => `${w.certId}:${w.domain}`))

  const weakQ = QUIZ_QUESTIONS.filter((q) => weakDomainNames.has(`${q.certId}:${q.domain}`))
  const otherQ = QUIZ_QUESTIONS.filter((q) => !weakDomainNames.has(`${q.certId}:${q.domain}`))

  const shuffledWeak = [...weakQ].sort(() => Math.random() - 0.5)
  const shuffledOther = [...otherQ].sort(() => Math.random() - 0.5)

  return shuffleOptions([...shuffledWeak, ...shuffledOther].slice(0, DAILY_COUNT))
}

export default function DailyChallengePage() {
  const addXP = useGameStore((s) => s.addXP)
  const addQuizAttempt = useGameStore((s) => s.addQuizAttempt)

  // Build once on mount — useState lazy init prevents re-shuffle on re-render
  const [questions, setQuestions] = useState(buildDailyQuestions)

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(DAILY_COUNT).fill(null))
  const [completed, setCompleted] = useState(false)

  const q = questions[current]
  const isAnswered = answers[current] !== null
  const isCorrect = isAnswered && answers[current] === q?.correctIndex

  const handleAnswer = useCallback((idx: number) => {
    if (isAnswered || !q) return
    const next = [...answers]
    next[current] = idx
    setAnswers(next)

    const correct = idx === q.correctIndex
    addQuizAttempt({
      certId: q.certId,
      questionId: q.id,
      correct,
      difficulty: q.difficulty,
      domain: q.domain,
    })

    if (correct) {
      addXP(10, "daily")
    }
  }, [isAnswered, q, current, answers, addQuizAttempt, addXP])

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setCompleted(true)
      addXP(20, "daily-bonus")
    } else {
      setCurrent(current + 1)
    }
  }

  const handleRestart = () => {
    setQuestions(buildDailyQuestions())
    setCurrent(0)
    setAnswers(new Array(DAILY_COUNT).fill(null))
    setCompleted(false)
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        問題が見つかりません。まず資格学習で問題を解いてみましょう。
      </div>
    )
  }

  if (completed) {
    const correctCount = answers.filter((a, i) => a === questions[i]?.correctIndex).length
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-gradient-to-br from-gcp-blue to-gcp-green p-8 text-white text-center"
        >
          <Trophy size={40} className="mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">デイリーチャレンジ完了！</h2>
          <p className="text-white/80 text-sm">
            {correctCount}/{DAILY_COUNT} 正解 · +{correctCount * 10 + 20} XP
          </p>
        </motion.div>
        <div className="flex justify-center">
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw size={14} className="mr-1.5" /> もう一度
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold flex items-center gap-2 mb-1">
          <Zap size={22} className="text-gcp-yellow" />
          デイリーチャレンジ
        </h1>
        <p className="text-sm text-muted-foreground">1日5分、弱点重点の5問</p>
      </motion.div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{current + 1} / {DAILY_COUNT}</span>
          <span>{answers.filter((a) => a !== null).length} 回答済</span>
        </div>
        <Progress value={((current + (isAnswered ? 1 : 0)) / DAILY_COUNT) * 100} className="h-2" />
      </div>

      {/* Question */}
      {q && (
        <Card className="border-border">
          <CardContent className="p-5 space-y-4">
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{q.certId.toUpperCase()}</span>
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{q.difficulty}</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let cls = "border border-border hover:bg-muted cursor-pointer"
                if (isAnswered) {
                  if (i === q.correctIndex) cls = "border-green-400 bg-green-50 dark:bg-green-950/30"
                  else if (i === answers[current]) cls = "border-red-400 bg-red-50 dark:bg-red-950/30"
                  else cls = "border-border opacity-50"
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all ${cls}`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-xs ${isCorrect ? "bg-green-50 dark:bg-green-950/30" : "bg-blue-50 dark:bg-blue-950/30"}`}
              >
                <p className={`font-bold mb-1 ${isCorrect ? "text-green-600" : "text-blue-600"}`}>
                  {isCorrect ? "正解！ +10 XP" : "解説"}
                </p>
                <p className="text-muted-foreground">{q.explanation}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next */}
      {isAnswered && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="bg-gcp-blue text-white">
            {current + 1 >= DAILY_COUNT ? "結果を見る" : "次へ"}
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
