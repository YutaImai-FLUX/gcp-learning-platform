"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  ChevronRight,
  Check,
  X,
  HelpCircle,
  Sparkles,
  Cloud,
  Mail,
  Users,
  GraduationCap,
  ArrowRight,
  CircleDot,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  WORKSPACE_PLANS,
  GEMINI_PLANS,
  GEMINI_FEATURE_LABELS,
  USAGE_LIMITS,
  CONFUSION_POINTS,
  SERVICE_LAYERS,
  CERT_RELEVANCE,
  QUIZ_QUESTIONS,
} from "@/lib/data/google-enterprise"
import type { GeminiPlan } from "@/lib/data/google-enterprise"

type TabId = "overview" | "workspace" | "gemini" | "faq" | "quiz"

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "全体像", icon: Building2 },
  { id: "workspace", label: "Workspace", icon: Mail },
  { id: "gemini", label: "Gemini比較", icon: Sparkles },
  { id: "faq", label: "混同ポイント", icon: HelpCircle },
  { id: "quiz", label: "理解度チェック", icon: GraduationCap },
]

export default function GoogleEnterprisePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Building2 size={14} />
          <span>Google法人向けサービス</span>
        </div>
        <h1 className="text-2xl font-bold">Google法人向けサービスの全体像</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Google Workspace（Gemini AI標準搭載）/ GCP の関係性を正しく理解する
        </p>
      </motion.div>

      {/* Key Message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gcp-blue/30 bg-gcp-blue/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Lightbulb size={18} className="text-gcp-blue shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-gcp-blue">GCP資格学習者向けポイント：</span>
              <span className="text-muted-foreground ml-1">
                2025年1月〜 Gemini AIがWorkspace全プランに標準搭載。旧Gemini Business/Enterpriseアドオンは販売終了。
                Workspace内蔵AIとGCPのGemini API（Vertex AI）は別の課金体系。この関係を正しく理解することが試験対策の基礎になります。
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gcp-blue text-white shadow-sm"
                  : "bg-white dark:bg-card border border-border text-muted-foreground hover:border-gcp-blue/40 hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "workspace" && <WorkspaceTab />}
          {activeTab === "gemini" && <GeminiTab />}
          {activeTab === "faq" && <FaqTab />}
          {activeTab === "quiz" && <QuizTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── Overview Tab ─── */
function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Service Layers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Cloud size={20} className="text-gcp-blue" />
          3つのサービスレイヤー
        </h2>

        <div className="grid gap-4">
          {SERVICE_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-l-4" style={{ borderLeftColor: layer.color }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: layer.color }}>
                          {layer.label}
                        </h3>
                        <Badge variant="outline" className="text-[10px]">
                          {layer.billing}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{layer.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {layer.services.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-xs bg-muted/50 text-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={12} />
                        <span>{layer.target}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Relationship Diagram */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CircleDot size={14} className="text-gcp-green" />
            サービス間の関係
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6">
            {/* Visual Diagram */}
            <div className="space-y-3">
              {/* GCP Layer */}
              <div className="rounded-lg border-2 border-dashed p-4" style={{ borderColor: "#34A853" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "#34A853" }}>
                  Google Cloud (GCP) — 開発者向けクラウドインフラ
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Compute Engine", "BigQuery", "Cloud Run", "GKE", "Cloud SQL"].map((s) => (
                    <span key={s} className="px-2 py-1 rounded text-xs bg-white dark:bg-card border border-border">
                      {s}
                    </span>
                  ))}
                  <span className="px-2 py-1 rounded text-xs bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 font-medium">
                    Vertex AI / Gemini API（従量課金）
                  </span>
                </div>
              </div>

              {/* Connection Arrow */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className="h-px w-16 bg-border" />
                <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[10px] font-medium">
                  データグラウンディング連携（Enterprise のみ）
                </span>
                <div className="h-px w-16 bg-border" />
              </div>

              {/* Workspace Layer */}
              <div className="rounded-lg border-2 border-dashed p-4" style={{ borderColor: "#4285F4" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "#4285F4" }}>
                  Google Workspace — 全社員向けコラボレーション基盤
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Gmail", "Drive", "Docs", "Sheets", "Slides", "Meet", "Chat", "Calendar"].map((s) => (
                    <span key={s} className="px-2 py-1 rounded text-xs bg-white dark:bg-card border border-border">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Gemini AI built-in */}
                <div className="rounded-lg border-2 p-3 ml-4" style={{ borderColor: "#886FBF", backgroundColor: "rgba(136,111,191,0.05)" }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#886FBF" }}>
                    Gemini AI（Standard以上に標準搭載 / 2025年1月〜）
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Geminiサイドパネル", "Help me write", "Geminiアプリ(Gems)", "会議ノート自動生成", "NotebookLM Plus", "Deep Research"].map((s) => (
                      <span key={s} className="px-2 py-1 rounded text-xs bg-white dark:bg-card border border-purple-200 dark:border-purple-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#34A853" }} />
                <span>GCP（従量課金）</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4285F4" }} />
                <span>Workspace（月額固定）</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#886FBF" }} />
                <span>Gemini AI（Workspace標準搭載）</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cert Relevance */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap size={14} className="text-gcp-blue" />
            資格試験との関連性
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {CERT_RELEVANCE.map((cert) => (
              <div
                key={cert.certId}
                className="flex items-center gap-3 p-3 rounded-lg border border-border"
              >
                <Badge
                  variant="outline"
                  className={`shrink-0 text-[10px] ${
                    cert.level === "high"
                      ? "border-gcp-red text-gcp-red"
                      : cert.level === "medium"
                      ? "border-gcp-yellow text-gcp-yellow"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {cert.level === "high" ? "高" : cert.level === "medium" ? "中" : "低"}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{cert.certName}</div>
                  <div className="text-xs text-muted-foreground">{cert.relevance}</div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {cert.certId}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Workspace Tab ─── */
function WorkspaceTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Mail size={20} className="text-gcp-blue" />
          Google Workspace プラン比較
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gmail, Drive, Docs, Sheets, Meet, Chat, Calendar 等の統合コラボレーションSaaS
        </p>
      </div>

      {/* Plan Comparison Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">機能</th>
                  {WORKSPACE_PLANS.map((plan) => (
                    <th
                      key={plan.name}
                      className={`text-center p-3 font-medium ${
                        plan.highlight ? "bg-gcp-blue/5" : ""
                      }`}
                    >
                      <div className="text-foreground">{plan.name}</div>
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">
                        {plan.price}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-normal">
                        年間: {plan.priceAnnual}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <PlanRow
                  label="ストレージ"
                  values={WORKSPACE_PLANS.map((p) => p.storage)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanRow
                  label="Meet 最大参加者"
                  values={WORKSPACE_PLANS.map((p) => p.meetCapacity)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanBoolRow
                  label="Google Vault"
                  values={WORKSPACE_PLANS.map((p) => p.vault)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanBoolRow
                  label="DLP（データ損失防止）"
                  values={WORKSPACE_PLANS.map((p) => p.dlp)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanBoolRow
                  label="AppSheet"
                  values={WORKSPACE_PLANS.map((p) => p.appSheet)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanRow
                  label="セキュリティ"
                  values={WORKSPACE_PLANS.map((p) => p.securityLevel)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
                <PlanRow
                  label="Gemini AI"
                  values={WORKSPACE_PLANS.map((p) => p.geminiLevel)}
                  highlights={WORKSPACE_PLANS.map((p) => !!p.highlight)}
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="border-green-300/50 bg-green-50/50 dark:bg-green-950/10">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles size={16} className="text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-green-600 dark:text-green-400">2025年1月〜：</span>
            Gemini AI機能がBusiness/Enterpriseプランに標準搭載されました（旧Gemini Business/Enterpriseアドオンは販売終了）。
            Business Starterは制限付き（1日5プロンプト）、Standard以上はフル機能が利用可能です。
            使用量上限を超える場合はAI Expanded / AI Ultra Accessアドオンを追加できます。
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2">中小企業（〜300人）向け</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ChevronRight size={12} className="shrink-0 mt-0.5 text-gcp-blue" />
                <span><strong>Business Starter / Standard</strong> で基本的なメール・ファイル共有・会議をカバー</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight size={12} className="shrink-0 mt-0.5 text-gcp-blue" />
                <span>コンプライアンス要件がある場合は <strong>Business Plus</strong>（Vault, DLP対応）</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2">大企業（300人〜）向け</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ChevronRight size={12} className="shrink-0 mt-0.5 text-gcp-green" />
                <span><strong>Enterprise</strong> プランで最上位セキュリティ（S/MIME, CAA, DLP）を確保</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight size={12} className="shrink-0 mt-0.5 text-gcp-green" />
                <span>AI活用ヘビーユーザーには <strong>AI Expanded Access</strong> アドオンで使用量上限を拡張</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Gemini Tab ─── */
function GeminiTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles size={20} style={{ color: "#886FBF" }} />
          Workspace内蔵 Gemini AI 比較
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Standard/Plus vs Enterprise：Workspaceプラン別に含まれるAI機能を比較
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GEMINI_PLANS.map((plan) => (
          <GeminiPlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      {/* Feature Comparison Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">機能詳細比較</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">機能</th>
                  <th className="text-center p-3 font-medium" style={{ color: "#886FBF" }}>
                    Standard / Plus
                    <div className="text-xs font-normal text-muted-foreground">Workspace料金に含む</div>
                  </th>
                  <th className="text-center p-3 font-medium bg-purple-50/50 dark:bg-purple-950/10" style={{ color: "#886FBF" }}>
                    Enterprise
                    <div className="text-xs font-normal text-muted-foreground">Workspace料金に含む</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(GEMINI_FEATURE_LABELS) as (keyof GeminiPlan["features"])[]).map(
                  (key) => (
                    <tr key={key} className="border-b border-border last:border-0">
                      <td className="p-3 text-muted-foreground">
                        {GEMINI_FEATURE_LABELS[key]}
                      </td>
                      <td className="text-center p-3">
                        {GEMINI_PLANS[0].features[key] ? (
                          <Check size={16} className="mx-auto text-gcp-green" />
                        ) : (
                          <X size={16} className="mx-auto text-muted-foreground/30" />
                        )}
                      </td>
                      <td className="text-center p-3 bg-purple-50/30 dark:bg-purple-950/5">
                        {GEMINI_PLANS[1].features[key] ? (
                          <Check size={16} className="mx-auto text-gcp-green" />
                        ) : (
                          <X size={16} className="mx-auto text-muted-foreground/30" />
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle size={14} className="text-gcp-yellow" />
            使用量制限（2026年4月〜適用開始）
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">機能</th>
                  {USAGE_LIMITS.tiers.map((t) => (
                    <th key={t.tier} className="text-center p-3 font-medium text-xs">{t.tier}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">画像生成</td>
                  {USAGE_LIMITS.tiers.map((t) => (
                    <td key={t.tier} className="text-center p-3 text-xs">{t.imageGeneration}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">Vids動画生成</td>
                  {USAGE_LIMITS.tiers.map((t) => (
                    <td key={t.tier} className="text-center p-3 text-xs">{t.vidsGeneration}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-muted-foreground">Workspace Studio</td>
                  {USAGE_LIMITS.tiers.map((t) => (
                    <td key={t.tier} className="text-center p-3 text-xs">{t.workspaceStudio}</td>
                  ))}
                </tr>
                <tr className="border-b border-border last:border-0">
                  <td className="p-3 text-muted-foreground">PDF音声概要</td>
                  {USAGE_LIMITS.tiers.map((t) => (
                    <td key={t.tier} className="text-center p-3 text-xs">{t.pdfAudioSummary}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-muted-foreground border-t border-border bg-muted/20">
            上限を超える場合は <strong>AI Expanded Access</strong> / <strong>AI Ultra Access</strong> アドオンで拡張可能
          </div>
        </CardContent>
      </Card>

      {/* Three Gemini Comparison */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle size={14} className="text-gcp-yellow" />
            「Gemini」の3つの意味を区別する
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Workspace内蔵 Gemini AI",
                desc: "Workspaceプランに標準搭載のAIアシスタント（月額固定・Workspace料金に含む）",
                color: "#886FBF",
                target: "一般ユーザー",
              },
              {
                name: "Gemini API (Vertex AI)",
                desc: "開発者がアプリに組み込むAPI（従量課金・トークン単位）",
                color: "#34A853",
                target: "開発者",
              },
              {
                name: "Gemini（gemini.google.com）",
                desc: "個人向けチャットAI（無料 / Google One AI Premium）",
                color: "#4285F4",
                target: "個人ユーザー",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-lg border border-border"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {item.target}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── FAQ Tab ─── */
function FaqTab() {
  const [openId, setOpenId] = useState<number | null>(null)

  const categoryColors: Record<string, string> = {
    gemini: "#886FBF",
    workspace: "#4285F4",
    gcp: "#34A853",
  }
  const categoryLabels: Record<string, string> = {
    gemini: "Gemini",
    workspace: "Workspace",
    gcp: "GCP",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <HelpCircle size={20} className="text-gcp-yellow" />
          よくある混同ポイント
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          GCP学習者が間違えやすいポイントをQ&A形式で整理
        </p>
      </div>

      <div className="space-y-2">
        {CONFUSION_POINTS.map((point, i) => (
          <Card
            key={i}
            className={`border-border cursor-pointer transition-all ${
              openId === i ? "ring-1 ring-gcp-blue/30" : "hover:border-gcp-blue/20"
            }`}
            onClick={() => setOpenId(openId === i ? null : i)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform ${
                      openId === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{
                        borderColor: categoryColors[point.category],
                        color: categoryColors[point.category],
                      }}
                    >
                      {categoryLabels[point.category]}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">{point.question}</div>
                  <AnimatePresence>
                    {openId === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground leading-relaxed">
                          <ArrowRight size={12} className="inline mr-1 text-gcp-green" />
                          {point.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Quiz Tab ─── */
function QuizTab() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = QUIZ_QUESTIONS[currentQ]

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const handleReset = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    return (
      <div className="space-y-6">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div
                className={`text-5xl font-bold mb-2 ${
                  percentage >= 80
                    ? "text-gcp-green"
                    : percentage >= 60
                    ? "text-gcp-yellow"
                    : "text-gcp-red"
                }`}
              >
                {percentage}%
              </div>
              <div className="text-lg font-semibold mb-1">
                {score} / {QUIZ_QUESTIONS.length} 正解
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {percentage >= 80
                  ? "Google法人向けサービスの違いをよく理解しています！"
                  : percentage >= 60
                  ? "基本は理解していますが、一部の混同ポイントを復習しましょう。"
                  : "混同ポイント（FAQ）タブで各サービスの違いを確認してみましょう。"}
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gcp-blue text-white rounded-lg text-sm font-medium hover:bg-gcp-blue/90 transition-colors"
              >
                もう一度チャレンジ
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap size={20} className="text-gcp-blue" />
            理解度チェック
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Google法人向けサービスの理解度を5問でチェック
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentQ + 1} / {QUIZ_QUESTIONS.length}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gcp-blue rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQ + (answered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="text-sm font-semibold mb-4">{question.question}</div>

          <div className="space-y-2">
            {question.options.map((option, idx) => {
              let optionClass =
                "border border-border hover:border-gcp-blue/40 cursor-pointer"
              if (answered) {
                if (idx === question.correctIndex) {
                  optionClass =
                    "border-2 border-gcp-green bg-green-50/50 dark:bg-green-950/10"
                } else if (idx === selected && idx !== question.correctIndex) {
                  optionClass =
                    "border-2 border-gcp-red bg-red-50/50 dark:bg-red-950/10"
                } else {
                  optionClass = "border border-border opacity-50"
                }
              } else if (idx === selected) {
                optionClass = "border-2 border-gcp-blue bg-gcp-blue/5"
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all ${optionClass}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-medium mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-start gap-2 text-sm">
                    <Lightbulb size={14} className="shrink-0 mt-0.5 text-gcp-yellow" />
                    <span className="text-muted-foreground">{question.explanation}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gcp-blue text-white rounded-lg text-sm font-medium hover:bg-gcp-blue/90 transition-colors"
                  >
                    {currentQ < QUIZ_QUESTIONS.length - 1 ? "次の問題" : "結果を見る"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Helper Components ─── */

function GeminiPlanCard({ plan }: { plan: GeminiPlan }) {
  const isEnterprise = plan.name.includes("Enterprise")
  const enabledCount = Object.values(plan.features).filter(Boolean).length
  const totalCount = Object.keys(plan.features).length

  return (
    <Card
      className={`border-border ${
        isEnterprise ? "ring-1 ring-purple-300/50 dark:ring-purple-700/50" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold" style={{ color: "#886FBF" }}>
              {plan.name}
            </h3>
            <div className="text-lg font-bold mt-0.5">{plan.price}</div>
          </div>
          {isEnterprise && (
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-[10px]">
              おすすめ
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {enabledCount} / {totalCount} 機能が利用可能
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(enabledCount / totalCount) * 100}%`,
              backgroundColor: "#886FBF",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PlanRow({
  label,
  values,
  highlights,
}: {
  label: string
  values: string[]
  highlights: boolean[]
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-3 text-muted-foreground">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`text-center p-3 text-foreground ${highlights[i] ? "bg-gcp-blue/5" : ""}`}
        >
          {v}
        </td>
      ))}
    </tr>
  )
}

function PlanBoolRow({
  label,
  values,
  highlights,
}: {
  label: string
  values: boolean[]
  highlights: boolean[]
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-3 text-muted-foreground">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`text-center p-3 ${highlights[i] ? "bg-gcp-blue/5" : ""}`}
        >
          {v ? (
            <Check size={16} className="mx-auto text-gcp-green" />
          ) : (
            <X size={16} className="mx-auto text-muted-foreground/30" />
          )}
        </td>
      ))}
    </tr>
  )
}
