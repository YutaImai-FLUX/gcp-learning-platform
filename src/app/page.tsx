"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Package, PlayCircle, GraduationCap,
  Server, BarChart3, Brain, Bot, ArrowRight, Award, Code2, Building2,
  Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GCP_PRODUCTS } from "@/lib/data/products"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { XPProgressBar } from "@/components/game/XPProgressBar"
import { StreakDisplay } from "@/components/game/StreakDisplay"
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap"
import { CertProgressCards } from "@/components/game/CertProgressCard"
import { useGameStore } from "@/lib/stores/useGameStore"
import { getRecommendedCerts } from "@/lib/game/xp-config"

const QUICK_DEMOS = [
  { name: "Compute Engine", desc: "VM作成シミュレーター", href: "/demos/gce", icon: Server, color: "#4285F4" },
  { name: "BigQuery", desc: "SQLエディタ & クエリ実行", href: "/demos/bigquery", icon: BarChart3, color: "#4285F4" },
  { name: "Vertex AI", desc: "MLモデル管理", href: "/demos/vertex-ai", icon: Brain, color: "#4285F4" },
  { name: "Cloud Run", desc: "コンテナデプロイ体験", href: "/demos/cloud-run", icon: PlayCircle, color: "#34A853" },
  { name: "ADK (AI Agents)", desc: "マルチエージェント体験", href: "/demos/adk", icon: Bot, color: "#4285F4" },
]

const CERT_ICONS: Record<string, React.ElementType> = {
  cdl: Award, ace: Code2, pca: Building2, pde: BarChart3, pmle: Brain,
}

export default function DashboardPage() {
  const level = useGameStore((s) => s.level)
  const xp = useGameStore((s) => s.xp)
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements)
  const demoCompletions = useGameStore((s) => s.demoCompletions)
  const recommendation = getRecommendedCerts(level)

  const hasStarted = xp > 0

  return (
    <div className="space-y-6">
      {/* Hero with XP */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl gcp-console-bg text-white p-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {["bg-gcp-blue","bg-gcp-red","bg-gcp-yellow","bg-gcp-green"].map((c) => (
              <span key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-80`} />
            ))}
          </div>
          <span className="text-white/60 text-xs font-medium">Google Cloud Platform</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">GCP Interactive Learning</h1>
        <p className="text-white/80 text-lg mb-6">
          Google Cloud の製品を体験・学習できるハンズオン型インタラクティブプラットフォーム
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/demos"
            className="inline-flex items-center gap-2 bg-white text-gcp-blue-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors text-sm"
          >
            <PlayCircle size={18} />
            デモを試す
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            <GraduationCap size={18} />
            資格学習を始める
          </Link>
        </div>
      </motion.div>

      {/* XP, Streak, Achievements row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">経験値 & レベル</CardTitle>
            </CardHeader>
            <CardContent>
              <XPProgressBar />
              {recommendation.labelJa && (
                <p className="text-[10px] text-gcp-green mt-2 font-medium">{recommendation.labelJa}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">学習ストリーク</CardTitle>
            </CardHeader>
            <CardContent>
              <StreakDisplay />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy size={14} className="text-gcp-yellow" />
                実績
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</span>
                <span className="text-xs text-muted-foreground">/ 26 解除済み</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-muted-foreground">デモ体験:</span>
                <span className="text-xs font-medium text-foreground">{Object.keys(demoCompletions).length} / 14</span>
              </div>
              {!hasStarted && (
                <p className="text-[10px] text-muted-foreground">学習を開始して実績を解除しよう</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cert Progress & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap size={14} className="text-gcp-green" />
                資格学習の進捗
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CertProgressCards />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">学習アクティビティ (6ヶ月)</CardTitle>
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

      {/* Quick Demos & Certs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <PlayCircle size={18} className="text-gcp-green" />
                おすすめデモ
              </CardTitle>
              <Link href="/demos" className="text-xs text-gcp-blue hover:underline flex items-center gap-1">
                すべて見る <ArrowRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_DEMOS.map((demo) => {
              const Icon = demo.icon
              const completed = demo.href.split("/demos/")[1] in demoCompletions
              return (
                <Link
                  key={demo.href}
                  href={demo.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: demo.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground">{demo.name}</div>
                    <div className="text-xs text-muted-foreground">{demo.desc}</div>
                  </div>
                  {completed && (
                    <Badge className="bg-gcp-green/10 text-gcp-green border-0 text-[10px]">体験済み</Badge>
                  )}
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap size={18} className="text-gcp-yellow" />
                資格コース
              </CardTitle>
              <Link href="/learn" className="text-xs text-gcp-blue hover:underline flex items-center gap-1">
                すべて見る <ArrowRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {CERTIFICATIONS.slice(0, 5).map((cert) => {
              const Icon = CERT_ICONS[cert.id] ?? Award
              return (
                <Link
                  key={cert.id}
                  href={`/learn/${cert.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cert.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground">{cert.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cert.durationMinutes}分 · {cert.questionCount}問 · 合格{cert.passingScore}%
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs shrink-0"
                    style={{ backgroundColor: cert.bgColor, color: cert.color }}
                  >
                    {cert.level}
                  </Badge>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package size={18} className="text-gcp-blue" />
              主要GCP製品 (デモあり)
            </CardTitle>
            <Link href="/products" className="text-xs text-gcp-blue hover:underline flex items-center gap-1">
              全製品を見る <ArrowRight size={12} />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GCP_PRODUCTS.filter((p) => p.hasDemo).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="p-3 rounded-lg border border-border hover:border-gcp-blue/40 hover:bg-gcp-blue-light/30 dark:hover:bg-gcp-blue/10 transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: product.color }}
                >
                  {product.name.charAt(0)}
                </div>
                <div className="font-medium text-xs text-foreground group-hover:text-gcp-blue transition-colors leading-tight">
                  {product.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{product.category}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
