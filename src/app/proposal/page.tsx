"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ArrowRight, Sparkles, BarChart3, Clock, AlertTriangle, Layout } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const FEATURES = [
  { icon: Layout, label: "アーキテクチャ図", description: "自動レイアウトの構成図", color: "#4285F4" },
  { icon: BarChart3, label: "コスト見積", description: "月額/年額の概算見積", color: "#34A853" },
  { icon: Clock, label: "実装スケジュール", description: "フェーズ別ガントチャート", color: "#FBBC05" },
  { icon: AlertTriangle, label: "課題・論点", description: "多角的なリスク分析", color: "#EA4335" },
]

const EXAMPLES = [
  { industry: "小売EC", req: "Webアプリ + リアルタイム分析", arch: "3層Web + BigQuery", color: "#4285F4" },
  { industry: "金融", req: "マイクロサービス + セキュリティ", arch: "GKE + Cloud Armor", color: "#EA4335" },
  { industry: "スタートアップ", req: "生成AI / RAG", arch: "Gemini + Vector Search", color: "#34A853" },
  { industry: "製造業", req: "IoT + ML予測", arch: "Pub/Sub + Vertex AI", color: "#FBBC05" },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function ProposalPage() {
  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Hero */}
      <motion.div variants={stagger.item} className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
          <FileText size={28} className="text-primary" />
        </div>
        <h1 className="font-display heading-display text-3xl md:text-4xl text-foreground">提案シミュレーター</h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">
          クライアントの要件を入力するだけで、最適なGCPアーキテクチャ・コスト見積・実装計画・課題を自動生成します。
        </p>
        <Link href="/proposal/new">
          <Button size="lg" className="mt-8 gap-2">
            <Sparkles size={16} />
            新しい提案を作成
            <ArrowRight size={16} />
          </Button>
        </Link>
      </motion.div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FEATURES.map((f) => (
          <motion.div key={f.label} variants={stagger.item}>
            <Card className="h-full border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-5 text-center">
                <div
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3"
                  style={{ backgroundColor: `${f.color}12` }}
                >
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <div className="font-display text-sm font-semibold text-foreground">{f.label}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{f.description}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Example proposals */}
      <motion.div variants={stagger.item}>
        <Card className="border-border">
          <CardContent className="pt-6">
            <h2 className="font-display text-sm font-bold text-foreground mb-4">シミュレーション例</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EXAMPLES.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: ex.color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium text-foreground">{ex.industry}：{ex.req}</div>
                    <div className="text-muted-foreground mt-0.5">→ {ex.arch}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
