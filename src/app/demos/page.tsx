"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Server, HardDrive, BarChart3, PlayCircle, Box, Radio, Brain, Zap, Bot,
  ArrowRight, Shield, Network, Key, Building2, FileSearch,
  Globe, Layers, GraduationCap, ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { USE_CASE_SCENARIOS, DEMO_DISPLAY_NAMES } from "@/lib/data/cross-references"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { ARCHITECTURES } from "@/lib/data/architectures"

type ViewMode = "scenarios" | "all"

const DEMO_ICONS: Record<string, React.ElementType> = {
  "gce": Server, "gcs": HardDrive, "bigquery": BarChart3,
  "cloud-run": PlayCircle, "cloud-functions": Zap, "gke": Box,
  "pubsub": Radio, "vertex-ai": Brain, "adk": Bot,
  "iam": Shield, "vpc-firewall": Network, "service-accounts": Key,
  "org-policy": Building2, "audit-logs": FileSearch,
}

const SCENARIO_ICONS: Record<string, React.ElementType> = {
  Globe, BarChart3, Brain, Shield, Box, Building2,
}

const DEMO_COLORS: Record<string, string> = {
  "gce": "#4285F4", "gcs": "#4285F4", "bigquery": "#4285F4",
  "cloud-run": "#34A853", "cloud-functions": "#FBBC05", "gke": "#4285F4",
  "pubsub": "#FBBC05", "vertex-ai": "#4285F4", "adk": "#4285F4",
  "iam": "#EA4335", "vpc-firewall": "#34A853", "service-accounts": "#EA4335",
  "org-policy": "#FBBC05", "audit-logs": "#4285F4",
}

const DEMO_DESCS: Record<string, string> = {
  "gce": "VMインスタンスを作成・管理",
  "gcs": "バケット・ファイル管理",
  "bigquery": "SQLクエリ分析",
  "cloud-run": "コンテナデプロイ",
  "cloud-functions": "サーバーレス関数",
  "gke": "Kubernetesクラスター",
  "pubsub": "メッセージング",
  "vertex-ai": "MLモデル・予測",
  "adk": "AIエージェント構築",
  "iam": "IAMポリシー評価",
  "vpc-firewall": "ファイアウォール設計",
  "service-accounts": "SA・Workload Identity",
  "org-policy": "組織ポリシー",
  "audit-logs": "監査ログ調査",
}

export default function DemosPage() {
  const [view, setView] = useState<ViewMode>("scenarios")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">インタラクティブデモ</h1>
          <p className="text-muted-foreground text-sm mt-1">
            実務シナリオに沿ってGCPサービスを体験。資格学習やアーキテクチャ設計にも直結します。
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1 shrink-0">
          <button
            onClick={() => setView("scenarios")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${view === "scenarios" ? "bg-white dark:bg-[#292a2d] shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            シナリオ別
          </button>
          <button
            onClick={() => setView("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${view === "all" ? "bg-white dark:bg-[#292a2d] shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            全デモ一覧
          </button>
        </div>
      </div>

      {view === "scenarios" ? <ScenarioView /> : <AllDemosView />}
    </div>
  )
}

/* ─── シナリオビュー ─── */
function ScenarioView() {
  return (
    <div className="space-y-5">
      {USE_CASE_SCENARIOS.map((scenario, i) => {
        const Icon = SCENARIO_ICONS[scenario.icon] || Globe
        const relatedCerts = scenario.certIds.map((id) => CERTIFICATIONS.find((c) => c.id === id)).filter(Boolean)
        const relatedArchs = scenario.archIds.map((id) => ARCHITECTURES.find((a) => a.id === id)).filter(Boolean)

        return (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border overflow-hidden" style={{ borderColor: `${scenario.color}25` }}>
              <CardContent className="p-0">
                {/* Scenario header */}
                <div className="px-5 py-4 flex items-start gap-4" style={{ backgroundColor: `${scenario.color}06` }}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: scenario.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-foreground">{scenario.title}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{scenario.description}</p>
                  </div>
                </div>

                {/* Learning path */}
                <div className="px-5 py-4 border-t border-border/50">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    学習パス（推奨順序）
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {scenario.learningPath.map((demoId, j) => {
                      const DemoIcon = DEMO_ICONS[demoId] || PlayCircle
                      const color = DEMO_COLORS[demoId] || "#4285F4"
                      return (
                        <span key={demoId} className="flex items-center gap-2">
                          <Link
                            href={`/demos/${demoId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all bg-white dark:bg-[#1e1f2e]"
                          >
                            <span className="flex items-center justify-center w-5 h-5 rounded shrink-0" style={{ backgroundColor: `${color}15` }}>
                              <DemoIcon size={12} style={{ color }} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-foreground truncate">{DEMO_DISPLAY_NAMES[demoId]}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{DEMO_DESCS[demoId]}</div>
                            </div>
                            <ArrowRight size={12} className="text-muted-foreground shrink-0" />
                          </Link>
                          {j < scenario.learningPath.length - 1 && (
                            <ChevronRight size={14} className="text-muted-foreground/40 shrink-0" />
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Related certs & archs */}
                <div className="px-5 py-3 bg-muted/30 border-t border-border/50 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {relatedCerts.length > 0 && (
                    <div className="flex items-center gap-2">
                      <GraduationCap size={13} className="text-muted-foreground shrink-0" />
                      <span className="text-[10px] text-muted-foreground shrink-0">関連資格:</span>
                      {relatedCerts.map((cert) => (
                        <Link key={cert!.id} href={`/learn/${cert!.id}`} className="text-xs font-medium hover:text-gcp-blue transition-colors flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cert!.color }} />
                          {cert!.shortName}
                        </Link>
                      ))}
                    </div>
                  )}
                  {relatedArchs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Layers size={13} className="text-muted-foreground shrink-0" />
                      <span className="text-[10px] text-muted-foreground shrink-0">アーキテクチャ:</span>
                      {relatedArchs.map((arch) => (
                        <Link key={arch!.id} href={`/architecture/${arch!.id}`} className="text-xs font-medium hover:text-gcp-blue transition-colors">
                          {arch!.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── 全デモ一覧ビュー ─── */
function AllDemosView() {
  const allDemoIds = Object.keys(DEMO_DISPLAY_NAMES)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {allDemoIds.map((id, i) => {
        const Icon = DEMO_ICONS[id] || PlayCircle
        const color = DEMO_COLORS[id] || "#4285F4"
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/demos/${id}`}>
              <Card className="border-border hover:shadow-md transition-all group cursor-pointer h-full" style={{ borderColor: `${color}25` }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-gcp-blue transition-colors truncate">
                        {DEMO_DISPLAY_NAMES[id]}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{DEMO_DESCS[id]}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
