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
    id: "gke-kubecon-eu-2026",
    date: "2026-03",
    category: "devops",
    title: "GKE が KubeCon EU 2026 で TPU DRA オープンソース化＆AI適合性認定を発表",
    description:
      "アムステルダムで開催された KubeCon + CloudNativeCon Europe 2026（3月23〜26日）で、Google が GKE の重要な発表を行いました。TPU 向け DRA（Dynamic Resource Allocation）ドライバーをオープンソース化し、GKE が AI適合プラットフォームとして認定。NVIDIA とも連携して GPU DRA ドライバーの CNCF への寄贈を共同推進し、AI ワークロードのポータビリティ向上に貢献しました。",
    highlights: [
      "TPU 向け DRA（動的リソース割り当て）ドライバーをオープンソース化し、AI ワークロードのポータビリティを促進",
      "GKE が AI 適合プラットフォーム（AI-Conformant Platform）として認定、モデルやAIツールの環境横断移植が容易に",
      "Kubernetes Agent Sandbox と GKE Pod Snapshots でエージェント型 AI ワークロードの安全性・起動速度を大幅改善",
    ],
    sourceUrl: "https://cloud.google.com/blog/products/containers-kubernetes/gke-and-oss-innovation-at-kubecon-eu-2026",
    sourceLabel: "Google Cloud Blog",
    icon: Network,
    color: "#5f6368",
  },
  {
    id: "gemini-code-assist-march2026",
    date: "2026-03",
    category: "ai",
    title: "Gemini Code Assist に /deploy コマンドと Gemini 3.1 Pro サポートが追加",
    description:
      "Gemini Code Assist が大幅アップデート。VS Code と IntelliJ にて Gemini 3.1 Pro と Gemini 3.0 Flash がプレビュー利用可能に。エージェントモードに新しい /deploy コマンドが追加され、Cloud Run へのデプロイをコンテナビルドから構成まで全自動化。GitHub での永続メモリ機能により、過去のインタラクションを活用した継続的な支援が可能になりました。",
    highlights: [
      "VS Code・IntelliJ で Gemini 3.1 Pro / 3.0 Flash をエージェントモード・チャット・コード生成に利用可能 (Preview)",
      "/deploy コマンドでビルド・コンテナ化・プッシュ・構成を全自動化して Cloud Run に直接デプロイ",
      "GitHub での永続メモリ機能が追加され、以前のインタラクション情報を将来のコンテキストに活用",
    ],
    sourceUrl: "https://developers.google.com/gemini-code-assist/resources/release-notes",
    sourceLabel: "Gemini Code Assist Release Notes",
    icon: Bot,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "scc-ai-protection-ga-march2026",
    date: "2026-03",
    category: "security",
    title: "Security Command Center「AI Protection」が GA 昇格＆Model Armor の MCP サーバー対応",
    description:
      "Security Command Center の AI Protection 機能が Enterprise ティアで一般提供（GA）開始。AI ワークロードに対する包括的なセキュリティ保護を提供します。また、Google管理の MCP（Model Context Protocol）サーバーと Vertex AI モデルへのトラフィックにセーフティフィルターを適用する Model Armor のフロア設定がプレビュー公開されました。",
    highlights: [
      "AI Protection が Security Command Center Enterprise ティアで GA、Premium ティアでもプレビュー提供",
      "Model Armor のフロア設定で Google 管理 MCP サーバーへのトラフィックにベースラインセキュリティフィルターを適用 (Preview)",
      "Risk Engine が強化されたヒューリスティクスでデフォルト高価値リソースの識別精度を向上",
    ],
    sourceUrl: "https://cloud.google.com/security-command-center/docs/release-notes",
    sourceLabel: "Security Command Center Release Notes",
    icon: Shield,
    color: "#EA4335",
  },
  {
    id: "bigquery-global-query-advanced-runtime-march2026",
    date: "2026-03",
    category: "data",
    title: "BigQuery グローバルクエリ (Preview) と高度なランタイム GA が追加",
    description:
      "BigQuery に複数リージョンのデータを単一クエリで横断参照できる「グローバルクエリ」がプレビューリリース。また、クエリ実行時間とスロット使用量を改善する「BigQuery 高度なランタイム」が一般提供（GA）に昇格。誤って削除したデータセットをタイムトラベルウィンドウ内で復元できる「データセット復元（Undelete）」も GA になりました。",
    highlights: [
      "グローバルクエリで複数リージョンにまたがるデータを単一クエリで参照可能 (Preview)",
      "BigQuery 高度なランタイムでクエリ実行速度とスロット効率が向上 (GA)",
      "削除データセットのタイムトラベル復元（Undelete Dataset）が GA に",
    ],
    sourceUrl: "https://cloud.google.com/bigquery/docs/release-notes",
    sourceLabel: "BigQuery Release Notes",
    icon: Database,
    color: "#FBBC05",
  },
  {
    id: "gemini-3-1-flash-lite-preview",
    date: "2026-03",
    category: "ai",
    title: "Gemini 3.1 Flash-Lite プレビュー公開 & Flash Live リアルタイム音声モデル登場",
    description:
      "Gemini 3 シリーズ初の軽量モデル「Gemini 3.1 Flash-Lite」がプレビュー公開。低コスト・高速推論を実現し、大量処理タスクに最適化されています。同時に、リアルタイム音声対話向けの「Gemini 3.1 Flash Live」もリリースされ、音声AIアプリケーション開発が加速しました。",
    highlights: [
      "Gemini 3.1 Flash-Lite がプレビュー公開、Gemini 3シリーズの低コストモデルとして位置づけ",
      "リアルタイム音声to音声対話向け Gemini 3.1 Flash Live が新登場",
      "Computer Use ツールサポートが gemini-3-pro-preview と gemini-3-flash-preview に追加",
    ],
    sourceUrl: "https://ai.google.dev/gemini-api/docs/changelog",
    sourceLabel: "Gemini API Release Notes",
    icon: Sparkles,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "lyria-3-music-generation",
    date: "2026-03",
    category: "ai",
    title: "Lyria 3 音楽生成モデル公開 -- テキスト・画像から高品質音楽を生成",
    description:
      "Google が Lyria 3 音楽生成モデルをプレビューリリース。テキストと画像を入力として 48kHz ステレオの高品質音楽を生成可能。30秒クリップ用の「lyria-3-clip-preview」とフルレングス曲用の「lyria-3-pro-preview」の2モデルが公開されました。",
    highlights: [
      "30秒クリップ生成 (lyria-3-clip-preview) とフルソング生成 (lyria-3-pro-preview) の2モデルを提供",
      "テキスト・画像入力から 48kHz ステレオ高品質音声を生成",
      "Lyria 3 Pro で最長3分のトラック作成が可能",
    ],
    sourceUrl: "https://ai.google.dev/gemini-api/docs/changelog",
    sourceLabel: "Gemini API Release Notes",
    icon: Brain,
    color: "#4285F4",
  },
  {
    id: "gemini-workspace-march-2026",
    date: "2026-03",
    category: "ai",
    title: "Gemini が Google Workspace を大幅強化 -- Drive・Docs・Sheets・Slides に AI 概要機能",
    description:
      "Gemini が Google Docs・Sheets・Slides・Drive において大幅アップグレード。ファイル・メール・Web の情報を統合参照する個人化機能がベータ公開。Google Drive では AI 概要が検索結果上部に表示され、ファイル内容を引用付きで要約します。",
    highlights: [
      "Google Drive の AI 概要機能で検索結果を引用付き自動要約",
      "Docs・Sheets・Slides でファイル・メール・Web の情報を横断参照",
      "Google AI Ultra/Pro サブスクライバー向けにまずグローバルでベータ提供開始",
    ],
    sourceUrl: "https://blog.google/products-and-platforms/products/workspace/gemini-workspace-updates-march-2026/",
    sourceLabel: "Google Blog",
    icon: Sparkles,
    color: "#34A853",
    isHighlight: true,
  },
  {
    id: "compute-engine-instance-flexibility-ga",
    date: "2026-03",
    category: "cloud",
    title: "Compute Engine「Instance Flexibility」GA & Hyperdisk スループット倍増",
    description:
      "Compute Engine の Instance Flexibility が一般提供（GA）開始。複数の適切なマシンタイプを指定すると、リージョン内のキャパシティ・クォータに基づいて VM を自動プロビジョニングします。また Hyperdisk Balanced High Availability の最大スループットが 1,200 MiB/s から 2,400 MiB/s に倍増しました。",
    highlights: [
      "複数マシンタイプ指定によるキャパシティ自動選択プロビジョニングが GA",
      "Hyperdisk Balanced High Availability の最大スループットが 2,400 MiB/s に倍増",
      "Compute Engine アルファ API がプロジェクトレベルでセルフサービス GA",
    ],
    sourceUrl: "https://cloud.google.com/release-notes",
    sourceLabel: "Google Cloud Release Notes",
    icon: Cpu,
    color: "#34A853",
  },
  {
    id: "dataflow-parallel-update",
    date: "2026-03",
    category: "data",
    title: "Dataflow ストリーミングジョブの自動並列アップデートワークフローをサポート",
    description:
      "Dataflow がストリーミングジョブ向けの自動並列アップデートワークフローをリリース。新しい置き換えジョブを既存ジョブと並行して起動し、完了後に旧ジョブを自動ドレインすることで、更新時の中断を最小化します。",
    highlights: [
      "新ジョブを並行起動→自動ドレインによるゼロダウンタイム更新を実現",
      "ストリーミングジョブ更新時のデータ処理中断を大幅に削減",
      "手動更新と比較してオペレーション負荷を大幅軽減",
    ],
    sourceUrl: "https://cloud.google.com/release-notes",
    sourceLabel: "Google Cloud Release Notes",
    icon: Database,
    color: "#FBBC05",
  },
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">最新アップデート情報</h1>
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
