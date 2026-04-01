"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  GraduationCap,
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
    color: "#4285F4",
  },
  {
    step: 2,
    title: "資格学習を始める",
    desc: "CDLから始めて、段階的にスキルアップ",
    href: "/learn",
    color: "#34A853",
  },
  {
    step: 3,
    title: "ダンジョンに挑戦",
    desc: "RPGバトル形式でクイズに挑戦しよう",
    href: "/dungeon",
    color: "#EA4335",
  },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } },
}

// ─── New User View ───
function NewUserDashboard() {
  return (
    <motion.div
      className="space-y-8"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Hero */}
      <motion.div variants={stagger.item}>
        <div className="relative rounded-2xl overflow-hidden gcp-console-bg text-white px-6 py-10 md:px-10 md:py-14">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-1.5 mb-4">
              {["bg-gcp-blue", "bg-gcp-red", "bg-gcp-yellow", "bg-gcp-green"].map((c) => (
                <span key={c} className={`w-2 h-2 rounded-full ${c}`} />
              ))}
            </div>
            <h1 className="font-display heading-display text-3xl md:text-4xl lg:text-5xl mb-3">
              GCP Interactive Learning
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
              Google Cloud の製品を体験・学習できるハンズオン型プラットフォーム
            </p>
          </div>
        </div>
      </motion.div>

      {/* Getting Started — asymmetric: first item large, rest small */}
      <motion.div variants={stagger.item}>
        <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-gcp-yellow" />
          はじめの3ステップ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {GETTING_STARTED.map((item, idx) => {
            const isFirst = idx === 0
            return (
              <Link
                key={item.step}
                href={item.href}
                className={`
                  group relative rounded-xl border border-border bg-card overflow-hidden
                  hover:border-primary/40 hover:shadow-lg transition-all duration-300
                  ${isFirst ? "md:col-span-3 p-6" : "md:col-span-1 p-5"}
                `}
              >
                {/* Step number — large accent circle */}
                <div
                  className={`
                    flex items-center justify-center rounded-full font-display font-black text-white mb-4
                    ${isFirst ? "w-12 h-12 text-lg" : "w-10 h-10 text-sm"}
                  `}
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-display font-bold text-foreground mb-1.5 ${isFirst ? "text-lg" : "text-sm"}`}>
                      {item.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${isFirst ? "text-sm" : "text-xs"}`}>
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={isFirst ? 20 : 16}
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 mt-1"
                  />
                </div>

                {/* Subtle color accent on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${item.color}06, transparent 60%)` }}
                />
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Certification Overview */}
      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <GraduationCap size={18} className="text-gcp-green" />
                資格コース
              </CardTitle>
              <Link href="/learn" className="text-xs text-primary hover:underline flex items-center gap-1">
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
    </motion.div>
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

  const targetCert = profile?.targetCerts?.[0] ?? lastStudied?.certId
  const studyRecs = targetCert ? getStudyRecommendations(quizHistory, targetCert) : []

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Greeting + Stats Row */}
      <motion.div variants={stagger.item}>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <h1 className="font-display heading-display text-2xl md:text-3xl text-foreground">
              {profile?.displayName ? `${profile.displayName}さん、` : ""}おかえりなさい
            </h1>
            {recommendation.labelJa && (
              <p className="text-sm text-muted-foreground mt-1">{recommendation.labelJa}</p>
            )}
          </div>
          <div className="flex items-center gap-5">
            <StreakDisplay compact />
            <Badge variant="secondary" className="flex items-center gap-1.5 text-xs px-3 py-1">
              <Trophy size={13} className="text-gcp-yellow" />
              {unlockedAchievements.length}/26
            </Badge>
            <span className="text-xs text-muted-foreground">
              デモ {Object.keys(demoCompletions).length}/14
            </span>
          </div>
        </div>
      </motion.div>

      {/* XP Bar */}
      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardContent className="py-4">
            <XPProgressBar />
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Cards: Continue + Quick Actions — asymmetric */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Continue Learning — wider */}
        <motion.div variants={stagger.item} className="lg:col-span-3">
          {lastCert ? (
            <Card className="border-border h-full hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">続きから学習</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/learn/${lastCert.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white font-display text-base font-bold shrink-0"
                    style={{ backgroundColor: lastCert.color }}
                  >
                    {lastCert.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {lastCert.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lastCert.shortName} · {lastCert.level}
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
                {studyRecs.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border space-y-1.5">
                    {studyRecs.slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-xs text-muted-foreground leading-relaxed">
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gcp-green text-white shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      資格学習センターへ
                    </p>
                    <p className="text-xs text-muted-foreground">CDLから始めるのがおすすめ</p>
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-all shrink-0" />
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions — narrower */}
        <motion.div variants={stagger.item} className="lg:col-span-2">
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">今日のアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[
                { href: "/daily", icon: Target, iconBg: "bg-gcp-red/10", iconColor: "text-gcp-red", title: "デイリーチャレンジ", desc: "5問の弱点克服クイズ" },
                { href: "/dungeon", icon: Sword, iconBg: "bg-gcp-purple/10", iconColor: "text-gcp-purple", title: "ダンジョン冒険", desc: "RPGバトルで資格攻略" },
                { href: "/flashcards", icon: Layers, iconBg: "bg-gcp-blue/10", iconColor: "text-gcp-blue", title: "フラッシュカード", desc: "スワイプで用語暗記" },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.iconBg} ${action.iconColor} shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{action.title}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cert Progress + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={stagger.item}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-sm flex items-center gap-2">
                  <GraduationCap size={14} className="text-gcp-green" />
                  資格学習の進捗
                </CardTitle>
                <Link href="/roadmap" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                  ロードマップ <ArrowRight size={10} />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <CertProgressCards />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={stagger.item}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-sm">学習アクティビティ</CardTitle>
                <span className="font-display text-lg font-bold text-foreground">
                  {xp.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">XP</span>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main: Switch based on user state ───
export default function DashboardPage() {
  const xp = useGameStore((s) => s.xp)
  const hasStarted = xp > 0

  return hasStarted ? <ReturningUserDashboard /> : <NewUserDashboard />
}
