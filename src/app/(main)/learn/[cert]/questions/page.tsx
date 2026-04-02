"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Minus,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  ListChecks,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCertById } from "@/lib/data/certifications"
import { getQuestionsByCert } from "@/lib/data/quiz-questions"
import { useGameStore } from "@/lib/stores/useGameStore"
import type { CertificationId, DifficultyLevel } from "@/lib/types/quiz"

type SortKey = "id" | "domain" | "difficulty" | "accuracy" | "attempts"
type SortDir = "asc" | "desc"

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: "text-green-600 bg-green-50 dark:bg-green-950/30",
  medium: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
  hard: "text-red-600 bg-red-50 dark:bg-red-950/30",
}

export default function QuestionsListPage() {
  const params = useParams()
  const certId = params.cert as CertificationId
  const cert = getCertById(certId)
  const allQuestions = useMemo(() => getQuestionsByCert(certId), [certId])
  const quizHistory = useGameStore((s) => s.quizHistory)

  const [domainFilter, setDomainFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "correct" | "wrong" | "unanswered">("all")
  const [sortKey, setSortKey] = useState<SortKey>("domain")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const domains = useMemo(() => {
    const set = new Set(allQuestions.map((q) => q.domain))
    return Array.from(set).sort()
  }, [allQuestions])

  // Build per-question stats from history
  const questionStats = useMemo(() => {
    const certHistory = quizHistory.filter((h) => h.certId === certId)
    const statsMap: Record<string, { attempts: number; correct: number; lastAttempts: boolean[] }> = {}

    for (const h of certHistory) {
      if (!statsMap[h.questionId]) {
        statsMap[h.questionId] = { attempts: 0, correct: 0, lastAttempts: [] }
      }
      const s = statsMap[h.questionId]
      s.attempts++
      if (h.correct) s.correct++
      s.lastAttempts.push(h.correct)
      // Keep only last 10 attempts for trend
      if (s.lastAttempts.length > 10) s.lastAttempts.shift()
    }
    return statsMap
  }, [quizHistory, certId])

  // Domain-level stats
  const domainStats = useMemo(() => {
    const stats: Record<string, { total: number; attempted: number; correct: number; wrong: number }> = {}
    for (const q of allQuestions) {
      if (!stats[q.domain]) stats[q.domain] = { total: 0, attempted: 0, correct: 0, wrong: 0 }
      stats[q.domain].total++
      const qs = questionStats[q.id]
      if (qs) {
        stats[q.domain].attempted++
        if (qs.correct > 0) stats[q.domain].correct++
        if (qs.attempts > qs.correct) stats[q.domain].wrong++
      }
    }
    return stats
  }, [allQuestions, questionStats])

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = allQuestions

    if (domainFilter) {
      filtered = filtered.filter((q) => q.domain === domainFilter)
    }
    if (difficultyFilter) {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter)
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => {
        const s = questionStats[q.id]
        if (statusFilter === "unanswered") return !s
        if (statusFilter === "correct") return s && s.correct > 0
        if (statusFilter === "wrong") return s && s.attempts > s.correct
        return true
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      const sa = questionStats[a.id]
      const sb = questionStats[b.id]
      let cmp = 0

      switch (sortKey) {
        case "id":
          cmp = a.id.localeCompare(b.id)
          break
        case "domain":
          cmp = a.domain.localeCompare(b.domain) || a.id.localeCompare(b.id)
          break
        case "difficulty": {
          const order: Record<string, number> = { easy: 0, medium: 1, hard: 2 }
          cmp = (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0)
          break
        }
        case "accuracy": {
          const accA = sa ? (sa.attempts > 0 ? sa.correct / sa.attempts : 0) : -1
          const accB = sb ? (sb.attempts > 0 ? sb.correct / sb.attempts : 0) : -1
          cmp = accA - accB
          break
        }
        case "attempts":
          cmp = (sa?.attempts ?? 0) - (sb?.attempts ?? 0)
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return sorted
  }, [allQuestions, domainFilter, difficultyFilter, statusFilter, sortKey, sortDir, questionStats])

  // Overall stats
  const overallStats = useMemo(() => {
    const attempted = allQuestions.filter((q) => questionStats[q.id]).length
    const totalAttempts = Object.values(questionStats).reduce((sum, s) => sum + s.attempts, 0)
    const totalCorrect = Object.values(questionStats).reduce((sum, s) => sum + s.correct, 0)
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    return { total: allQuestions.length, attempted, totalAttempts, totalCorrect, accuracy }
  }, [allQuestions, questionStats])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function getTrend(lastAttempts: boolean[]): "up" | "down" | "stable" {
    if (lastAttempts.length < 3) return "stable"
    const recent = lastAttempts.slice(-3)
    const earlier = lastAttempts.slice(-6, -3)
    if (earlier.length === 0) return "stable"
    const recentRate = recent.filter(Boolean).length / recent.length
    const earlierRate = earlier.filter(Boolean).length / earlier.length
    if (recentRate - earlierRate > 0.2) return "up"
    if (earlierRate - recentRate > 0.2) return "down"
    return "stable"
  }

  if (!cert) return null

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href={`/learn/${certId}`} className="p-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <ListChecks size={20} style={{ color: cert.color }} />
            問題一覧
          </h1>
          <p className="text-xs text-muted-foreground">{cert.shortName} · {allQuestions.length}問</p>
        </div>
      </motion.div>

      {/* Overall summary */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "総問題数", value: overallStats.total, unit: "問" },
            { label: "回答済", value: overallStats.attempted, unit: `/${overallStats.total}` },
            { label: "総回答回数", value: overallStats.totalAttempts, unit: "回" },
            { label: "正答率", value: overallStats.accuracy, unit: "%" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">{s.label}</div>
              <div className="font-bold text-lg text-foreground">
                {s.value}<span className="text-xs text-muted-foreground ml-0.5">{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Domain breakdown */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 size={15} style={{ color: cert.color }} />
              ドメイン別傾向
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {domains.map((domain) => {
              const ds = domainStats[domain]
              if (!ds) return null
              const accuracy = ds.attempted > 0 ? Math.round((ds.correct / ds.total) * 100) : 0
              const coverageRate = Math.round((ds.attempted / ds.total) * 100)
              return (
                <button
                  key={domain}
                  onClick={() => setDomainFilter(domainFilter === domain ? null : domain)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    domainFilter === domain ? "border-current bg-muted/50" : "border-transparent hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground truncate flex-1 pr-2 font-medium">{domain}</span>
                    <span className="shrink-0 font-bold" style={{ color: accuracy >= 70 ? "#4CAF50" : accuracy >= 50 ? "#FF9800" : ds.attempted === 0 ? undefined : "#F44336" }}>
                      {ds.attempted > 0 ? `${accuracy}%` : "未回答"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Progress value={coverageRate} className="h-1" />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{ds.attempted}/{ds.total}問</span>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-muted-foreground" />
        {/* Status filter */}
        {(["all", "correct", "wrong", "unanswered"] as const).map((s) => {
          const labels: Record<typeof s, string> = { all: "すべて", correct: "正解済", wrong: "間違い有", unanswered: "未回答" }
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-all ${
                statusFilter === s ? "text-white border-transparent" : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
              style={statusFilter === s ? { backgroundColor: cert.color } : undefined}
            >
              {labels[s]}
            </button>
          )
        })}
        <span className="text-[10px] text-muted-foreground ml-2">|</span>
        {/* Difficulty filter */}
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
              difficultyFilter === d ? "text-white border-transparent" : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
            style={difficultyFilter === d ? { backgroundColor: cert.color } : undefined}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Sort controls */}
      <div className="flex gap-2 text-[10px] text-muted-foreground items-center">
        <span>並び替え:</span>
        {([
          { key: "domain" as SortKey, label: "ドメイン" },
          { key: "difficulty" as SortKey, label: "難易度" },
          { key: "accuracy" as SortKey, label: "正答率" },
          { key: "attempts" as SortKey, label: "回答数" },
        ]).map((s) => (
          <button
            key={s.key}
            onClick={() => toggleSort(s.key)}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              sortKey === s.key ? "bg-muted font-bold text-foreground" : "hover:bg-muted/50"
            }`}
          >
            {s.label} {sortKey === s.key && (sortDir === "asc" ? "↑" : "↓")}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">{filteredQuestions.length}問表示中</p>
        {filteredQuestions.map((q) => {
          const stats = questionStats[q.id]
          const accuracy = stats && stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : null
          const trend = stats ? getTrend(stats.lastAttempts) : "stable"
          const isExpanded = expandedId === q.id

          return (
            <motion.div
              key={q.id}
              layout
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full text-left p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {!stats ? (
                    <Minus size={16} className="text-muted-foreground/40" />
                  ) : accuracy !== null && accuracy >= 50 ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                </div>

                {/* Question text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{q.question}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">{q.domain}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="shrink-0 text-right">
                  {stats ? (
                    <div className="flex items-center gap-1.5">
                      {trend === "up" && <TrendingUp size={12} className="text-green-500" />}
                      {trend === "down" && <TrendingDown size={12} className="text-red-500" />}
                      <span className={`text-xs font-bold ${
                        accuracy !== null && accuracy >= 70 ? "text-green-600" : accuracy !== null && accuracy >= 50 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {accuracy}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">({stats.attempts}回)</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">未回答</span>
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-3 pb-3 space-y-2 border-t border-border"
                >
                  <p className="text-sm text-foreground pt-2 leading-relaxed">{q.question}</p>

                  {/* Options */}
                  <div className="space-y-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1.5 rounded text-xs ${
                          i === q.correctIndex
                            ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                        {i === q.correctIndex && " ✓"}
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-2.5 text-xs text-muted-foreground">
                    {q.explanation}
                  </div>

                  {/* Attempt history visualization */}
                  {stats && stats.lastAttempts.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-medium">直近の回答履歴</p>
                      <div className="flex gap-0.5">
                        {stats.lastAttempts.map((correct, i) => (
                          <div
                            key={i}
                            className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${
                              correct
                                ? "bg-green-100 dark:bg-green-900/40 text-green-600"
                                : "bg-red-100 dark:bg-red-900/40 text-red-600"
                            }`}
                          >
                            {correct ? "○" : "×"}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {stats.correct}/{stats.attempts} 正解 ({accuracy}%)
                        {trend === "up" && " · 改善傾向"}
                        {trend === "down" && " · 低下傾向"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          条件に合う問題が見つかりません
        </div>
      )}
    </div>
  )
}
