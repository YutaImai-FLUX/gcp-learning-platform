"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  PlayCircle, GraduationCap,
  ArrowRight, Trophy,
  Sword, Target, Layers,
  Sparkles, ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { XPProgressBar } from "@/components/game/XPProgressBar"
import { StreakDisplay } from "@/components/game/StreakDisplay"
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap"
import { CertProgressCards } from "@/components/game/CertProgressCard"
import { useGameStore } from "@/lib/stores/useGameStore"
import { getRecommendedCerts } from "@/lib/game/xp-config"
import { getStudyRecommendations } from "@/lib/game/weakness-detector"
import type { CertificationId } from "@/lib/types/quiz"

// ─── Getting Started steps for new users ───
const GETTING_STARTED = [
  {
    step: 1,
    title: "デモを体験する",
    desc: "GCPサービスを実際に操作して理解を深めよう",
    href: "/demos",
    icon: PlayCircle,
    color: "#4285F4",
  },
  {
    step: 2,
    title: "資格学習を始める",
    desc: "CDLから始めて、段階的にスキルアップ",
    href: "/learn",
    icon: GraduationCap,
    color: "#34A853",
  },
  {
    step: 3,
    title: "ダンジョンに挑戦",
    desc: "RPGバトル形式でクイズに挑戦しよう",
    href: "/dungeon",
    icon: Sword,
    color: "#EA4335",
  },
]

const fadeUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }

// ─── New User View ───
function NewUserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <div className="rounded-2xl gcp-console-bg text-white p-6 md:p-8">
          <div className="flex items-center gap-1.5 mb-3">
            {["bg-gcp-blue","bg-gcp-red","bg-gcp-yellow","bg-gcp-green"].map((c) => (
              <span key={c} className={`w-2 h-2 rounded-full ${c} opacity-80`} />
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1.5">GCP Interactive Learning</h1>
          <p className="text-white/70 text-sm md:text-base">
            Google Cloud の製品を体験・学習できるハンズオン型プラットフォーム
          </p>
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-gcp-yellow" />
          はじめの3ステップ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GETTING_STARTED.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.step}
                href={item.href}
                className="group relative rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full w-5 h-5 flex items-center justify-center">
                        {item.step}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Certification Overview */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap size={18} className="text-gcp-green" />
                資格コース
              </CardTitle>
              <Link href="/learn" className="text-xs text-gcp-blue hover:underline flex items-center gap-1">
                すべて見る <ArrowRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CERTIFICATIONS.slice(0, 8).map((cert) => (
                <Link
                  key={cert.id}
                  href={`/learn/${cert.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: cert.color }}
                  >
                    {cert.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-foreground truncate">{cert.shortName}</div>
                    <div className="text-[10px] text-muted-foreground">{cert.level}</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Returning User: find most recently studied cert ───
function getLastStudiedCert(certProgress: Partial<Record<CertificationId, { lastStudiedAt: number }>>) {
  let latest: { certId: CertificationId; at: number } | null = null
  for (const [certId, cp] of Object.entries(certProgress)) {
    if (cp && (!latest || cp.lastStudiedAt > latest.at)) {
      latest = { certId: certId as CertificationId, at: cp.lastStudiedAt }
    }
  }
  return latest
}

// ─── Returning User View ───
function ReturningUserDashboard() {
  const xp = useGameStore((s) => s.xp)
  const level = useGameStore((s) => s.level)
  const profile = useGameStore((s) => s.profile)
  const certProgress = useGameStore((s) => s.certProgress)
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements)
  const demoCompletions = useGameStore((s) => s.demoCompletions)
  const quizHistory = useGameStore((s) => s.quizHistory)
  const recommendation = getRecommendedCerts(level)

  const lastStudied = getLastStudiedCert(certProgress)
  const lastCert = lastStudied ? CERTIFICATIONS.find((c) => c.id === lastStudied.certId) : null

  // Build personalized recommendations
  const targetCert = profile?.targetCerts?.[0] ?? lastStudied?.certId
  const studyRecs = targetCert ? getStudyRecommendations(quizHistory, targetCert) : []

  return (
    <div className="space-y-5">
      {/* Greeting + Compact Stats Row */}
      <motion.div {...fadeUp} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {profile?.displayName ? `${profile.displayName}さん、` : ""}おかえりなさい
            </h1>
            {recommendation.labelJa && (
              <p className="text-xs text-muted-foreground mt-0.5">{recommendation.labelJa}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <StreakDisplay compact />
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Trophy size={12} className="text-gcp-yellow" />
              {unlockedAchievements.length}/26
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              デモ {Object.keys(demoCompletions).length}/14
            </span>
          </div>
        </div>
      </motion.div>

      {/* XP Bar — full width, compact */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <Card className="border-border">
          <CardContent className="py-4">
            <XPProgressBar />
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Cards: Continue Learning + Daily/Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Continue Learning */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          {lastCert ? (
            <Card className="border-border h-full hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">続きから学習</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/learn/${lastCert.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: lastCert.color }}
                  >
                    {lastCert.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{lastCert.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lastCert.shortName} · {lastCert.level}
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
                {/* Study recommendations */}
                {studyRecs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                    {studyRecs.slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                        {rec}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">学習を始めよう</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/learn"
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gcp-green text-white shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">資格学習センターへ</p>
                    <p className="text-xs text-muted-foreground">CDLから始めるのがおすすめ</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">今日のアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/daily"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gcp-red/10 text-gcp-red shrink-0">
                  <Target size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">デイリーチャレンジ</p>
                  <p className="text-[10px] text-muted-foreground">5問の弱点克服クイズ</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </Link>
              <Link
                href="/dungeon"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gcp-purple/10 text-gcp-purple shrink-0">
                  <Sword size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">ダンジョン冒険</p>
                  <p className="text-[10px] text-muted-foreground">RPGバトルで資格攻略</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </Link>
              <Link
                href="/flashcards"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gcp-blue/10 text-gcp-blue shrink-0">
                  <Layers size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">フラッシュカード</p>
                  <p className="text-[10px] text-muted-foreground">スワイプで用語暗記</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cert Progress + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GraduationCap size={14} className="text-gcp-green" />
                  資格学習の進捗
                </CardTitle>
                <Link href="/roadmap" className="text-[10px] text-gcp-blue hover:underline flex items-center gap-1">
                  ロードマップ <ArrowRight size={10} />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <CertProgressCards />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">学習アクティビティ</CardTitle>
                <span className="text-[10px] text-muted-foreground">
                  累計 {xp.toLocaleString()} XP
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main: Switch based on user state ───
export default function DashboardPage() {
  const xp = useGameStore((s) => s.xp)
  const hasStarted = xp > 0

  return hasStarted ? <ReturningUserDashboard /> : <NewUserDashboard />
}
