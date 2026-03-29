"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles,
  Network,
  FileText,
  Shield,
  PlayCircle,
  Brain,
  Bot,
  BarChart3,
  Layers,
  Wrench,
  ArrowRight,
  Calendar,
  Tag,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type UpdateCategory = "feature" | "improvement" | "fix" | "security"

interface Update {
  date: string
  version: string
  category: UpdateCategory
  title: string
  description: string
  highlights: string[]
  links: { label: string; href: string }[]
  icon: React.ElementType
  color: string
}

const CATEGORY_CONFIG: Record<UpdateCategory, { label: string; color: string; bg: string }> = {
  feature: { label: "新機能", color: "#4285F4", bg: "bg-[#e8f0fe]" },
  improvement: { label: "改善", color: "#34A853", bg: "bg-[#e6f4ea]" },
  fix: { label: "修正", color: "#FBBC05", bg: "bg-[#fef7e0]" },
  security: { label: "セキュリティ", color: "#EA4335", bg: "bg-[#fce8e6]" },
}

const UPDATES: Update[] = [
  {
    date: "2026-03-29",
    version: "v1.5.0",
    category: "fix",
    title: "コードレビュー品質改善",
    description:
      "全実装のコードレビューを実施し、メモリリーク防止・エラーハンドリング強化・レスポンシブ対応など複数の品質改善を適用しました。",
    highlights: [
      "アーキテクチャ図のstate同期バグ修正",
      "ノードツールチップのメモリリーク防止",
      "提案シミュレーターのエラーハンドリング強化",
      "モバイルレスポンシブ対応の改善",
      "未知サービスID検出の警告ログ追加",
    ],
    links: [
      { label: "アーキテクチャ図", href: "/architecture" },
      { label: "提案シミュレーター", href: "/proposal" },
    ],
    icon: Wrench,
    color: "#FBBC05",
  },
  {
    date: "2026-03-29",
    version: "v1.4.0",
    category: "feature",
    title: "提案シミュレーター",
    description:
      "クライアントのニーズを入力すると、最適なGCPサービス構成・アーキテクチャ図・コスト見積・実装スケジュール・課題/論点を自動生成する提案シミュレーション機能を搭載しました。",
    highlights: [
      "9業種 x 4スケール x 18要件の組み合わせに対応",
      "8つの提案テンプレートによるスコアリングエンジン",
      "28+ GCPサービスの料金シミュレーション（CUD割引対応）",
      "アーキテクチャ図の自動生成・拡張",
      "ガントチャート風タイムライン表示",
      "業種別コンプライアンス課題の自動追加",
    ],
    links: [
      { label: "提案シミュレーター", href: "/proposal" },
      { label: "新しい提案を作成", href: "/proposal/new" },
    ],
    icon: FileText,
    color: "#4285F4",
  },
  {
    date: "2026-03-28",
    version: "v1.3.0",
    category: "improvement",
    title: "アーキテクチャ図の大幅改善",
    description:
      "アーキテクチャ図をSVGベースからReact Flow + dagre自動レイアウトにアップグレード。レイヤーグルーピング・ホバーツールチップ・インタラクティブ操作を実現しました。",
    highlights: [
      "React Flow + dagre compound graphによる自動レイアウト",
      "ミドルウェア/アプリケーション等のレイヤーグルーピング表示",
      "各ノードのホバーツールチップ（製品概要 + 役割表示）",
      "MiniMap・ズーム・パン操作対応",
      "12種類のアーキテクチャパターン対応",
    ],
    links: [
      { label: "アーキテクチャ一覧", href: "/architecture" },
    ],
    icon: Network,
    color: "#34A853",
  },
  {
    date: "2026-03-27",
    version: "v1.2.0",
    category: "security",
    title: "セキュリティデモ 5種追加",
    description:
      "Google Cloud のセキュリティサービスを体験できるインタラクティブデモを5種類追加。IAMポリシー、VPC & Firewall、サービスアカウント、組織ポリシー、監査ログの操作を模擬体験できます。",
    highlights: [
      "IAM ポリシーシミュレーター",
      "VPC & Firewall ルール設定デモ",
      "サービスアカウント管理デモ",
      "Organization Policy 設定デモ",
      "Cloud Audit Logs 閲覧デモ",
    ],
    links: [
      { label: "IAM デモ", href: "/demos/iam" },
      { label: "VPC & Firewall", href: "/demos/vpc-firewall" },
      { label: "サービスアカウント", href: "/demos/service-accounts" },
      { label: "Org Policy", href: "/demos/org-policy" },
      { label: "Audit Logs", href: "/demos/audit-logs" },
    ],
    icon: Shield,
    color: "#EA4335",
  },
  {
    date: "2026-03-26",
    version: "v1.1.0",
    category: "feature",
    title: "ADK (AI Agent) デモ追加",
    description:
      "Google Agent Development Kit (ADK) を活用したマルチエージェントシステムの体験デモを追加。エージェント作成・ツール定義・実行フローの可視化ができます。",
    highlights: [
      "マルチエージェント構成の可視化",
      "ツール定義とエージェント間通信の体験",
      "リアルタイム実行ログ表示",
    ],
    links: [
      { label: "ADK デモ", href: "/demos/adk" },
      { label: "Vertex AI デモ", href: "/demos/vertex-ai" },
    ],
    icon: Bot,
    color: "#4285F4",
  },
  {
    date: "2026-03-25",
    version: "v1.0.0",
    category: "feature",
    title: "GCP Interactive Learning Platform リリース",
    description:
      "Google Cloud Platform の製品群・アーキテクチャ・デモ体験・資格学習を統合したハンズオン型学習プラットフォームの初版をリリースしました。",
    highlights: [
      "40+ GCP製品のカタログ（カテゴリ別検索・フィルタリング）",
      "9種類のインタラクティブデモ（GCE, GCS, BigQuery, Cloud Run, GKE, Pub/Sub, Vertex AI, Cloud Functions, ADK）",
      "5資格対応の学習センター（CDL, ACE, PCA, PDE, PMLE）",
      "150+ クイズ問題（練習モード & 模擬試験モード）",
      "11種類のアーキテクチャパターン",
      "ダーク/ライトモード対応",
    ],
    links: [
      { label: "ダッシュボード", href: "/" },
      { label: "製品カタログ", href: "/products" },
      { label: "デモ一覧", href: "/demos" },
      { label: "資格学習", href: "/learn" },
      { label: "アーキテクチャ", href: "/architecture" },
    ],
    icon: Sparkles,
    color: "#4285F4",
  },
]

