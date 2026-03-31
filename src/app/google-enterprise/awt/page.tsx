"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Layers,
  Shield,
  Target,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Lock,
  Key,
  KeyRound,
  Zap,
  Code2,
  Wand2,
  GraduationCap,
  BarChart3,
  Bot,
  Lightbulb,
  Cpu,
  Mic,
  PenTool,
  PlugZap,
  Activity,
  Search,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  EXECUTIVE_SUMMARY,
  MARKET_ROI,
  CONTEXT_SILO_PROBLEM,
  ARCHITECTURE_LAYERS,
  DEV_TIERS,
  SECURITY_FEATURES,
  SALES_MOTIONS,
  FOUR_A_FRAMEWORK,
  AWT_QUIZ_QUESTIONS,
  AI_MODEL_FEATURES,
  DATA_INTEGRATIONS,
  PREBUILT_AGENTS,
  BEFORE_AFTER_CASES,
  OBSERVABILITY_FEATURES,
} from "@/lib/data/awt-presales"

/* ─── Tab definitions (consolidated 11 → 6 + quiz) ─── */
type TabId =
  | "overview"
  | "tech"
  | "agents"
  | "impact"
  | "security"
  | "sales"
  | "quiz"

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "概要 & ROI", icon: TrendingUp },
  { id: "tech", label: "技術基盤", icon: Layers },
  { id: "agents", label: "エージェント活用", icon: Bot },
  { id: "impact", label: "導入効果", icon: BarChart3 },
  { id: "security", label: "セキュリティ & 運用", icon: Shield },
  { id: "sales", label: "商談戦略", icon: Target },
  { id: "quiz", label: "理解度チェック", icon: GraduationCap },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
}

