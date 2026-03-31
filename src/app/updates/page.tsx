"use client"

import { useState, useMemo, useRef, useCallback } from "react"
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
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UpdatesCalendar } from "@/components/updates/UpdatesCalendar"

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
    id: "gemini-3-1-flash-image-preview",
    date: "2026-03-28",
    category: "ai",
    title: "Gemini 3.1 Flash Image がパブリックプレビュー -- テキストから高品質画像を低レイテンシで生成",
    description:
      "Google が Vertex AI で Gemini 3.1 Flash Image（gemini-3.1-flash-image）をパブリックプレビューリリース。改善された価格と低レイテンシで高品質な画像生成を実現し、Google はテキストから画像を生成する際の推奨モデルとして位置づけています。",
    highlights: [
      "gemini-3.1-flash-image が Vertex AI でパブリックプレビュー公開、Google 推奨の画像生成モデルに",
      "従来モデルより改善された価格と低レイテンシで高品質な画像生成を提供",
      "テキストプロンプトから直接高品質画像を生成できる Gemini 3.1 シリーズ初の専用画像モデル",
    ],
    sourceUrl: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/release-notes",
    sourceLabel: "Vertex AI Release Notes",
    icon: Sparkles,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "nvidia-vera-rubin-nvl72-google-cloud",
    date: "2026-03-30",
    category: "cloud",
    title: "Google Cloud が NVIDIA Vera Rubin NVL72 を H2 2026 に提供予定 -- AI Hypercomputer 基盤を刷新",
    description:
      "NVIDIA GTC 2026（3月30日）で、Google Cloud CEO Thomas Kurian が NVIDIA Vera Rubin NVL72 ラックスケールシステムを H2 2026 に提供すると発表。A4 Ultra インスタンスファミリーとして Q2 2026 プレビューで登場予定。",
    highlights: [
      "NVIDIA Vera Rubin NVL72（72 GPU・HBM4 搭載）を H2 2026 に提供、Blackwell 比5倍の推論性能",
      "A4 Ultra インスタンスファミリーが Q2 2026 プレビューで us-central1・europe-west4 に登場",
      "AI Hypercomputer が TPU と CUDA ベース GPU のヘテロジニアスプラットフォームに進化",
    ],
    sourceUrl: "https://cloud.google.com/blog/products/compute/google-cloud-ai-infrastructure-at-nvidia-gtc-2026",
    sourceLabel: "Google Cloud Blog",
    icon: Cpu,
    color: "#34A853",
    isHighlight: true,
  },
  {
    id: "gemini-cli-march25-2026",
    date: "2026-03-25",
    category: "devops",
    title: "Gemini CLI 大型アップデート -- キーボードショートカット、Vim サポート、A2A エージェント連携強化",
    description:
      "3月25日のナイトリービルドで Gemini CLI が大幅アップデートを実施。カスタマイズ可能なキーボードショートカット、リッチな Vim・キーバインドサポート、安全なリトライ機構、改善されたテレメトリーを搭載。",
    highlights: [
      "カスタマイズ可能なキーボードショートカットとリッチな Vim・キーバインドサポートを追加",
      "リモートエージェント・ブラウザ操作・A2A（Agent-to-Agent）連携機能を強化",
      "ポリシーハンドリング改善、テレメトリー強化、コア/CLI パフォーマンス全般を向上",
    ],
    sourceUrl: "https://releasebot.io/updates/google/gemini-cli",
    sourceLabel: "Gemini CLI Release Notes",
    icon: Bot,
    color: "#5f6368",
  },
  {
    id: "bigquery-data-insights-agent-ga",
    date: "2026-03-24",
    category: "data",
    title: "BigQuery Data Insights Agent が GA（許可リスト制）＆カスタム用語集が Preview に",
    description:
      "BigQuery の Data Insights Agent が許可リスト制で一般提供（GA）開始。BigQuery データから自動的にインサイトを提供する Made by Google エージェントです。カスタム用語集（Custom Glossary Terms）もプレビュー公開。",
    highlights: [
      "Data Insights Agent が GA（許可リスト制）、BigQuery データからインサイトを自動生成",
      "カスタム用語集（Custom Glossary Terms）でエージェントのビジネス用語解釈精度が向上 (Preview)",
      "Gemini 搭載 BigQuery Studio アシスタントがリソース検出・クエリスケジューリング・障害分析に対応",
    ],
    sourceUrl: "https://docs.cloud.google.com/bigquery/docs/release-notes",
    sourceLabel: "BigQuery Release Notes",
    icon: Database,
    color: "#FBBC05",
  },
  {
    id: "gemini-drop-personal-intelligence-march2026",
    date: "2026-03-26",
    category: "ai",
    title: "Gemini アプリ「March Drop」-- Personal Intelligence が米国全ユーザー無料に＆他社 AI からの記憶移行",
    description:
      "Gemini アプリの March Drop で、Gmail・写真・YouTube を横断する Personal Intelligence 機能が米国の全 Gemini ユーザーに無料開放。他社 AI プロバイダーからの会話履歴・AIメモリ転送機能も追加。",
    highlights: [
      "Personal Intelligence が米国の全 Gemini ユーザーに無料提供、Gmail・Photos・YouTube を横断参照",
      "他社 AI プロバイダーの会話履歴・メモリを数クリックで Gemini に転送可能",
      "Lyria 3 Pro で最長3分の楽曲生成と写真・アイデアからの高品質アンセム作成が可能に",
    ],
    sourceUrl: "https://blog.google/innovation-and-ai/products/gemini-app/gemini-drop-updates-march-2026/",
    sourceLabel: "Google Blog",
    icon: Sparkles,
    color: "#4285F4",
    isHighlight: true,
  },
  {
    id: "gke-kubecon-eu-2026",
    date: "2026-03-23",
    category: "devops",
    title: "GKE が KubeCon EU 2026 で TPU DRA オープンソース化＆AI適合性認定を発表",
    description:
      "KubeCon + CloudNativeCon Europe 2026（3月23〜26日）で、Google が GKE の TPU 向け DRA（Dynamic Resource Allocation）ドライバーをオープンソース化。GKE が AI適合プラットフォームとして認定。",
    highlights: [
      "TPU 向け DRA ドライバーをオープンソース化し、AI ワークロードのポータビリティを促進",
      "GKE が AI 適合プラットフォーム（AI-Conformant Platform）として認定",
      "Kubernetes Agent Sandbox と GKE Pod Snapshots でエージェント型 AI ワークロードの安全性・起動速度を改善",
    ],
    sourceUrl: "https://cloud.google.com/blog/products/containers-kubernetes/gke-and-oss-innovation-at-kubecon-eu-2026",
    sourceLabel: "Google Cloud Blog",
    icon: Network,
    color: "#5f6368",
  },
  {
    id: "gemini-code-assist-march2026",
    date: "2026-03-20",
    category: "ai",
    title: "Gemini Code Assist に /deploy コマンドと Gemini 3.1 Pro サポートが追加",
    description:
      "Gemini Code Assist が大幅アップデート。VS Code と IntelliJ にて Gemini 3.1 Pro と Gemini 3.0 Flash がプレビュー利用可能に。エージェントモードに /deploy コマンドが追加され、Cloud Run へのデプロイを全自動化。",
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
    date: "2026-03-19",
    category: "security",
    title: "Security Command Center「AI Protection」が GA 昇格＆Model Armor の MCP サーバー対応",
    description:
      "Security Command Center の AI Protection 機能が Enterprise ティアで一般提供（GA）開始。Model Armor のフロア設定で Google 管理 MCP サーバーへのトラフィックにセーフティフィルターを適用。",
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
    date: "2026-03-18",
    category: "data",
    title: "BigQuery グローバルクエリ (Preview) と高度なランタイム GA が追加",
    description:
      "BigQuery に複数リージョンのデータを単一クエリで横断参照できる「グローバルクエリ」がプレビューリリース。高度なランタイムが GA に昇格。データセット復元（Undelete）も GA。",
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
    date: "2026-03-14",
    category: "ai",
    title: "Gemini 3.1 Flash-Lite プレビュー公開 & Flash Live リアルタイム音声モデル登場",
    description:
      "Gemini 3 シリーズ初の軽量モデル「Gemini 3.1 Flash-Lite」がプレビュー公開。低コスト・高速推論を実現。リアルタイム音声対話向けの「Gemini 3.1 Flash Live」も同時リリース。",
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
    date: "2026-03-14",
    category: "ai",
    title: "Lyria 3 音楽生成モデル公開 -- テキスト・画像から高品質音楽を生成",
    description:
      "Google が Lyria 3 音楽生成モデルをプレビューリリース。テキストと画像を入力として 48kHz ステレオの高品質音楽を生成可能。30秒クリップ用と最長3分のフルレングス曲用の2モデルを提供。",
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
    date: "2026-03-12",
    category: "ai",
    title: "Gemini が Google Workspace を大幅強化 -- Drive・Docs・Sheets・Slides に AI 概要機能",
    description:
      "Gemini が Google Docs・Sheets・Slides・Drive において大幅アップグレード。ファイル・メール・Web の情報を統合参照する個人化機能がベータ公開。Google Drive では AI 概要が検索結果上部に表示。",
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
    date: "2026-03-10",
    category: "cloud",
    title: "Compute Engine「Instance Flexibility」GA & Hyperdisk スループット倍増",
    description:
      "Compute Engine の Instance Flexibility が一般提供（GA）開始。複数マシンタイプを指定して自動プロビジョニング。Hyperdisk Balanced High Availability の最大スループットが 2,400 MiB/s に倍増。",
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
    date: "2026-03-07",
    category: "data",
    title: "Dataflow ストリーミングジョブの自動並列アップデートワークフローをサポート",
    description:
      "Dataflow がストリーミングジョブ向けの自動並列アップデートワークフローをリリース。新しい置き換えジョブを既存ジョブと並行して起動し、完了後に旧ジョブを自動ドレイン。",
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
    date: "2026-03-05",
    category: "ai",
    title: "Gemini 3.1 Pro プレビュー公開 -- 強化された推論とエージェント機能",
    description:
      "Google が Gemini 3.1 Pro をプレビューリリース。複雑な問題解決に特化した最先端の推論モデルで、Vertex AI・Google AI Studio・Gemini CLI からアクセス可能。",
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

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
  return `${month}/${day}（${weekdays[d.getDay()]}）`
}