const ROADMAP = [
  { title: "Terraform デモ", description: "IaCによるインフラ構築の体験", icon: Layers, color: "#4285F4" },
  { title: "コスト最適化アドバイザー", description: "利用パターンに基づく最適化提案", icon: BarChart3, color: "#34A853" },
  { title: "ハンズオンラボ", description: "ステップバイステップの実践課題", icon: PlayCircle, color: "#FBBC05" },
  { title: "AI/ML パイプラインデモ", description: "Vertex AI Pipelines の体験", icon: Brain, color: "#EA4335" },
]

export default function UpdatesPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#5a95f5] to-[#34A853] p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">What&apos;s New</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">アップデート情報</h1>
          <p className="text-white/80 text-lg">
            GCP Interactive Learning Platform の最新機能・改善・修正をまとめています
          </p>
        </div>
      </motion.div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

        <div className="space-y-6">
          {UPDATES.map((update, i) => {
            const Icon = update.icon
            const catConfig = CATEGORY_CONFIG[update.category]

            return (
              <motion.div
                key={update.version}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-2.5 top-5 w-[14px] h-[14px] rounded-full border-[3px] border-white dark:border-[#1a1b1e] z-10"
                  style={{ backgroundColor: update.color }}
                />

                <Card className="border-border hover:shadow-md transition-shadow overflow-hidden">
                  {/* Color accent top */}
                  <div className="h-1" style={{ backgroundColor: update.color }} />

                  <CardContent className="pt-5 pb-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge
                        className="text-[10px] font-semibold"
                        style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color, border: `1px solid ${catConfig.color}30` }}
                      >
                        {catConfig.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Tag size={10} />
                        {update.version}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar size={11} />
                        {update.date}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${update.color}15` }}
                      >
                        <Icon size={16} style={{ color: update.color }} />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">{update.title}</h2>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {update.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-4">
                      {update.highlights.map((h, hi) => (
                        <div key={hi} className="flex items-start gap-2 text-sm">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: update.color }}
                          />
                          <span className="text-foreground/80">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    {update.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        {update.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                            style={{ color: update.color }}
                          >
                            <ArrowRight size={12} />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Card className="border-border">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-gcp-blue" />
              <h2 className="text-lg font-bold text-foreground">Coming Soon</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">今後追加予定の機能</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROADMAP.map((item) => {
                const RIcon = item.icon
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-dashed border-border p-4 hover:border-solid hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <RIcon size={18} style={{ color: item.color }} />
                    </div>
                    <div className="font-semibold text-sm text-foreground mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* External Links */}
      <Card className="border-border">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink size={16} className="text-muted-foreground" />
            関連リンク
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Google Cloud 公式ブログ", url: "https://cloud.google.com/blog", color: "#4285F4" },
              { label: "Google Cloud リリースノート", url: "https://cloud.google.com/release-notes", color: "#34A853" },
              { label: "Google Cloud 料金計算ツール", url: "https://cloud.google.com/products/calculator", color: "#FBBC05" },
              { label: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google", color: "#EA4335" },
              { label: "Google Cloud 認定資格", url: "https://cloud.google.com/learn/certification", color: "#4285F4" },
              { label: "Google Cloud アーキテクチャセンター", url: "https://cloud.google.com/architecture", color: "#34A853" },
            ].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:shadow-sm hover:border-border/80 transition-all group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${link.color}15` }}
                >
                  <ExternalLink size={14} style={{ color: link.color }} />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-gcp-blue transition-colors">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
