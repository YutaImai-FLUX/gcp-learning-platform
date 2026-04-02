"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Target, Brain, Clock, TrendingUp, Award, BookOpen, Layers, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/stores/useGameStore"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { getDomainAccuracy, getWeakDomains } from "@/lib/game/adaptive-difficulty"
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap"
import type { CertificationId } from "@/lib/types/quiz"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

function CertAnalytics({ certId }: { certId: CertificationId }) {
  const quizHistory = useGameStore((s) => s.quizHistory)

  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return null

  const certHistory = quizHistory.filter((h) => h.certId === certId)
  if (certHistory.length === 0) return null

  const domainAccuracy = getDomainAccuracy(quizHistory, certId)
  const weakDomains = getWeakDomains(quizHistory, certId)
  const overallCorrect = certHistory.filter((h) => h.correct).length
  const overallAccuracy = Math.round((overallCorrect / certHistory.length) * 100)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
            style={{ backgroundColor: cert.color }}
          >
            {cert.shortName.slice(0, 3)}
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm">{cert.shortName}</CardTitle>
            <p className="text-[10px] text-muted-foreground">{certHistory.length}問回答</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: overallAccuracy >= 70 ? "#4CAF50" : overallAccuracy >= 50 ? "#FF9800" : "#F44336" }}>
              {overallAccuracy}%
            </div>
            <div className="text-[10px] text-muted-foreground">正答率</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Domain breakdown */}
        {Object.entries(domainAccuracy).map(([domain, stats]) => (
          <div key={domain} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate flex-1 pr-2">{domain}</span>
              <span className="font-medium shrink-0">
                {stats.correct}/{stats.total} ({stats.accuracy}%)
              </span>
            </div>
            <Progress
              value={stats.accuracy}
              className="h-1.5"
              style={{ "--progress-color": stats.accuracy >= 70 ? "#4CAF50" : stats.accuracy >= 50 ? "#FF9800" : "#F44336" } as React.CSSProperties}
            />
          </div>
        ))}

        {/* Weak domains */}
        {weakDomains.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-2">
              <Target size={12} />
              <span className="font-medium">弱点ドメイン</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {weakDomains.map((d) => (
                <Badge key={d} variant="outline" className="text-[10px] border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/learn/${certId}/quiz?mode=practice`}
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            練習問題 <ArrowRight size={10} />
          </Link>
          <Link
            href={`/learn/${certId}`}
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            学習ガイド <ArrowRight size={10} />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const quizHistory = useGameStore((s) => s.quizHistory)
  const streaks = useGameStore((s) => s.streaks)
  const certProgress = useGameStore((s) => s.certProgress)

  const stats = useMemo(() => {
    const totalQuestions = quizHistory.length
    const totalCorrect = quizHistory.filter((h) => h.correct).length
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const certsStudied = new Set(quizHistory.map((h) => h.certId)).size
    const modulesCompleted = Object.values(certProgress).reduce(
      (sum, cp) => sum + (cp?.completedModuleSectionIds.length ?? 0), 0
    )
    return { totalQuestions, totalCorrect, overallAccuracy, certsStudied, modulesCompleted }
  }, [quizHistory, certProgress])

  const activeCerts = useMemo(() => {
    const certIds = new Set(quizHistory.map((h) => h.certId))
    return Array.from(certIds) as CertificationId[]
  }, [quizHistory])

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <h1 className="font-display heading-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
          <BarChart3 className="text-gcp-blue" size={28} />
          学習アナリティクス
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          学習の進捗・正答率・弱点を可視化
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={stagger.item}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "総回答数", value: stats.totalQuestions, unit: "問", icon: Brain, color: "text-gcp-blue", bg: "bg-gcp-blue-light" },
            { label: "正答率", value: stats.overallAccuracy, unit: "%", icon: TrendingUp, color: "text-gcp-green", bg: "bg-[#e6f4ea]" },
            { label: "学習資格", value: stats.certsStudied, unit: "種", icon: Award, color: "text-gcp-yellow", bg: "bg-[#fef7e0]" },
            { label: "連続学習", value: streaks.currentStreak, unit: "日", icon: Clock, color: "text-gcp-red", bg: "bg-[#fce8e6]" },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md ${s.bg}`}>
                    <Icon size={14} className={s.color} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm">学習アクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap />
          </CardContent>
        </Card>
      </motion.div>

      {/* Per-cert analytics */}
      {activeCerts.length > 0 && (
        <motion.div variants={stagger.item} className="space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen size={18} className="text-gcp-green" />
            資格別分析
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeCerts.map((certId) => (
              <CertAnalytics key={certId} certId={certId} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {activeCerts.length === 0 && (
        <motion.div variants={stagger.item}>
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Layers size={40} className="mx-auto text-muted-foreground mb-3" />
              <h3 className="font-bold text-foreground mb-1">まだデータがありません</h3>
              <p className="text-sm text-muted-foreground mb-4">
                クイズや練習問題に挑戦して、分析データを蓄積しましょう
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                学習を始める <ArrowRight size={14} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