const SLIDER_VISIBLE_COUNT = 3

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function UpdatesPage() {
  const [activeFilter, setActiveFilter] = useState<NewsCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Slider state
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPage, setSliderPage] = useState(0)
  const highlightItems = useMemo(() => NEWS_ITEMS.filter((n) => n.isHighlight), [])

  const scrollSlider = useCallback((direction: "left" | "right") => {
    const el = sliderRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / highlightItems.length
    const scrollAmount = cardWidth * SLIDER_VISIBLE_COUNT
    el.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount })
  }, [highlightItems.length])

  const scrollToPage = useCallback((page: number) => {
    const el = sliderRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / highlightItems.length
    el.scrollTo({ left: page * cardWidth * SLIDER_VISIBLE_COUNT })
  }, [highlightItems.length])

  const handleSliderScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / highlightItems.length
    const page = Math.round(el.scrollLeft / (cardWidth * SLIDER_VISIBLE_COUNT))
    setSliderPage(page)
  }, [highlightItems.length])

  const updateDates = useMemo(() => NEWS_ITEMS.map((n) => n.date), [])

  const filtered = useMemo(() => {
    let items = NEWS_ITEMS
    if (activeFilter !== "all") {
      items = items.filter((n) => n.category === activeFilter)
    }
    if (selectedDate) {
      items = items.filter((n) => n.date === selectedDate)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.highlights.some((h) => h.toLowerCase().includes(q))
      )
    }
    return items
  }, [activeFilter, selectedDate, searchQuery])

  const hasActiveFilters = activeFilter !== "all" || selectedDate !== null || searchQuery.trim() !== ""

  const clearAllFilters = () => {
    setActiveFilter("all")
    setSelectedDate(null)
    setSearchQuery("")
  }

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Hero */}
      <motion.div variants={stagger.item}>
        <div className="relative rounded-2xl overflow-hidden gcp-console-bg text-white px-6 py-8 md:px-8 md:py-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-white/80" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Google Cloud &amp; AI Updates</span>
            </div>
            <h1 className="font-display heading-display text-2xl sm:text-3xl mb-2">最新アップデート情報</h1>
            <p className="text-white/60 text-sm md:text-base">
              Google Cloud・Gemini・AI エコシステムの最新ニュースとリリース情報
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search + Filters + Calendar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main content column */}
        <div className="space-y-5 min-w-0">
          {/* Search bar */}
          <motion.div variants={stagger.item}>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワードで検索（Gemini, BigQuery, GKE...）"
                className="pl-10 h-10 bg-card border-border text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category filter */}
          <motion.div variants={stagger.item} className="flex items-center gap-2 flex-wrap">
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
          </motion.div>

          {/* Active filter summary */}
          {hasActiveFilters && (
            <motion.div variants={stagger.item} className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">
                <span className="font-display font-bold text-foreground">{filtered.length}</span> 件の結果
              </span>
              {selectedDate && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Calendar size={10} />
                  {formatDisplayDate(selectedDate)}
                  <button onClick={() => setSelectedDate(null)} className="ml-0.5 hover:text-foreground">
                    <X size={10} />
                  </button>
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-primary hover:underline ml-1"
              >
                すべてクリア
              </button>
            </motion.div>
          )}

          {/* Highlight Slider (only when no filters active) */}
          {!hasActiveFilters && (
            <motion.div variants={stagger.item} className="relative">
              {/* Header + nav arrows */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <span className="font-display text-sm font-bold text-foreground">注目のアップデート</span>
                  <span className="text-[10px] text-muted-foreground">({highlightItems.length})</span>
                </div>
                <div className="flex items-center gap-1.5 select-none">
                  {/* Dot indicators */}
                  <div className="flex items-center gap-1 mr-2">
                    {Array.from({ length: Math.ceil(highlightItems.length / SLIDER_VISIBLE_COUNT) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToPage(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all outline-none ${
                          sliderPage === i ? "bg-primary w-4" : "bg-border hover:bg-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => scrollSlider("left")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-default"
                    disabled={sliderPage === 0}
                  >
                    <ChevronLeft size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => scrollSlider("right")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-default"
                    disabled={sliderPage >= Math.ceil(highlightItems.length / SLIDER_VISIBLE_COUNT) - 1}
                  >
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Scrollable track */}
              <div
                ref={sliderRef}
                onScroll={handleSliderScroll}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
                style={{ scrollBehavior: "smooth" }}
              >
                {highlightItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.id}
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block flex-none snap-start"
                      style={{ width: `calc((100% - ${(SLIDER_VISIBLE_COUNT - 1) * 16}px) / ${SLIDER_VISIBLE_COUNT})` }}
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
                          <h3 className="font-display font-bold text-sm text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Calendar size={10} />
                              {formatDisplayDate(item.date)}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: item.color }}>
                              詳しく見る <ArrowRight size={12} />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

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
                        className="absolute left-2.5 top-5 w-[14px] h-[14px] rounded-full border-[3px] border-white dark:border-[#1c1f26] z-10"
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
                              {formatDisplayDate(item.date)}
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
                            <h2 className="font-display text-base font-bold text-foreground leading-snug">{item.title}</h2>
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

                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    該当するアップデートが見つかりません
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Calendar + Related Links */}
        <div className="space-y-5">
          <motion.div variants={stagger.item}>
            <UpdatesCalendar
              updateDates={updateDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </motion.div>

          {/* Related Links (compact sidebar version) */}
          <motion.div variants={stagger.item}>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink size={14} className="text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">関連リンク</h3>
              </div>
              <div className="space-y-1">
                {RELATED_LINKS.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div
                      className="w-1 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: link.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {link.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Platform links */}
          <motion.div variants={stagger.item}>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search size={14} className="text-muted-foreground" />
                <h3 className="text-xs font-bold text-foreground">このプラットフォームで体験</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Vertex AI", href: "/demos/vertex-ai", color: "#4285F4" },
                  { label: "BigQuery", href: "/demos/bigquery", color: "#4285F4" },
                  { label: "GKE", href: "/demos/gke", color: "#4285F4" },
                  { label: "ADK (AI Agent)", href: "/demos/adk", color: "#34A853" },
                  { label: "IAM", href: "/demos/iam", color: "#EA4335" },
                  { label: "提案シミュレーター", href: "/proposal", color: "#FBBC05" },
                  { label: "資格学習", href: "/learn", color: "#4285F4" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-card border border-border hover:shadow-sm transition-all"
                    style={{ color: item.color }}
                  >
                    <ArrowRight size={9} />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