export default function AWTPresalesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  return (
    <div className="space-y-0">
      {/* ═══ Hero Section ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative -mx-3 sm:-mx-6 mt-2 mb-8 overflow-hidden rounded-2xl sm:rounded-3xl"
      >
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-[#1e2a4a] to-[#0d2818]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(130,100,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(66,133,244,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,rgba(52,168,83,0.08),transparent_40%)]" />

        <div className="relative px-6 sm:px-8 pt-8 pb-10 sm:pb-12">
          {/* Title block — asymmetric */}
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/10 text-white/70 backdrop-blur-sm border border-white/10 mb-4">
                  NTTデータ様向け
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-3"
              >
                Agentic Workplace
                <br />
                <span className="bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#34d399] bg-clip-text text-transparent">
                  Transformation
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-white/50 max-w-lg leading-relaxed"
              >
                {EXECUTIVE_SUMMARY.tagline}
              </motion.p>
            </div>

            {/* Multiplier formula — floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
              className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4"
            >
              <div className="text-center">
                <Layers size={20} className="text-[#60a5fa] mx-auto mb-1" />
                <div className="text-[10px] text-white/70 font-medium">Workspace</div>
              </div>
              <span className="text-xl font-display font-bold text-white/40">×</span>
              <div className="text-center">
                <Bot size={20} className="text-[#a78bfa] mx-auto mb-1" />
                <div className="text-[10px] text-white/70 font-medium">Gemini Ent.</div>
              </div>
              <span className="text-xl font-display font-bold text-white/40">=</span>
              <div className="text-center">
                <Zap size={20} className="text-[#34d399] mx-auto mb-1" />
                <div className="text-[10px] text-[#34d399] font-semibold">Multiplier</div>
              </div>
            </motion.div>
          </div>

          {/* Hero stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10"
          >
            {[
              { value: "53%", label: "金融幹部がAIエージェント本番導入", color: "#60a5fa" },
              { value: "54%", label: "メディア幹部がエージェント活用", color: "#a78bfa" },
              { value: "3層", label: "統合アーキテクチャ構造", color: "#34d399" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl md:text-3xl font-display font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/40 mt-1 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ Tab Navigation ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg pb-4 pt-2 -mx-2 px-2"
      >
        <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-foreground -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ═══ Tab Content ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="pt-2"
        >
          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "tech" && <TechSection />}
          {activeTab === "agents" && <AgentsSection />}
          {activeTab === "impact" && <ImpactSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "sales" && <SalesSection />}
          {activeTab === "quiz" && <QuizSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   1. OVERVIEW & ROI
   ════════════════════════════════════════════════════════ */
function OverviewSection() {
  return (
    <motion.div
      className="space-y-10"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Key Points — editorial 1-large + 2-small layout */}
      <motion.div variants={stagger.item}>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-4">
          {/* Primary point — large */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#886FBF]/10 to-[#4285F4]/5 border border-[#886FBF]/15 p-6">
            <div className="absolute top-4 right-4 text-[80px] font-display font-bold text-[#886FBF]/5 leading-none select-none">
              01
            </div>
            <Lightbulb size={20} className="text-[#886FBF] mb-3" />
            <h3 className="font-display font-bold text-lg mb-2">
              {EXECUTIVE_SUMMARY.keyPoints[0].label}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {EXECUTIVE_SUMMARY.keyPoints[0].text}
            </p>
          </div>

          {/* Secondary points — stacked */}
          <div className="grid gap-4">
            {EXECUTIVE_SUMMARY.keyPoints.slice(1).map((point, i) => (
              <div
                key={point.label}
                className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border p-5"
              >
                <div className="absolute top-3 right-4 text-[48px] font-display font-bold text-foreground/3 leading-none select-none">
                  {String(i + 2).padStart(2, "0")}
                </div>
                <h4 className="font-semibold text-sm mb-1.5">{point.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Context Silo → Unified — dramatic split */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#886FBF] rounded-full" />
          パラダイムシフト
        </h2>
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
          {/* Before */}
          <div className="bg-gcp-red/3 p-6 border-b md:border-b-0 md:border-r border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gcp-red/10 flex items-center justify-center">
                <X size={12} className="text-gcp-red" />
              </div>
              <span className="text-xs font-semibold text-gcp-red uppercase tracking-wider">
                Before
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2">{CONTEXT_SILO_PROBLEM.before.label}</h3>
            <p className="text-xs text-muted-foreground mb-4">{CONTEXT_SILO_PROBLEM.before.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {CONTEXT_SILO_PROBLEM.before.items.map((item) => (
                <span key={item} className="px-2.5 py-1 rounded-lg text-[11px] bg-gcp-red/8 text-gcp-red/80 border border-gcp-red/10">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {/* After */}
          <div className="bg-gcp-green/3 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gcp-green/10 flex items-center justify-center">
                <Check size={12} className="text-gcp-green" />
              </div>
              <span className="text-xs font-semibold text-gcp-green uppercase tracking-wider">
                After — AWT
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2">{CONTEXT_SILO_PROBLEM.after.label}</h3>
            <p className="text-xs text-muted-foreground mb-4">{CONTEXT_SILO_PROBLEM.after.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {CONTEXT_SILO_PROBLEM.after.items.map((item) => (
                <span key={item} className="px-2.5 py-1 rounded-lg text-[11px] bg-gcp-green/8 text-gcp-green/80 border border-gcp-green/10">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Market ROI — stat cards with large numbers */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-gcp-green rounded-full" />
          実証済みのROI
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {MARKET_ROI.map((roi) => (
            <div
              key={roi.industry}
              className="group relative rounded-2xl border border-border bg-card p-5 hover:border-gcp-green/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="text-[10px]">{roi.industry}</Badge>
                <TrendingUp size={14} className="text-gcp-green opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-display font-bold text-sm text-gcp-green mb-1">{roi.stat}</p>
              <p className="text-xs text-muted-foreground mb-3">{roi.detail}</p>
              <div className="flex flex-wrap gap-1.5">
                {roi.useCases.map((uc) => (
                  <span key={uc} className="px-2 py-0.5 rounded text-[10px] bg-muted/50">{uc}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   2. TECH FOUNDATION (Architecture + Models + Data)
   ════════════════════════════════════════════════════════ */
function TechSection() {
  const categoryIcons: Record<string, React.ElementType> = {
    model: Cpu,
    ux: PenTool,
    personalization: Mic,
  }

  return (
    <motion.div
      className="space-y-10"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* 3-Layer Architecture — visual tower */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#886FBF] rounded-full" />
          統合3レイヤー構造
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          フロントから基盤までをAIが繋ぐアーキテクチャ
        </p>

        <div className="space-y-2">
          {ARCHITECTURE_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="relative rounded-2xl border overflow-hidden"
              style={{ borderColor: `${layer.color}25` }}
            >
              {/* Color accent strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: layer.color }} />

              <div className="pl-6 pr-5 py-4">
                <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start">
                  {/* Label column */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: layer.color }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm" style={{ color: layer.color }}>
                          {layer.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{layer.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content column */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">{layer.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {layer.components.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{
                            backgroundColor: `${layer.color}08`,
                            color: layer.color,
                            border: `1px solid ${layer.color}18`,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {layer.examples.map((ex) => (
                        <span key={ex} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <ArrowRight size={8} style={{ color: layer.color }} />
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection flow */}
        <div className="flex items-center justify-center gap-3 mt-4 py-3">
          {ARCHITECTURE_LAYERS.map((layer, i) => (
            <div key={layer.id} className="flex items-center gap-3">
              <span
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                style={{ backgroundColor: layer.color }}
              >
                {layer.label.replace(" レイヤー", "")}
              </span>
              {i < ARCHITECTURE_LAYERS.length - 1 && (
                <ArrowRight size={14} className="text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Models — horizontal scroll cards */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#E040FB] rounded-full" />
          最新AIモデル & 新UX
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          AWTを駆動するエンジンの詳細
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AI_MODEL_FEATURES.map((feat, i) => {
            const Icon = categoryIcons[feat.category] || Cpu
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-xl border border-border bg-card p-4 hover:border-[#E040FB]/25 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E040FB]/8 flex items-center justify-center">
                    <Icon size={14} className="text-[#E040FB]" />
                  </div>
                  <h4 className="font-semibold text-xs">{feat.name}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Data Integration — numbered steps */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#00BCD4] rounded-full" />
          データ連携と拡張性
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          社内システムを統合しAIに正しいコンテキストを与える仕組み
        </p>

        <div className="space-y-3">
          {DATA_INTEGRATIONS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-display font-bold text-[#00BCD4]">{i + 1}</span>
              </div>
              <div className="flex-1 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <PlugZap size={14} className="text-[#00BCD4]" />
                  <h4 className="font-semibold text-xs">{item.name}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">{item.description}</p>
                <p className="text-[11px] text-foreground/60 bg-muted/30 rounded-lg px-3 py-2">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   3. AGENTS (Democratization + Prebuilt)
   ════════════════════════════════════════════════════════ */
function AgentsSection() {
  const tierConfig: Record<string, { icon: React.ElementType; gradient: string }> = {
    "no-code": { icon: Wand2, gradient: "from-[#4285F4]/8 to-transparent" },
    "low-code": { icon: Layers, gradient: "from-[#FBBC05]/8 to-transparent" },
    "high-code": { icon: Code2, gradient: "from-[#EA4335]/8 to-transparent" },
  }

  return (
    <motion.div
      className="space-y-10"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Dev tiers — progressive reveal */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-gcp-red rounded-full" />
          開発の民主化
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          スキルレベルに応じた3段階のエージェント構築手段
        </p>

        <div className="grid gap-4">
          {DEV_TIERS.map((tier, i) => {
            const config = tierConfig[tier.codeLevel] || tierConfig["no-code"]
            const TierIcon = config.icon
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl border border-border overflow-hidden bg-gradient-to-r ${config.gradient}`}
              >
                <div className="absolute top-4 right-5 text-[56px] font-display font-bold leading-none select-none" style={{ color: `${tier.color}08` }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="p-5 flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${tier.color}12` }}
                  >
                    <TierIcon size={20} style={{ color: tier.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-sm" style={{ color: tier.color }}>{tier.label}</h3>
                      <Badge variant="outline" className="text-[10px]">{tier.target}</Badge>
                    </div>

                    {tier.tools.map((tool) => (
                      <div key={tool.name} className="mb-2">
                        <span className="text-xs font-semibold">{tool.name}</span>
                        <p className="text-[11px] text-muted-foreground">{tool.description}</p>
                      </div>
                    ))}

                    <div className="mt-3 flex items-start gap-2 bg-background/50 rounded-lg px-3 py-2 border border-border/50">
                      <Sparkles size={12} style={{ color: tier.color }} className="shrink-0 mt-0.5" />
                      <p className="text-[11px] text-foreground/70 italic">{tier.example}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Prebuilt Agents — showcase cards */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#FF7043] rounded-full" />
          プリビルド・エージェント
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          導入後すぐにROIを発揮するGoogle製1Pエージェント
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {PREBUILT_AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-[#FF7043]/25 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF7043]/8 flex items-center justify-center mb-3">
                <Search size={16} className="text-[#FF7043]" />
              </div>
              <h4 className="font-display font-semibold text-sm mb-2">{agent.name}</h4>
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">{agent.description}</p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF7043]">
                <Zap size={11} />
                {agent.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   4. IMPACT (Before / After Use Cases)
   ════════════════════════════════════════════════════════ */
function ImpactSection() {
  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#66BB6A] rounded-full" />
          業務別 Before / After
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          各事業部門における具体的な変革イメージ
        </p>
      </motion.div>

      {BEFORE_AFTER_CASES.map((c, i) => (
        <motion.div
          key={c.id}
          variants={stagger.item}
          className="rounded-2xl border border-border overflow-hidden"
        >
          {/* Department header — full-width accent bar */}
          <div className="px-5 py-2.5 flex items-center gap-3" style={{ backgroundColor: `${c.color}08` }}>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: c.color }}
            >
              {i + 1}
            </div>
            <h3 className="font-display font-bold text-sm" style={{ color: c.color }}>
              {c.department}
            </h3>
          </div>

          {/* Split content */}
          <div className="grid md:grid-cols-2">
            <div className="p-5 border-b md:border-b-0 md:border-r border-border">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gcp-red uppercase tracking-wider mb-2">
                <X size={10} />
                Before
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.before}</p>
            </div>
            <div className="p-5 bg-gcp-green/2">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gcp-green uppercase tracking-wider mb-2">
                <Check size={10} />
                After — AWT導入後
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.after}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   5. SECURITY & OPERATIONS
   ════════════════════════════════════════════════════════ */
function SecuritySection() {
  const iconMap: Record<string, React.ElementType> = { ShieldCheck, Lock, Key, KeyRound }

  return (
    <motion.div
      className="space-y-10"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Security features — 2x2 grid with icon emphasis */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-gcp-yellow rounded-full" />
          エンタープライズ・セキュリティ
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          クライアントが最も懸念するセキュリティ要件への回答
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {SECURITY_FEATURES.map((feat, i) => {
            const Icon = iconMap[feat.icon] || Shield
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-gcp-yellow/25 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gcp-yellow/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gcp-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{feat.name}</h4>
                    <p className="text-[11px] text-muted-foreground mb-2">{feat.description}</p>
                    <p className="text-[11px] text-foreground/60">{feat.detail}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Observability — dashboard-like card */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-gcp-blue rounded-full" />
          可観測性（Observability）
        </h2>
        <p className="text-xs text-muted-foreground mb-5 ml-10">
          IT部門が最も気にする「運用・監視」への明確な回答
        </p>

        {OBSERVABILITY_FEATURES.map((obs) => (
          <div key={obs.id} className="rounded-2xl border border-border bg-gradient-to-br from-gcp-blue/3 to-transparent p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-gcp-blue" />
              <h4 className="font-semibold text-sm">{obs.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{obs.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {obs.metrics.map((metric) => (
                <div
                  key={metric}
                  className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2.5"
                >
                  <div className="w-5 h-5 rounded-md bg-gcp-blue/10 flex items-center justify-center">
                    <Activity size={10} className="text-gcp-blue" />
                  </div>
                  <span className="text-[11px] font-medium">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   6. SALES STRATEGY
   ════════════════════════════════════════════════════════ */
function SalesSection() {
  return (
    <motion.div
      className="space-y-10"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Sales Motions */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-gcp-blue rounded-full" />
          提案シナリオ
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {SALES_MOTIONS.map((sm) => (
            <div key={sm.id} className="rounded-2xl border border-border bg-card p-5 hover:border-gcp-blue/25 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-gcp-blue" />
                <h4 className="font-display font-semibold text-sm">{sm.label}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{sm.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4A Framework — horizontal timeline style */}
      <motion.div variants={stagger.item}>
        <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-[#886FBF] rounded-full" />
          4Aフレームワーク
        </h2>
        <p className="text-xs text-muted-foreground mb-6 ml-10">
          顧客の反論を関係構築の機会へ転換するプロセス
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-border" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FOUR_A_FRAMEWORK.map((item, i) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="text-center relative"
              >
                {/* Circle node */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center border-2 bg-background relative z-10"
                  style={{ borderColor: item.color }}
                >
                  <span className="text-2xl font-display font-bold" style={{ color: item.color }}>
                    {item.letter}
                  </span>
                </div>
                <div className="font-display font-bold text-sm mb-0.5">{item.word}</div>
                <div className="text-[11px] text-muted-foreground font-medium mb-2" style={{ color: item.color }}>
                  {item.label}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed px-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   7. QUIZ
   ════════════════════════════════════════════════════════ */
function QuizSection() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const q = AWT_QUIZ_QUESTIONS[current]
  const isAnswered = selected !== null
  const isCorrect = selected === q.correctIndex
  const total = AWT_QUIZ_QUESTIONS.length
  const isFinished = answered === total && isAnswered && current === total - 1

  function handleSelect(idx: number) {
    if (isAnswered) return
    setSelected(idx)
    setAnswered((prev) => prev + 1)
    if (idx === q.correctIndex) setScore((prev) => prev + 1)
  }

  function handleNext() {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1)
      setSelected(null)
    }
  }

  function handleReset() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setAnswered(0)
  }

  if (isFinished) {
    const pct = Math.round((score / total) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-[#886FBF]/10 flex items-center justify-center mx-auto mb-4">
          <GraduationCap size={32} className="text-[#886FBF]" />
        </div>
        <div className="text-5xl font-display font-bold text-[#886FBF] mb-1">{pct}%</div>
        <div className="text-sm text-muted-foreground mb-1">
          {score} / {total} 問正解
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          {pct === 100
            ? "パーフェクト！AWTの理解は万全です。"
            : pct >= 70
              ? "良い結果です！もう少しで完璧です。"
              : "もう一度復習してみましょう。"}
        </p>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-[#886FBF] text-white rounded-xl text-sm font-medium hover:bg-[#886FBF]/90 transition-colors"
        >
          もう一度挑戦
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>問題 {current + 1} / {total}</span>
        <span>正解 {score} / {answered}</span>
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#886FBF] rounded-full"
          initial={false}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question card */}
      <Card className="rounded-2xl border-border">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold mb-5 leading-relaxed">{q.question}</h3>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let style = "border-border hover:border-foreground/20"
              if (isAnswered) {
                if (idx === q.correctIndex) style = "border-gcp-green bg-gcp-green/5"
                else if (idx === selected && !isCorrect) style = "border-gcp-red bg-gcp-red/5"
                else style = "border-border opacity-40"
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${style}`}
                  disabled={isAnswered}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold mt-0.5"
                      style={
                        isAnswered && idx === q.correctIndex
                          ? { borderColor: "var(--gcp-green)", color: "var(--gcp-green)" }
                          : isAnswered && idx === selected && !isCorrect
                            ? { borderColor: "var(--gcp-red)", color: "var(--gcp-red)" }
                            : {}
                      }
                    >
                      {isAnswered && idx === q.correctIndex ? (
                        <Check size={10} />
                      ) : isAnswered && idx === selected && !isCorrect ? (
                        <X size={10} />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 p-4 rounded-xl text-xs leading-relaxed ${
                isCorrect
                  ? "bg-gcp-green/5 border border-gcp-green/15"
                  : "bg-gcp-red/5 border border-gcp-red/15"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                {isCorrect ? (
                  <Check size={13} className="text-gcp-green" />
                ) : (
                  <X size={13} className="text-gcp-red" />
                )}
                {isCorrect ? "正解！" : "不正解"}
              </div>
              <p className="text-muted-foreground">{q.explanation}</p>
            </motion.div>
          )}

          {isAnswered && current < total - 1 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                次の問題
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
