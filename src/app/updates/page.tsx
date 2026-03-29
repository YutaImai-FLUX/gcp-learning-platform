"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Brain,
  Cpu,
  Shield,
  Database,
  Box,
  Bot,
  Network,
  Search,
  Calendar,
  ExternalLink,
  ArrowRight,
  Filter,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type NewsCategory = "ai" | "cloud" | "data" | "security" | "devops"

interface NewsItem {
  id: string
  date: string
  category: NewsCategory
  title: string
  description: string
  highlights: string[]
  sourceUrl: string
  sourceLabel: string
  icon: React.ElementType
  color: string
  isHighlight?: boolean
}

const CATEGORY_CONFIG: Record<NewsCategory, { label: string; color: string; icon: React.ElementType }> = {
  ai: { label: "AI / ML", color: "#4285F4", icon: Brain },
  cloud: { label: "Cloud Infrastructure", color: "#34A853", icon: Cpu },
  data: { label: "Data & Analytics", color: "#FBBC05", icon: Database },
  security: { label: "Security", color: "#EA4335", icon: Shield },
  devops: { label: "DevOps / Platform", color: "#5f6368", icon: Box },
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "gemini-3-1-pro-preview",
    date: "2026-03",
    category: "ai",
    title: "Gemini 3.1 Pro プレビュー公開 -- 強化された推論とエージェント機能",
    description:
      "Google が Gemini 3.1 Pro をプレビューリリース。複雑な問題解決に特化した最先端の推論モデルで、Vertex AI・Google AI Studio・Gemini CLI からアクセス可能。ソフトウェアエンジニアリングと金融・スプレッドシート分野のエージェント性能が大幅向上しました。",
    highlights: [
      "MEDIUM 思考レベルパラメータ追加でコスト・性能・速度のバランスを最適化",
      "SWEベンチマークで最高水準スコアを達成した高度なコーディング能力",
      "100万トークンコンテキストウィンドウで長文・大規模コードリポジトリに対応",
    ],
    sourceUrl: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-1-pro",
    sourceLabel: "Vertex AI Documentation",
    icon: Sparkles,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "vector-search-2-ga",
    date: "2026-03",
    category: "data",
    title: "Vector Search 2.0 が一般提供 (GA) 開始 -- ハイブリッド検索統合",
    description:
      "Vertex AI Vector Search 2.0 が正式に一般提供開始。ベクトル検索・全文検索・セマンティック再ランキングを単一の並列クエリで実行するハイブリッド検索機能を搭載。AI アプリケーションの知識コアとして機能する高度な検索エンジンです。",
    highlights: [
      "ベクトル検索・全文検索・セマンティック再ランキングの単一クエリ統合",
      "コレクション単位でデータとベクトルを一元管理するシンプルなデータモデル",
      "自動埋め込み生成 (Auto-Embeddings) でベクトルフィールドの自動設定が可能",
    ],
    sourceUrl: "https://cloud.google.com/vertex-ai/docs/vector-search/overview",
    sourceLabel: "Google Cloud Documentation",
    icon: Database,
    color: "#FBBC05",
    isHighlight: true,
  },
  {
    id: "cloud-run-gpu-networking-march26",
    date: "2026-03",
    category: "devops",
    title: "Cloud Run に NVIDIA RTX PRO 6000 Blackwell GPU とIPv6デュアルスタック対応",
    description:
      "Cloud Run が NVIDIA RTX PRO 6000 Blackwell GPU のプレビューサポートを追加し、GPU on Cloud Run Jobs が一般提供へ昇格。ネットワーク面では IPv6 デュアルスタックサブネット対応が GA に、Direct VPC Egress で VPC Flow Logs とプライベート NAT もサポートされました。",
    highlights: [
      "NVIDIA RTX PRO 6000 Blackwell GPU がサービス・ジョブ・ワーカープールで利用可能 (Preview)",
      "IPv6デュアルスタックサブネット対応 GA で外部IPv6トラフィックを直接処理",
      "Python ADK (Agent Development Kit) フレームワーク対応がソースデプロイで GA に",
    ],
    sourceUrl: "https://docs.cloud.google.com/run/docs/release-notes",
    sourceLabel: "Cloud Run Release Notes",
    icon: Box,
    color: "#5f6368",
  },
  {
    id: "gke-openssl-security-bulletin",
    date: "2026-03",
    category: "security",
    title: "GKE OpenSSL脆弱性パッチ (GCP-2026-006) とMCP IAM制御の変更",
    description:
      "GKE が OpenSSL の重大な脆弱性 CVE-2025-15467 (リモートコード実行の可能性) に対処するセキュリティアップデートをリリース。また、2026年3月17日以降 GKE の MCP サーバー制御が組織ポリシーから IAM 拒否ポリシーに移行しました。",
    highlights: [
      "CVE-2025-15467 (OpenSSL RCE) を含む複数のカーネル脆弱性を修正",
      "GKE Regularチャンネルのデフォルトバージョンが 1.35.1-gke.1396002 に更新",
      "MCP サーバーの利用制御が組織ポリシーから IAM 拒否ポリシーに移行",
    ],
    sourceUrl: "https://cloud.google.com/support/bulletins",
    sourceLabel: "Google Cloud Security Bulletins",
    icon: Shield,
    color: "#EA4335",
  },
  {
    id: "bigquery-conversational-analytics-march26",
    date: "2026-03",
    category: "data",
    title: "BigQuery に会話型アナリティクスとMigration Service MCPサーバーが追加",
    description:
      "BigQuery Studio に自然言語でデータを分析できる「会話型アナリティクス」エージェントが導入。さらに BigQuery Migration Service MCP サーバー (Preview) が公開され、AIエージェントが SQL 翻訳・DDL生成・クエリ説明を直接実行できるようになりました。",
    highlights: [
      "会話型アナリティクスエージェントがクエリ生成・実行・可視化をワンストップで対応",
      "BigQuery Migration Service MCPサーバーでレガシーSQL→GoogleSQL の AI 翻訳が可能",
      "BigQuery→Spanner へのリバース ETL が EXPORT DATA 文経由で GA に",
    ],
    sourceUrl: "https://mwpro.co.uk/blog/2026/03/27/gcp-release-notes-march-26-2026/",
    sourceLabel: "GCP Release Notes (March 26, 2026)",
    icon: Database,
    color: "#FBBC05",
    isHighlight: true,
  },
  {
    id: "gemini-2-5-pro",
    date: "2025-03",
    category: "ai",
    title: "Gemini 2.5 Pro -- 思考型AIモデルのリリース",
    description:
      "Google DeepMind が Gemini 2.5 Pro をリリース。内部で Chain-of-Thought 推論を行う「思考型」モデルで、コーディング・数学・科学ベンチマークで最先端の性能を達成。SWE-bench や GPQA で競合を上回るスコアを記録しました。",
    highlights: [
      "内部思考プロセスによる高精度な推論",
      "100万トークンのコンテキストウィンドウ",
      "コーディング・数学・科学で最高水準のベンチマークスコア",
    ],
    sourceUrl: "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/",
    sourceLabel: "Google Blog",
    icon: Sparkles,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "gemini-2-5-flash",
    date: "2025-04",
    category: "ai",
    title: "Gemini 2.5 Flash -- 高速・低コスト思考モデル",
    description:
      "Gemini 2.5 Flash がプレビュー公開。高速かつコスト効率に優れた思考型モデルで、大量処理タスクに最適化。開発者が品質とレイテンシ/コストのバランスを調整できる「Thinking Budget」機能を搭載しています。",
    highlights: [
      "設定可能な Thinking Budget で品質/速度を調整",
      "本番ワークロード向けのコスト最適化",
      "Gemini 2.5 Pro と同等の推論品質を高速で実現",
    ],
    sourceUrl: "https://developers.googleblog.com/en/gemini-25-flash-is-now-in-preview/",
    sourceLabel: "Google Developers Blog",
    icon: Sparkles,
    color: "#4285F4",
  },
  {
    id: "cloud-next-25",
    date: "2025-04",
    category: "cloud",
    title: "Google Cloud Next '25 -- 300以上の新発表",
    description:
      "ラスベガスで開催された Google Cloud Next '25 では、AI インフラ、Gemini のクラウド全体への統合、エージェント構築ツール、エンタープライズ AI 機能など 300 以上の発表がありました。Thomas Kurian CEO は「エージェント時代」をテーマに掲げました。",
    highlights: [
      "「エージェント時代」をテーマにした基調講演",
      "AIインフラ・エージェントツール・セキュリティの大型発表",
      "Google Cloud 全スタックへの Gemini 統合強化",
    ],
    sourceUrl: "https://cloud.google.com/blog/topics/google-cloud-next/google-cloud-next-2025-wrap-up",
    sourceLabel: "Google Cloud Blog",
    icon: Network,
    color: "#34A853",
    isHighlight: true,
  },
  {
    id: "adk-launch",
    date: "2025-04",
    category: "ai",
    title: "Agent Development Kit (ADK) オープンソース公開",
    description:
      "Google が Agent Development Kit (ADK) をオープンソースとして公開。マルチエージェント AI システムの構築・オーケストレーション・デプロイを行う Python フレームワークで、Agent2Agent (A2A) プロトコルにも対応しています。",
    highlights: [
      "マルチエージェントアーキテクチャの構築をサポート",
      "エージェント間通信・ツール利用・Vertex AI 連携",
      "A2A プロトコルによる異種フレームワーク間の相互運用",
    ],
    sourceUrl: "https://google.github.io/adk-docs/",
    sourceLabel: "ADK Documentation",
    icon: Bot,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "a2a-protocol",
    date: "2025-04",
    category: "ai",
    title: "Agent2Agent (A2A) プロトコルの発表",
    description:
      "異なるフレームワーク・ベンダーで構築された AI エージェント同士が通信・協力するためのオープンプロトコル。ローンチ時点で50社以上のパートナーが参加。Anthropic の MCP (Model Context Protocol) を補完する形でエージェント間相互運用に特化しています。",
    highlights: [
      "50社以上のテクノロジーパートナーが参加",
      "MCP との補完関係（ツール統合 vs エージェント間通信）",
      "フレームワークに依存しないオープン標準",
    ],
    sourceUrl: "https://blog.google/technology/google-labs/agent-to-agent-a2a-protocol/",
    sourceLabel: "Google Blog",
    icon: Network,
    color: "#4285F4",
  },
  {
    id: "vertex-ai-agent-engine",
    date: "2025-04",
    category: "ai",
    title: "Vertex AI Agent Engine の提供開始",
    description:
      "旧 Vertex AI Agent Builder を刷新・拡張した Vertex AI Agent Engine を発表。ADK やその他フレームワークで構築したAIエージェントをマネージドランタイムとしてデプロイできます。セッション管理、Google Search によるグラウンディング、エンタープライズセキュリティ機能を内蔵。",
    highlights: [
      "フルマネージドなエージェント実行環境",
      "Google Search グラウンディングによる回答精度向上",
      "エンタープライズ向けセキュリティ・セッション管理",
    ],
    sourceUrl: "https://cloud.google.com/products/agent-engine",
    sourceLabel: "Google Cloud",
    icon: Brain,
    color: "#4285F4",
  },
  {
    id: "ironwood-tpu",
    date: "2025-04",
    category: "cloud",
    title: "Ironwood TPU (第7世代) 発表",
    description:
      "大規模AI推論ワークロードに特化した第7世代 TPU「Ironwood」を発表。前世代比で大幅な電力効率改善を達成し、最大9,216チップのポッドにスケールアウト可能。AI推論のコスト効率と性能を両立する設計です。",
    highlights: [
      "AI推論に特化した設計で電力効率を大幅改善",
      "最大 9,216 チップのポッドスケール",
      "大規模言語モデルの推論コスト削減に貢献",
    ],
    sourceUrl: "https://cloud.google.com/blog/products/ai-machine-learning/ironwood-tpu-google-cloud-next-2025",
    sourceLabel: "Google Cloud Blog",
    icon: Cpu,
    color: "#34A853",
  },
  {
    id: "gemini-in-bigquery",
    date: "2025-Q1",
    category: "data",
    title: "Gemini in BigQuery が GA (一般提供) に",
    description:
      "BigQuery の Gemini 搭載機能が一般提供開始。自然言語から SQL への変換、AI によるデータ探索、SQL クエリから直接 Gemini モデルを呼び出す ML.GENERATE_TEXT 機能を利用可能に。ベクトル検索や Vertex AI との深い統合も追加されました。",
    highlights: [
      "自然言語 → SQL 自動変換で分析を高速化",
      "ML.GENERATE_TEXT で SQL から LLM を直接呼び出し",
      "ベクトル検索機能と Vertex AI パイプライン連携",
    ],
    sourceUrl: "https://cloud.google.com/bigquery/docs/generate-text",
    sourceLabel: "BigQuery Documentation",
    icon: Database,
    color: "#FBBC05",
  },
  {
    id: "security-command-center",
    date: "2025-Q1",
    category: "security",
    title: "Security Command Center Enterprise の強化",
    description:
      "Gemini を活用した脅威検出、Mandiant 脅威インテリジェンス統合、自動修復ワークフローを搭載。SIEM・SOAR・クラウドセキュリティポスチャ管理を統合した Google SecOps ブランドでの統合セキュリティ運用を実現しました。",
    highlights: [
      "Gemini による AI 脅威検出",
      "Mandiant インテリジェンスとの統合",
      "SIEM / SOAR / CSPM の統合セキュリティ運用",
    ],
    sourceUrl: "https://cloud.google.com/security/products/security-command-center",
    sourceLabel: "Google Cloud Security",
    icon: Shield,
    color: "#EA4335",
  },
  {
    id: "gke-autopilot",
    date: "2025-Q1",
    category: "devops",
    title: "GKE Autopilot の GPU / AI ワークロード強化",
    description:
      "Google Kubernetes Engine Autopilot が GPU ワークロード対応を大幅に強化。AI/ML トレーニングジョブへのネイティブサポート、GPU シェアリングの簡素化、動的ワークロードスケジューリング、コスト最適化レコメンデーション機能が追加されました。",
    highlights: [
      "GPU ワークロードの Autopilot ネイティブサポート",
      "AI/ML トレーニングジョブの簡素化",
      "マルチクラスター管理の GKE Enterprise 統合",
    ],
    sourceUrl: "https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview",
    sourceLabel: "GKE Documentation",
    icon: Box,
    color: "#5f6368",
  },
]

