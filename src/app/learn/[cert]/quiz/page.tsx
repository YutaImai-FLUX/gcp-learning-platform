"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Award, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { getCertById } from "@/lib/data/certifications"
import { getQuestionsByCert, shuffleQuestions } from "@/lib/data/quiz-questions"
import type { QuizQuestion } from "@/lib/types/quiz"

function QuizContent() {
  const { cert: certId } = useParams<{ cert: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = (searchParams.get("mode") ?? "practice") as "practice" | "exam"

  const cert = getCertById(certId)
  const allQuestions = useMemo(() => getQuestionsByCert(certId), [certId])

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const shuffled = shuffleQuestions(allQuestions)
    const count = mode === "exam" ? Math.min(allQuestions.length, 10) : Math.min(allQuestions.length, 5)
    const selected = shuffled.slice(0, count)
    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(null))
  }, [certId, mode, allQuestions])

  useEffect(() => {
    if (completed) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [completed])

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
    if (isAnswered && mode === "exam") return
    if (isAnswered && mode === "practice") return
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
    if (mode === "practice") setShowExplanation(true)
  }

  function goNext() {
    setShowExplanation(false)
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
    questions.forEach((q, i) => {
      const d = q.domain
      if (!domainMap[d]) domainMap[d] = { correct: 0, total: 0 }
      domainMap[d].total++
      if (answers[i] === q.correctIndex) domainMap[d].correct++
    })

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
        {/* Score card */}
        <div
          className={`rounded-2xl p-6 text-white text-center ${passed ? "bg-gradient-to-br from-green-500 to-green-700" : "bg-gradient-to-br from-red-500 to-red-700"}`}
        >
          <div className="text-5xl font-bold mb-2">{score}%</div>
          <div className="text-xl font-semibold mb-1">
            {passed ? "🎉 合格！" : "不合格"}
          </div>
          <div className="text-white/80 text-sm">
            {correct}/{questions.length} 正解 · {Math.floor(timeTaken/60)}分{timeTaken%60}秒
          </div>
          <div className="mt-3 text-sm text-white/70">
            合格ライン: {cert.passingScore}%
          </div>
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
        {questions.filter((q, i) => answers[i] !== q.correctIndex).length > 0 && (
          <Card className="border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-red-500">間違えた問題</h3>
              {questions.filter((q, i) => answers[i] !== q.correctIndex).map((q) => (
                <div key={q.id} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 text-sm space-y-2">
                  <p className="font-medium text-foreground">{q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1.5 rounded text-xs ${
                          i === q.correctIndex
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {i === q.correctIndex && "✓ "}{opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">{q.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
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
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/learn/${certId}`)} className="h-8 text-xs">
            <ArrowLeft size={14} className="mr-1" />終了
          </Button>
          <Badge variant="secondary" className="text-xs">
            {mode === "exam" ? "模擬試験" : "練習モード"}
          </Badge>
          <Badge style={{ backgroundColor: cert.bgColor, color: cert.color }} className="text-xs border-0">
            {cert.shortName}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-muted-foreground" />
          <span className="font-mono text-muted-foreground">
            {Math.floor(seconds / 60).toString().padStart(2, "0")}:{(seconds % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

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

              {/* Explanation (practice mode) */}
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
                      {isCorrect ? "✓ 正解！" : "解説"}
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
          {mode === "practice" && current === questions.length - 1 && isAnswered && (
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
