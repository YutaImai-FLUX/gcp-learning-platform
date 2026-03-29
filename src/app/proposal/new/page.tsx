"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowRight, ChevronRight, Check, Sparkles, Loader2,
  Globe, Server, Database, HardDrive, Shield, Key, Play, Box,
  Lock, Radio, Zap, Search, Code2, Brain, Cpu, BarChart3,
  Layers, GitBranch, Activity, Users, Bell, Network, Cable,
  Building2, Monitor, Flame, Package, LineChart,
  ShoppingCart, Heart, Factory, Film, GraduationCap, Rocket,
  Gamepad2, Cloud, Wifi, Clock, Landmark,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"
import ArchDiagram from "@/components/architecture/ArchDiagram"
import { generateProposal } from "@/lib/proposal/engine"
import { REQUIREMENTS_META, INDUSTRY_META, SCALE_META, BUDGET_META } from "@/lib/proposal/requirements-meta"
import type {
  ProposalInput, Industry, ProjectScale, Requirement, GeneratedProposal,
} from "@/lib/types/proposal"
import type { LucideIcon } from "lucide-react"

/* ─── Icon maps ─── */
const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Server, Database, HardDrive, Shield, Key, Play, Box,
  Lock, Radio, Zap, Search, Code2, Brain, Cpu, BarChart3,
  Layers, GitBranch, Activity, Users, Bell, Network, Cable,
  Building2, Monitor, Flame, Package, LineChart,
  ShoppingCart, Heart, Factory, Film, GraduationCap, Rocket,
  Gamepad2, Cloud, Wifi, Clock, Landmark, Sparkles,
  Smartphone: Monitor, Boxes: Box,
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: "#4285F4",
  organizational: "#FBBC05",
  cost: "#34A853",
  security: "#EA4335",
}
const CATEGORY_LABELS: Record<string, string> = {
  technical: "技術的課題",
  organizational: "組織的課題",
  cost: "コスト課題",
  security: "セキュリティ課題",
}

const COST_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#5f6368", "#9C27B0", "#FF5722", "#00BCD4", "#795548", "#607D8B"]

/* ─── Steps ─── */
type Step = 1 | 2 | 3