const RELATED_LINKS = [
  { label: "Google Cloud 公式ブログ", url: "https://cloud.google.com/blog", color: "#4285F4", desc: "製品アップデート・事例・技術情報" },
  { label: "Google Cloud リリースノート", url: "https://cloud.google.com/release-notes", color: "#34A853", desc: "全サービスの最新リリース情報" },
  { label: "Google Developers Blog", url: "https://developers.googleblog.com", color: "#FBBC05", desc: "Gemini API・開発者向け最新情報" },
  { label: "Google Cloud Next OnAir", url: "https://cloud.withgoogle.com/next", color: "#EA4335", desc: "カンファレンスセッション・録画" },
  { label: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google", color: "#4285F4", desc: "ハンズオンラボ・学習パス" },
  { label: "Google Cloud Architecture Center", url: "https://cloud.google.com/architecture", color: "#34A853", desc: "リファレンスアーキテクチャ集" },
  { label: "Google AI Studio", url: "https://aistudio.google.com", color: "#FBBC05", desc: "Gemini モデルの試用・プロトタイピング" },
  { label: "Google Cloud 料金計算ツール", url: "https://cloud.google.com/products/calculator", color: "#EA4335", desc: "サービス別コストシミュレーション" },
  { label: "Google Cloud 認定資格", url: "https://cloud.google.com/learn/certification", color: "#4285F4", desc: "認定プログラム・試験情報" },
]

export default function UpdatesPage() {
  const [activeFilter, setActiveFilter] = useState<NewsCategory | "all">("all")

  const filtered = activeFilter === "all"
    ? NEWS_ITEMS
    : NEWS_ITEMS.filter((n) => n.category === activeFilter)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-2xl gcp-console-bg text-white p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Google Cloud &amp; AI Updates</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">最新アップデート情報</h1>
          <p className="text-white/80 text-lg">
            Google Cloud・Gemini・AI エコシステムの最新ニュースとリリース情報
          </p>
        </div>
      </motion.div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEWS_ITEMS.filter((n) => n.isHighlight).map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="border-border hover:shadow-lg transition-all h-full group overflow-hidden">
                  <div className="h-1.5" style={{ backgroundColor: item.color }} />
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon size={16} style={{ color: item.color }} />
                      </div>
                      <Badge
                        className="text-[10px]"
                        style={{ backgroundColor: `${CATEGORY_CONFIG[item.category].color}15`, color: CATEGORY_CONFIG[item.category].color }}
                      >
                        {CATEGORY_CONFIG[item.category].label}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-1.5 group-hover:text-gcp-blue transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: item.color }}>
                      <span>詳しく見る</span>
                      <ArrowRight size={12} />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          )
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted-foreground" />
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          すべて ({NEWS_ITEMS.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const count = NEWS_ITEMS.filter((n) => n.category === key).length
          const CatIcon = config.icon
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key as NewsCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                activeFilter === key
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              style={activeFilter === key ? { backgroundColor: config.color } : undefined}
            >
              <CatIcon size={12} />
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* News Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

        <AnimatePresence mode="popLayout">
          <div className="space-y-5">
            {filtered.map((item, i) => {
              const Icon = item.icon
              const catConfig = CATEGORY_CONFIG[item.category]

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-2.5 top-5 w-[14px] h-[14px] rounded-full border-[3px] border-white dark:border-[#1a1b1e] z-10"
                    style={{ backgroundColor: item.color }}
                  />

                  <Card className="border-border hover:shadow-md transition-shadow overflow-hidden">
                    <div className="h-0.5" style={{ backgroundColor: item.color }} />

                    <CardContent className="pt-5 pb-5">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          className="text-[10px] font-semibold"
                          style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color, border: `1px solid ${catConfig.color}30` }}
                        >
                          {catConfig.label}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={11} />
                          {item.date}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon size={16} style={{ color: item.color }} />
                        </div>
                        <h2 className="text-base font-bold text-foreground leading-snug">{item.title}</h2>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1.5 mb-4">
                        {item.highlights.map((h, hi) => (
                          <div key={hi} className="flex items-start gap-2 text-sm">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-foreground/80">{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Source Link */}
                      <div className="pt-2 border-t border-border">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                          style={{ color: item.color }}
                        >
                          <ExternalLink size={12} />
                          {item.sourceLabel}
                          <ArrowRight size={10} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* Related Links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="border-border">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <ExternalLink size={18} className="text-gcp-blue" />
              <h2 className="text-lg font-bold text-foreground">関連リンク</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Google Cloud の公式リソース・学習教材</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RELATED_LINKS.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:shadow-sm hover:border-border/80 transition-all group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <ExternalLink size={15} style={{ color: link.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground group-hover:text-gcp-blue transition-colors leading-tight">
                      {link.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{link.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Internal Links */}
      <Card className="border-border bg-muted/30">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">このプラットフォームで体験する</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Vertex AI デモ", href: "/demos/vertex-ai", color: "#4285F4" },
              { label: "BigQuery デモ", href: "/demos/bigquery", color: "#4285F4" },
              { label: "GKE デモ", href: "/demos/gke", color: "#4285F4" },
              { label: "ADK (AI Agent) デモ", href: "/demos/adk", color: "#34A853" },
              { label: "IAM デモ", href: "/demos/iam", color: "#EA4335" },
              { label: "提案シミュレーター", href: "/proposal", color: "#FBBC05" },
              { label: "アーキテクチャパターン", href: "/architecture", color: "#34A853" },
              { label: "資格学習センター", href: "/learn", color: "#4285F4" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-[#1e1f2e] border border-border hover:shadow-sm transition-all"
                style={{ color: item.color }}
              >
                <ArrowRight size={11} />
                {item.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
