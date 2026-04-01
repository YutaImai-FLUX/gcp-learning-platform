"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
  Search,
  Calendar,
  ArrowRight,
  X,
  Heart,
  Repeat2,
  Eye,
  MessageCircle,
  Filter,
  Clock,
} from "lucide-react"

function XIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type PostCategory = "event" | "product" | "community" | "announcement"

interface XPost {
  id: string
  date: string
  category: PostCategory
  text: string
  url: string
  likes: number
  retweets: number
  replies: number
  views: number
  hasMedia?: boolean
}

const CATEGORY_CONFIG: Record<PostCategory, { label: string; color: string }> = {
  event: { label: "イベント", color: "#4285F4" },
  product: { label: "プロダクト", color: "#34A853" },
  community: { label: "コミュニティ", color: "#FBBC05" },
  announcement: { label: "お知らせ", color: "#EA4335" },
}

const X_POSTS: XPost[] = [
  {
    id: "2034412033215496418",
    date: "2026-03-19",
    category: "event",
    text: "Google Cloud Agentic AI Summit '26 Spring\n\n基調講演\nAgentic AI が加速させる、\nビジネス変革の最前線！\n\n生成 AI が自律型 AI エージェント「Agentic AI」へ進化。「Gemini Enterprise」が自律的なワークフローを実現し、ビジネスの現場で具体的な成果を導き出します。\n\nhttps://cloudonair.withgoogle.com/events/agentic-ai-summit-26-spring",
    url: "https://x.com/googlecloud_jp/status/2034412033215496418",
    likes: 287,
    retweets: 145,
    replies: 32,
    views: 195000,
    hasMedia: true,
  },
  {
    id: "2034117592474919195",
    date: "2026-03-18",
    category: "event",
    text: "いよいよ明日開催！\nAgentic AI Summit '26 Spring\n\nhttps://cloudonair.withgoogle.com/events/agentic-ai-summit-26-spring\n\n基調講演は 10 時から始まります。\n進化を遂げる Agentic AI のビジネス活用や、エージェント開発方法を余すことなくお伝えします！\n\n会場へお越しの方も、オンライン参加の方も、\nお楽しみに\n\n#gcai_agent",
    url: "https://x.com/googlecloud_jp/status/2034117592474919195",
    likes: 142,
    retweets: 68,
    replies: 12,
    views: 78800,
    hasMedia: true,
  },
  {
    id: "2026462146406867107",
    date: "2026-03-12",
    category: "event",
    text: "Agentic AI Summit '26 Spring\n2026 年 3 月 19 日（木） 10 時から開催\n\n次世代 AI エージェントの展望\nビジネス変革の最前線\n業界をリードする最新事例\n\n最新の AI を体感できる機会をお見逃しなく！\n会場でお会いしましょう",
    url: "https://x.com/googlecloud_jp/status/2026462146406867107",
    likes: 312,
    retweets: 156,
    replies: 24,
    views: 788400,
    hasMedia: true,
  },
  {
    id: "2024401071888556144",
    date: "2026-02-19",
    category: "product",
    text: "Google Kubernetes Engine（GKE）\nノードプールの同時自動作成機能をリリース\n\nhttps://cloud.google.com/kubernetes-engine/docs/release-notes\n\nシステムが複数のオペレーションを同時に処理できるようになり、より迅速にクラスタをデプロイして、さまざまなノードタイプにスケールアウト。\n\n#GKE #GoogleCloud",
    url: "https://x.com/googlecloud_jp/status/2024401071888556144",
    likes: 98,
    retweets: 45,
    replies: 8,
    views: 42300,
    hasMedia: true,
  },
  {
    id: "2021144615991091609",
    date: "2026-02-10",
    category: "event",
    text: "Google Cloud Next Tokyo 26\nセッション登壇者を募集中！\n\n応募締切：3 月 5 日（木）17:00\n\n7/30-31 開催の Next Tokyo に登壇し、皆さまの企業での Google Cloud や Google Workspace の活用を披露しませんか？\nたくさんのご応募お待ちしております！",
    url: "https://x.com/googlecloud_jp/status/2021144615991091609",
    likes: 203,
    retweets: 112,
    replies: 18,
    views: 156000,
    hasMedia: true,
  },
  {
    id: "2019201807143034962",
    date: "2026-02-05",
    category: "event",
    text: "Next Tokyo 26 セッション登壇者、募集中\n\nhttps://cloudonair.withgoogle.com/events/next-tokyo-26-cfp\n\n#GoogleCloudNext の主役は、第一線で活躍するエンジニア、そしてビジネス リーダーの皆さまです。\n\n生成 AI 活用事例を Next Tokyo に登壇し、発信しませんか？\n期日は 2026 年 3 月 5 日（木）17 時まで。",
    url: "https://x.com/googlecloud_jp/status/2019201807143034962",
    likes: 167,
    retweets: 89,
    replies: 14,
    views: 120500,
  },
  {
    id: "2014186258021376101",
    date: "2026-01-28",
    category: "event",
    text: "3/19 開催\nAgentic AI Summit '26 Spring\n\nハイブリッド開催\nTAKANAWA GATEWAY Convention Center / オンライン\n\n最新の Agentic AI 顧客事例をご紹介！技術者向けには、Gemini のポテンシャルを最大限に引き出す、エージェント開発の最前線をお伝えします。",
    url: "https://x.com/googlecloud_jp/status/2014186258021376101",
    likes: 245,
    retweets: 134,
    replies: 22,
    views: 198000,
    hasMedia: true,
  },
  {
    id: "2013091546577416604",
    date: "2026-01-24",
    category: "announcement",
    text: "＼＼締切延長／／\nGoogle Cloud 生成 AI 事例アワード\n\n応募期間：2026 年 1 月 30 日（金）まで\n\nファイナリストの皆様には、3/19 開催「Agentic AI Summit '26 Spring」に登壇いただきます。\n\n新時代を先駆ける企業事例をぜひお寄せください！",
    url: "https://x.com/googlecloud_jp/status/2013091546577416604",
    likes: 178,
    retweets: 95,
    replies: 16,
    views: 132000,
  },
  {
    id: "2008335207099752618",
    date: "2026-01-10",
    category: "announcement",
    text: "第 5 回生成 AI 事例アワード\n\n募集期間：2026 年 1 月 23 日（金）まで\n\nビジネスを発展させる最先端事例から、アイデアあふれる業務効率化まで幅広く募集中\n\nファイナリスト企業には、3/19 開催「Agentic AI Summit '26 Spring」に登壇しピッチを行っていただきます！",
    url: "https://x.com/googlecloud_jp/status/2008335207099752618",
    likes: 156,
    retweets: 87,
    replies: 10,
    views: 98500,
    hasMedia: true,
  },
]

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
  return `${month}/${day}（${weekdays[d.getDay()]}）`
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function XPostsPage() {
  const [activeFilter, setActiveFilter] = useState<PostCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    let items = X_POSTS
    if (activeFilter !== "all") {
      items = items.filter((p) => p.category === activeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter((p) => p.text.toLowerCase().includes(q))
    }
    return items
  }, [activeFilter, searchQuery])

  const hasActiveFilters = activeFilter !== "all" || searchQuery.trim() !== ""

  const clearAllFilters = () => {
    setActiveFilter("all")
    setSearchQuery("")
  }

  // Stats
  const totalViews = X_POSTS.reduce((sum, p) => sum + p.views, 0)
  const totalLikes = X_POSTS.reduce((sum, p) => sum + p.likes, 0)
  const latestDate = X_POSTS.length > 0 ? X_POSTS[0].date : ""

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Hero */}
      <motion.div variants={stagger.item}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1DA1F2] via-[#1a8cd8] to-[#0d6ebd] text-white px-6 py-8 md:px-8 md:py-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <XIcon size={20} className="text-white/80" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">@googlecloud_jp on X</span>
            </div>
            <h1 className="font-display heading-display text-2xl sm:text-3xl mb-2">X 投稿まとめ</h1>
            <p className="text-white/60 text-sm md:text-base">
              Google Cloud Japan 公式 X アカウントの最新投稿をまとめてお届け
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                毎朝 9:00 自動更新
              </span>
              {latestDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  最終取得: {formatDisplayDate(latestDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="py-3 px-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">投稿数</div>
            <div className="font-display text-xl font-bold">{X_POSTS.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="py-3 px-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">総閲覧数</div>
            <div className="font-display text-xl font-bold flex items-center gap-1">
              <Eye size={14} className="text-muted-foreground" />
              {formatNumber(totalViews)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="py-3 px-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">総いいね</div>
            <div className="font-display text-xl font-bold flex items-center gap-1">
              <Heart size={14} className="text-[#F91880]" />
              {formatNumber(totalLikes)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="py-3 px-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">最新投稿</div>
            <div className="font-display text-base font-bold">
              {latestDate ? formatDisplayDate(latestDate) : "-"}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search + Filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <motion.div variants={stagger.item}>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="投稿を検索（Next Tokyo, GKE, Agentic AI...）"
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
            すべて ({X_POSTS.length})
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const count = X_POSTS.filter((p) => p.category === key).length
            if (count === 0) return null
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key as PostCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === key
                    ? "text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                style={activeFilter === key ? { backgroundColor: config.color } : undefined}
              >
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
            <button
              onClick={clearAllFilters}
              className="text-primary hover:underline ml-1"
            >
              すべてクリア
            </button>
          </motion.div>
        )}
      </div>

      {/* Posts Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filtered.map((post, i) => {
              const catConfig = CATEGORY_CONFIG[post.category]

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-5 w-[14px] h-[14px] rounded-full border-[3px] border-white dark:border-[#1c1f26] bg-[#1DA1F2] z-10" />

                  <Card className="border-border hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="h-0.5 bg-[#1DA1F2]" />

                    <CardContent className="pt-5 pb-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                            <XIcon size={14} className="text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground flex items-center gap-1">
                              Google Cloud Japan
                              <svg viewBox="0 0 22 22" className="w-4 h-4 text-[#1DA1F2]" fill="currentColor">
                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.607-.274 1.264-.144 1.897.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                              </svg>
                            </div>
                            <div className="text-[11px] text-muted-foreground">@googlecloud_jp</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className="text-[10px] font-semibold"
                            style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color, border: `1px solid ${catConfig.color}30` }}
                          >
                            {catConfig.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDisplayDate(post.date)}
                          </span>
                        </div>
                      </div>

                      {/* Tweet Text */}
                      <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-4">
                        {post.text.split(/(https?:\/\/\S+|#\S+)/g).map((part, pi) => {
                          if (part.match(/^https?:\/\//)) {
                            return (
                              <a
                                key={pi}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1DA1F2] hover:underline break-all"
                              >
                                {part}
                              </a>
                            )
                          }
                          if (part.match(/^#/)) {
                            return (
                              <span key={pi} className="text-[#1DA1F2] font-medium">
                                {part}
                              </span>
                            )
                          }
                          return part
                        })}
                      </div>

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-xs hover:text-[#1DA1F2] transition-colors">
                            <MessageCircle size={14} />
                            {formatNumber(post.replies)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs hover:text-[#00BA7C] transition-colors">
                            <Repeat2 size={14} />
                            {formatNumber(post.retweets)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs hover:text-[#F91880] transition-colors">
                            <Heart size={14} />
                            {formatNumber(post.likes)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs">
                            <Eye size={14} />
                            {formatNumber(post.views)}
                          </span>
                        </div>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1DA1F2] hover:underline"
                        >
                          <ExternalLink size={12} />
                          X で見る
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
                該当する投稿が見つかりません
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* Footer: Link to X account */}
      <motion.div variants={stagger.item}>
        <Card className="border-border bg-muted/30">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                  <XIcon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Google Cloud Japan</div>
                  <div className="text-xs text-muted-foreground">@googlecloud_jp をフォローして最新情報をチェック</div>
                </div>
              </div>
              <a
                href="https://x.com/googlecloud_jp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA1F2] text-white text-sm font-bold hover:bg-[#1a8cd8] transition-colors"
              >
                <XIcon size={14} />
                フォローする
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