export default function ProposalNewPage() {
  const [step, setStep] = useState<Step>(1)
  const [generating, setGenerating] = useState(false)
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null)
  const [resultTab, setResultTab] = useState<"summary" | "arch" | "cost" | "timeline" | "challenges">("summary")

  const [input, setInput] = useState<ProposalInput>({
    clientName: "",
    industry: "retail",
    scale: "medium",
    requirements: [],
    budgetRange: "medium",
    existingInfra: "",
  })

  const toggleReq = (r: Requirement) => {
    setInput((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(r)
        ? prev.requirements.filter((x) => x !== r)
        : [...prev.requirements, r],
    }))
  }

  const canProceed = step === 1
    ? input.clientName.trim().length > 0
    : step === 2
      ? input.requirements.length > 0
      : true

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const result = generateProposal(input)
      setProposal(result)
      setGenerating(false)
    }, 1500)
  }

  /* ── Generating overlay ── */
  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Loader2 size={48} className="text-gcp-blue" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">提案書を生成しています...</h2>
          <p className="text-sm text-muted-foreground mt-1">
            アーキテクチャ設計・コスト見積・スケジュール策定中
          </p>
        </div>
      </div>
    )
  }

  /* ── Result view ── */
  if (proposal) {
    return <ProposalResult proposal={proposal} resultTab={resultTab} setResultTab={setResultTab} />
  }

  /* ── Wizard ── */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/proposal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        提案シミュレーターへ戻る
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s < step
                  ? "bg-gcp-blue text-white"
                  : s === step
                    ? "bg-gcp-blue/10 text-gcp-blue border-2 border-gcp-blue"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-gcp-blue" : "bg-muted"}`} />}
          </div>
        ))}
        <span className="ml-3 text-sm text-muted-foreground">
          {step === 1 ? "クライアント情報" : step === 2 ? "要件選択" : "確認・生成"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">クライアント名</CardTitle></CardHeader>
                <CardContent>
                  <Input
                    placeholder="例: 株式会社サンプル"
                    value={input.clientName}
                    onChange={(e) => setInput((p) => ({ ...p, clientName: e.target.value }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">業種</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(INDUSTRY_META) as [Industry, typeof INDUSTRY_META[Industry]][]).map(([key, meta]) => {
                      const Ic = ICON_MAP[meta.icon] || Box
                      const selected = input.industry === key
                      return (
                        <button
                          key={key}
                          onClick={() => setInput((p) => ({ ...p, industry: key }))}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                            selected
                              ? "border-gcp-blue bg-gcp-blue/5 text-gcp-blue font-medium"
                              : "border-border hover:border-gcp-blue/30 text-foreground"
                          }`}
                        >
                          <Ic size={16} />
                          {meta.label}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">プロジェクト規模</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(SCALE_META) as [ProjectScale, typeof SCALE_META[ProjectScale]][]).map(([key, meta]) => {
                      const selected = input.scale === key
                      return (
                        <button
                          key={key}
                          onClick={() => setInput((p) => ({ ...p, scale: key }))}
                          className={`text-left px-4 py-3 rounded-lg border transition-all ${
                            selected
                              ? "border-gcp-blue bg-gcp-blue/5"
                              : "border-border hover:border-gcp-blue/30"
                          }`}
                        >
                          <div className={`text-sm font-medium ${selected ? "text-gcp-blue" : "text-foreground"}`}>
                            {meta.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{meta.users}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{meta.description}</div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    必要な要件を選択（複数選択可）
                    <Badge variant="secondary" className="ml-2">{input.requirements.length}件選択中</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(Object.entries(REQUIREMENTS_META) as [Requirement, typeof REQUIREMENTS_META[Requirement]][]).map(([key, meta]) => {
                      const Ic = ICON_MAP[meta.icon] || Box
                      const selected = input.requirements.includes(key)
                      return (
                        <button
                          key={key}
                          onClick={() => toggleReq(key)}
                          className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-left transition-all ${
                            selected
                              ? "border-gcp-blue bg-gcp-blue/5"
                              : "border-border hover:border-gcp-blue/30"
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                            selected ? "bg-gcp-blue text-white" : "bg-muted"
                          }`}>
                            {selected ? <Check size={12} /> : <Ic size={12} className="text-muted-foreground" />}
                          </div>
                          <div>
                            <div className={`text-xs font-medium ${selected ? "text-gcp-blue" : "text-foreground"}`}>
                              {meta.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-tight">{meta.description}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">予算レンジ</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(BUDGET_META) as [string, typeof BUDGET_META[string]][]).map(([key, meta]) => {
                      const selected = input.budgetRange === key
                      return (
                        <button
                          key={key}
                          onClick={() => setInput((p) => ({ ...p, budgetRange: key as "low" | "medium" | "high" }))}
                          className={`text-center px-4 py-3 rounded-lg border transition-all ${
                            selected
                              ? "border-gcp-blue bg-gcp-blue/5"
                              : "border-border hover:border-gcp-blue/30"
                          }`}
                        >
                          <div className={`text-sm font-medium ${selected ? "text-gcp-blue" : "text-foreground"}`}>
                            {meta.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{meta.range}</div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">既存インフラ（任意）</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="例: AWS EC2 + RDSで運用中、オンプレミスのVMware基盤あり、など"
                    value={input.existingInfra}
                    onChange={(e) => setInput((p) => ({ ...p, existingInfra: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Confirmation summary */}
              <Card className="bg-muted/30">
                <CardHeader><CardTitle className="text-sm">入力内容の確認</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">クライアント</span>
                    <span className="font-medium">{input.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">業種</span>
                    <span className="font-medium">{INDUSTRY_META[input.industry].label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">規模</span>
                    <span className="font-medium">{SCALE_META[input.scale].label} ({SCALE_META[input.scale].users})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">要件</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {input.requirements.map((r) => (
                        <Badge key={r} variant="secondary" className="text-[10px]">
                          {REQUIREMENTS_META[r].label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setStep((s) => (s > 1 ? (s - 1) as Step : s))}
          disabled={step === 1}
        >
          <ArrowLeft size={14} className="mr-1" />
          戻る
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => (s < 3 ? (s + 1) as Step : s))}
            disabled={!canProceed}
          >
            次へ
            <ArrowRight size={14} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={!canProceed}>
            <Sparkles size={14} className="mr-1" />
            提案書を生成
          </Button>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Proposal Result View
   ═══════════════════════════════════════════════ */

function ProposalResult({
  proposal,
  resultTab,
  setResultTab,
}: {
  proposal: GeneratedProposal
  resultTab: string
  setResultTab: (t: "summary" | "arch" | "cost" | "timeline" | "challenges") => void
}) {
  const tabs = [
    { key: "summary", label: "概要" },
    { key: "arch", label: "アーキテクチャ" },
    { key: "cost", label: "コスト見積" },
    { key: "timeline", label: "実装スケジュール" },
    { key: "challenges", label: "課題・論点" },
  ] as const

  const costPieData = useMemo(() =>
    proposal.costBreakdown.services
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .map((s) => ({ name: s.name, value: s.monthlyCost })),
    [proposal.costBreakdown.services]
  )

  const costBarData = useMemo(() =>
    proposal.costBreakdown.services
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .map((s) => ({ name: s.name.replace(/Cloud |Google /, ""), cost: s.monthlyCost })),
    [proposal.costBreakdown.services]
  )

  const cumulativeWeeks = useMemo(() => {
    let acc = 0
    return proposal.timeline.map((p) => {
      const start = acc
      acc += p.durationWeeks
      return { ...p, startWeek: start, endWeek: acc }
    })
  }, [proposal.timeline])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        href="/proposal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        提案シミュレーターへ戻る
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{proposal.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{proposal.summary}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="推奨サービス数" value={`${proposal.recommendedServices.length}`} sub="GCPサービス" color="#4285F4" />
        <KpiCard label="月額コスト概算" value={`$${proposal.costBreakdown.totalMonthlyCost.toLocaleString()}`} sub="/月" color="#34A853" />
        <KpiCard label="実装期間" value={`${proposal.totalDurationWeeks}週間`} sub={`${proposal.timeline.length}フェーズ`} color="#FBBC05" />
        <KpiCard label="検討課題" value={`${proposal.challenges.length}件`} sub="要対応" color="#EA4335" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setResultTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              resultTab === t.key
                ? "border-gcp-blue text-gcp-blue"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={resultTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {resultTab === "summary" && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">推奨GCPサービス</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proposal.recommendedServices.map((svc) => (
                      <div key={svc.productId} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-gcp-blue" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{svc.name}</span>
                            <Badge variant="secondary" className="text-[10px]">{svc.role}</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">${svc.estimatedMonthlyCost.toLocaleString()}/月</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{svc.reason}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Tier: {svc.tier}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {resultTab === "arch" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">提案アーキテクチャ図</CardTitle>
              </CardHeader>
              <CardContent>
                <ArchDiagram architecture={proposal.architecture} />
                {proposal.architecture.layers.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {proposal.architecture.layers.map((layer) => (
                      <div key={layer.id} className="flex items-center gap-1.5 text-xs">
                        <div
                          className="w-4 h-3 rounded border-2 border-dashed"
                          style={{ borderColor: `${layer.color}50`, backgroundColor: `${layer.color}10` }}
                        />
                        <span className="text-muted-foreground font-medium">{layer.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {resultTab === "cost" && (
            <div className="space-y-4">
              {/* Cost summary cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gcp-blue">${proposal.costBreakdown.totalMonthlyCost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">月額概算</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gcp-red">${proposal.costBreakdown.annualCost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">年額概算</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gcp-green">${proposal.costBreakdown.cudAnnualCost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">CUD適用後年額</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar chart */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">サービス別月額コスト</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={costBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis type="number" tickFormatter={(v: number) => `$${v}`} fontSize={10} />
                        <YAxis type="category" dataKey="name" width={90} fontSize={10} />
                        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "月額"]} />
                        <Bar dataKey="cost" fill="#4285F4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie chart */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">コスト構成比</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={costPieData}
                          cx="50%" cy="50%"
                          outerRadius={100}
                          innerRadius={50}
                          dataKey="value"
                          label={(props) => {
                            const name = String(props.name ?? "")
                            const percent = Number(props.percent ?? 0)
                            return `${name.replace(/Cloud |Google /, "")} ${(percent * 100).toFixed(0)}%`
                          }}
                          labelLine={false}
                          fontSize={9}
                        >
                          {costPieData.map((_, i) => (
                            <Cell key={i} fill={COST_COLORS[i % COST_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "月額"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gcp-green/5 border-gcp-green/20">
                <CardContent className="pt-4">
                  <p className="text-sm text-gcp-green font-medium">{proposal.costBreakdown.discountNote}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">※ 概算見積もりです。実際の料金はGCP料金計算ツールでご確認ください。</p>
                </CardContent>
              </Card>
            </div>
          )}

          {resultTab === "timeline" && (
            <div className="space-y-4">
              {/* Gantt-like chart */}
              <Card>
                <CardHeader><CardTitle className="text-sm">実装タイムライン（全{proposal.totalDurationWeeks}週間）</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cumulativeWeeks.map((phase, i) => {
                      const pct = (phase.durationWeeks / proposal.totalDurationWeeks) * 100
                      const offsetPct = (phase.startWeek / proposal.totalDurationWeeks) * 100
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{phase.phase}</span>
                            <span className="text-[10px] text-muted-foreground">{phase.durationWeeks}週間</span>
                          </div>
                          <div className="h-7 bg-muted rounded-lg relative overflow-hidden">
                            <motion.div
                              className="absolute h-full rounded-lg flex items-center px-2"
                              style={{
                                left: `${offsetPct}%`,
                                backgroundColor: COST_COLORS[i % COST_COLORS.length],
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.15, duration: 0.5 }}
                            >
                              <span className="text-[9px] text-white font-medium truncate whitespace-nowrap">
                                W{phase.startWeek + 1}–W{phase.endWeek}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex gap-2 mt-4 text-[10px] text-muted-foreground">
                    {Array.from({ length: Math.ceil(proposal.totalDurationWeeks / 4) + 1 }, (_, i) => (
                      <span key={i} className="flex-1 text-center border-l border-border first:border-0 pl-1">
                        {i * 4 === 0 ? "開始" : `${i * 4}W`}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Phase details */}
              <div className="space-y-3">
                {proposal.timeline.map((phase, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COST_COLORS[i % COST_COLORS.length] }}
                        />
                        <span className="text-sm font-semibold">{phase.phase}</span>
                        <Badge variant="secondary" className="text-[10px] ml-auto">{phase.durationWeeks}週間</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 ml-5">
                        {phase.tasks.map((task, j) => (
                          <div key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ChevronRight size={10} className="text-gcp-blue shrink-0" />
                            {task}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {resultTab === "challenges" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposal.challenges.map((c, i) => {
                const color = CATEGORY_COLORS[c.category] || "#5f6368"
                return (
                  <Card key={i} style={{ borderLeft: `4px solid ${color}` }}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="text-[10px]"
                          style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
                        >
                          {CATEGORY_LABELS[c.category]}
                        </Badge>
                        <span className="text-sm font-semibold">{c.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <div className="text-[10px] font-bold text-gcp-green mb-0.5">対策・緩和策</div>
                        <p className="text-xs text-foreground/80 leading-relaxed">{c.mitigation}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── KPI Card ─── */
function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <Card>
      <CardContent className="pt-4 text-center">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-xl font-bold" style={{ color }}>{value}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  )
}
