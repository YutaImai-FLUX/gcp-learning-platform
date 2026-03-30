"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ArrowRight, Sparkles, BarChart3, Clock, AlertTriangle, Layout } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const FEATURES = [
  { icon: Layout, label: "アーキテクチャ図", description: "React Flow による自動レイアウトの構成図", color: "#4285F4" },
  { icon: BarChart3, label: "コスト見積", description: "サービス別月額/年額の概算見積", color: "#34A853" },
  { icon: Clock, label: "実装スケジュール", description: "フェーズ別のガントチャート", color: "#FBBC05" },
  { icon: AlertTriangle, label: "課題・論点", description: "技術/組織/コスト/セキュリティ観点", color: "#EA4335" },
]

const EXAMPLES = [
  { industry: "小売EC", req: "Webアプリ + リアルタイム分析", arch: "3層Web + BigQuery" },
  { industry: "金融", req: "マイクロサービス + セキュリティ", arch: "GKE + Cloud Armor" },
  { industry: "スタートアップ", req: "生成AI / RAG", arch: "Gemini + Vector Search" },
  { industry: "製造業", req: "IoT + ML予測", arch: "Pub/Sub + Vertex AI" },
]

export default function ProposalPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gcp-blue/10 mb-4">
          <FileText size={28} className="text-gcp-blue" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">提案シミュレーター</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          クライアントの要件を入力するだけで、最適なGCPアーキテクチャ・コスト見積・実装計画・課題を自動生成します。
        </p>
        <Link href="/proposal/new">
          <Button size="lg" className="mt-6 gap-2">
            <Sparkles size={16} />
            新しい提案を作成
            <ArrowRight size={16} />
          </Button>
        </Link>
      </motion.div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="pt-4 text-center">
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2"
                  style={{ backgroundColor: `${f.color}12` }}
                >
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <div className="text-xs font-semibold">{f.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{f.description}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Example proposals */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-sm font-bold text-foreground mb-4">シミュレーション例</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="w-2 h-8 rounded-full bg-gcp-blue/20" />
                <div className="text-xs">
                  <div className="font-medium">{ex.industry}：{ex.req}</div>
                  <div className="text-muted-foreground mt-0.5">→ {ex.arch}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
