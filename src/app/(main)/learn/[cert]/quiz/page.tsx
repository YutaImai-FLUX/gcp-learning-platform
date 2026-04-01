"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Award, BarChart3, Filter, Zap, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { getCertById } from "@/lib/data/certifications"
import { getQuestionsByCert, shuffleQuestions } from "@/lib/data/quiz-questions"
import type { QuizQuestion } from "@/lib/types/quiz"
import { DomainFilter } from "@/components/quiz/DomainFilter"
import { TimerBar } from "@/components/quiz/TimerBar"
import { useGameStore } from "@/lib/stores/useGameStore"
import { suggestDifficulty } from "@/lib/game/adaptive-difficulty"

const TIMER_SECONDS_PER_QUESTION = 60

function QuizContent() {
  const { cert: certId } = useParams<{ cert: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = (searchParams.get("mode") ?? "practice") as "practice" | "exam" | "review" | "timed"
  const domainParam = searchParams.get("domain")

  const cert = getCertById(certId)
  const allQuestions = useMemo(() => getQuestionsByCert(certId), [certId])
  const quizHistory = useGameStore((s) => s.quizHistory)

  // Adaptive difficulty
  const suggestedDifficulty = useMemo(
    () => suggestDifficulty(quizHistory.filter((h) => h.certId === certId)),
    [quizHistory, certId]
  )

  const domains = useMemo(() => {
    const set = new Set(allQuestions.map((q) => q.domain))
    return Array.from(set)
  }, [allQuestions])

  const [selectedDomain, setSelectedDomain] = useState<string | null>(domainParam)
  const [showDomainFilter, setShowDomainFilter] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [startTime] = useState(Date.now())
  const [timerRunning, setTimerRunning] = useState(mode === "timed")

  // Initialize questions
  useEffect(() => {
    let filtered = allQuestions

    // Domain filter
    if (selectedDomain) {
      filtered = filtered.filter((q) => q.domain === selectedDomain)
    }

    // Difficulty filter for adaptive mode
    if (mode === "review") {
      // Review mode: focus on questions the user got wrong before
      const wrongIds = new Set(
        quizHistory.filter((h) => h.certId === certId && !h.correct).map((h) => h.questionId)
      )
      const reviewQ = filtered.filter((q) => wrongIds.has(q.id))
      if (reviewQ.length >= 3) {
        filtered = reviewQ
      }
    }

    const shuffled = shuffleQuestions(filtered)
    const count = mode === "exam" ? Math.min(filtered.length, 10) : Math.min(filtered.length, 5)
    const selected = shuffled.slice(0, count)
    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(null))
    setCurrent(0)
    setCompleted(false)
    setShowExplanation(false)
  }, [certId, mode, allQuestions, selectedDomain, quizHistory])

  useEffect(() => {
    if (completed || mode === "timed") return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [completed, mode])

  const handleTimeUp = useCallback(() => {
    // Auto-advance on time up
    if (answers[current] === null) {
      const next = [...answers]
      next[current] = -1 // timeout marker
      setAnswers(next)
    }
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
      setTimerRunning(true)
    } else {
      setCompleted(true)
    }
  }, [current, answers, questions.length])

  if (!cert || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">問題を読み込み中...</p>
      </div>
    )
  }

  const q = questions[current]
  const userAnswer = answers[current]
  const isAnswered = userAnswer !== null
  const isCorrect = isAnswered && userAnswer === q.correctIndex
  const progress = ((current + (isAnswered ? 1 : 0)) / questions.length) * 100

  function answer(idx: number) {
    if (isAnswered) return
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
    if (mode === "practice" || mode === "review") setShowExplanation(true)
    if (mode === "timed") setTimerRunning(false)
  }

  function goNext() {
    setShowExplanation(false)
    setTimerRunning(mode === "timed")
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      setCompleted(true)
    }
  }

  function goPrev() {
    if (current > 0) {
      setCurrent(current - 1)
      setShowExplanation(false)
    }
  }

  function finishExam() {
    setCompleted(true)
  }

  // Results
  if (completed) {
    const correct = answers.filter((a, i) => a === questions[i].correctIndex).length
    const score = Math.round((correct / questions.length) * 100)
    const passed = score >= (cert.passingScore)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)

    const domainMap: Record<string, { correct: number; total: number }> = {}
    questions.forEach((qq, i) => {
      const d = qq.domain
      if (!domainMap[d]) domainMap[d] = { correct: 0, total: 0 }
      domainMap[d].total++
      if (answers[i] === qq.correctIndex) domainMap[d].correct++
    })

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
        {/* Score card */}
        <div
          className={`rounded-2xl p-6 text-white text-center ${passed ? "bg-gradient-to-br from-green-500 to-green-700" : "bg-gradient-to-br from-red-500 to-red-700"}`}
        >
          <div className="text-5xl font-bold mb-2">{score}%</div>
          <div className="text-xl font-semibold mb-1">
            {passed ? "合格！" : "不合格"}
          </div>
          <div className="text-white/80 text-sm">
            {correct}/{questions.length} 正解 · {Math.floor(timeTaken/60)}分{timeTaken%60}秒
          </div>
          <div className="mt-3 text-sm text-white/70">
            合格ライン: {cert.passingScore}%
          </div>
          {mode === "review" && (
            <div className="mt-2 text-xs text-white/60">復習モード</div>
          )}
        </div>

        {/* Adaptive difficulty suggestion */}
        <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-2 text-xs">
          <Zap size={14} className="text-gcp-yellow" />
          <span className="text-muted-foreground">
            推奨難易度: <span className="font-bold text-foreground">{suggestedDifficulty}</span>
            （直近の正答率に基づく）
          </span>
        </div>

        {/* Domain breakdown */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <BarChart3 size={15} style={{ color: cert.color }} />
              ドメイン別スコア
            </h3>
            {Object.entries(domainMap).map(([domain, stat]) => {
              const pct = Math.round((stat.correct / stat.total) * 100)
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate flex-1 pr-2">{domain}</span>
                    <span className="font-medium shrink-0">{stat.correct}/{stat.total} ({pct}%)</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Wrong questions review */}
        {questions.filter((qq, i) => answers[i] !== qq.correctIndex).length > 0 && (
          <Card className="border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-red-500">間違えた問題</h3>
              {questions.filter((qq, i) => answers[i] !== qq.correctIndex).map((qq) => (
                <div key={qq.id} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 text-sm space-y-2">
                  <p className="font-medium text-foreground">{qq.question}</p>
                  <div className="space-y-1">
                    {qq.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1.5 rounded text-xs ${
                          i === qq.correctIndex
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {i === qq.correctIndex && "✓ "}{opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">{qq.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.push(`/learn/${certId}`)}>
            <ArrowLeft size={15} className="mr-1.5" />学習ページへ戻る
          </Button>
          <Button
            onClick={() => {
              setCompleted(false)
              setCurrent(0)
              setAnswers(new Array(questions.length).fill(null))
              setShowExplanation(false)
              const shuffled = shuffleQuestions(allQuestions)
              setQuestions(shuffled.slice(0, questions.length))
            }}
            style={{ backgroundColor: cert.color }}
            className="text-white"
          >
            もう一度挑戦
          </Button>
          <Link href={`/learn/${certId}/quiz?mode=review`}>
            <Button variant="outline" className="text-xs">
              復習モードで再挑戦
            </Button>
          </Link>
          <Link href={`/flashcards/${certId}`}>
            <Button variant="outline" className="text-xs">
              <Layers size={13} className="mr-1" />フラッシュカード
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  const modeLabel = mode === "exam" ? "模擬試験" : mode === "review" ? "復習モード" : mode === "timed" ? "タイマーモード" : "練習モード"

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/learn/${certId}`)} className="h-8 text-xs">
            <ArrowLeft size={14} className="mr-1" />終了
          </Button>
          <Badge variant="secondary" className="text-xs">{modeLabel}</Badge>
          <Badge style={{ backgroundColor: cert.bgColor, color: cert.color }} className="text-xs border-0">
            {cert.shortName}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDomainFilter(!showDomainFilter)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="ドメインフィルタ"
          >
            <Filter size={14} className={selectedDomain ? "text-gcp-blue" : "text-muted-foreground"} />
          </button>
          {mode !== "timed" && (
            <div className="flex items-center gap-1 text-sm">
              <Clock size={14} className="text-muted-foreground" />
              <span className="font-mono text-muted-foreground">
                {Math.floor(seconds / 60).toString().padStart(2, "0")}:{(seconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Domain filter */}
      {showDomainFilter && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <DomainFilter
            domains={domains}
            selected={selectedDomain}
            onSelect={(d) => {
              setSelectedDomain(d)
              setShowDomainFilter(false)
            }}
            color={cert.color}
          />
        </motion.div>
      )}

      {/* Timer bar for timed mode */}
      {mode === "timed" && (
        <TimerBar
          durationSeconds={TIMER_SECONDS_PER_QUESTION}
          isRunning={timerRunning && !isAnswered}
          onTimeUp={handleTimeUp}
          color={cert.color}
        />
      )}

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>問題 {current + 1} / {questions.length}</span>
          <span>{answers.filter((a) => a !== null).length} 回答済</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: cert.color }}
                >
                  {current + 1}
                </span>
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                    <Badge variant="secondary" className="text-xs truncate max-w-xs">{q.domain}</Badge>
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{q.question}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  let cls = "border border-border bg-muted/20 hover:bg-muted cursor-pointer"
                  if (isAnswered) {
                    if (i === q.correctIndex) {
                      cls = "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                    } else if (i === userAnswer && userAnswer !== q.correctIndex) {
                      cls = "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                    } else {
                      cls = "border-border bg-muted/10 opacity-60 cursor-default"
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={isAnswered}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${cls}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-bold text-xs shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                        {isAnswered && i === q.correctIndex && (
                          <CheckCircle size={16} className="ml-auto text-green-500 shrink-0" />
                        )}
                        {isAnswered && i === userAnswer && i !== q.correctIndex && (
                          <XCircle size={16} className="ml-auto text-red-500 shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`p-4 rounded-xl text-sm ${
                      isCorrect
                        ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                        : "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    <p className={`font-semibold mb-1 ${isCorrect ? "text-green-700 dark:text-green-300" : "text-blue-700 dark:text-blue-300"}`}>
                      {isCorrect ? "正解！" : "解説"}
                    </p>
                    <p className="text-foreground leading-relaxed">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goPrev} disabled={current === 0} size="sm">
          <ArrowLeft size={14} className="mr-1" />前の問題
        </Button>

        <div className="flex gap-2">
          {mode === "exam" && !completed && answers.every((a) => a !== null) && (
            <Button onClick={finishExam} style={{ backgroundColor: cert.color }} className="text-white" size="sm">
              <Award size={14} className="mr-1.5" />採点する
            </Button>
          )}
          {(isAnswered || mode === "exam") && current < questions.length - 1 && (
            <Button onClick={goNext} style={{ backgroundColor: cert.color }} className="text-white" size="sm">
              次の問題 <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
          {(mode === "practice" || mode === "review" || mode === "timed") && current === questions.length - 1 && isAnswered && (
            <Button onClick={finishExam} style={{ backgroundColor: cert.color }} className="text-white" size="sm">
              <Award size={14} className="mr-1.5" />結果を見る
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <QuizContent />
    </Suspense>
  )
}
