"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Play, Clock, Database, ChevronRight, AlertCircle, Bookmark, History, Table2, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DemoShell } from "@/components/demos/DemoShell"
import { BQ_DEMO_DATASETS, BQ_SAMPLE_QUERIES } from "@/lib/data/demo-data"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

type Tab = "editor" | "schema" | "jobs"

interface QueryHistoryEntry {
  query: string
  duration: string
  bytes: string
  rows: number
  cost: string
  ts: string
}

const SCHEMA_DATA: Record<string, { field: string; type: string; mode: string; description: string }[]> = {
  "ecommerce.orders": [
    { field: "order_id", type: "INTEGER", mode: "REQUIRED", description: "注文の一意識別子" },
    { field: "user_id", type: "INTEGER", mode: "NULLABLE", description: "注文者のユーザーID" },
    { field: "product_id", type: "INTEGER", mode: "NULLABLE", description: "注文された商品のID" },
    { field: "amount", type: "FLOAT", mode: "NULLABLE", description: "注文金額（円）" },
    { field: "status", type: "STRING", mode: "NULLABLE", description: "注文ステータス (COMPLETED/PENDING/CANCELLED)" },
    { field: "created_at", type: "TIMESTAMP", mode: "REQUIRED", description: "注文作成日時 (UTC)" },
  ],
  "ecommerce.users": [
    { field: "user_id", type: "INTEGER", mode: "REQUIRED", description: "ユーザーの一意識別子" },
    { field: "email", type: "STRING", mode: "REQUIRED", description: "メールアドレス" },
    { field: "country", type: "STRING", mode: "NULLABLE", description: "居住国" },
    { field: "age", type: "INTEGER", mode: "NULLABLE", description: "年齢" },
    { field: "created_at", type: "TIMESTAMP", mode: "REQUIRED", description: "登録日時 (UTC)" },
  ],
  "ecommerce.products": [
    { field: "product_id", type: "INTEGER", mode: "REQUIRED", description: "商品の一意識別子" },
    { field: "name", type: "STRING", mode: "REQUIRED", description: "商品名" },
    { field: "category", type: "STRING", mode: "NULLABLE", description: "商品カテゴリ" },
    { field: "price", type: "FLOAT", mode: "NULLABLE", description: "価格（円）" },
    { field: "stock", type: "INTEGER", mode: "NULLABLE", description: "在庫数" },
  ],
}

const JOB_HISTORY_INITIAL = [
  { id: "bqjob_r123456", query: "SELECT FORMAT_TIMESTAMP('%Y-%m', created_at) AS month...", status: "完了", duration: "3.2s", bytes: "2.3 GB", ts: "2026-03-26 14:23" },
  { id: "bqjob_r789012", query: "SELECT country, COUNT(*) AS user_count, ROUND(AVG(age))...", status: "完了", duration: "1.8s", bytes: "456 MB", ts: "2026-03-26 13:55" },
  { id: "bqjob_r345678", query: "SELECT p.category, p.name, COUNT(o.order_id) AS order_count...", status: "完了", duration: "4.1s", bytes: "2.7 GB", ts: "2026-03-26 12:41" },
]

const SAVED_QUERIES = [
  { label: "★ 日次アクティブユーザー", query: `SELECT\n  DATE(created_at) AS date,\n  COUNT(DISTINCT user_id) AS dau\nFROM \`ecommerce.orders\`\nWHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)\nGROUP BY date\nORDER BY date DESC` },
  { label: "★ 高額注文トップ10", query: `SELECT\n  order_id,\n  user_id,\n  amount,\n  status,\n  created_at\nFROM \`ecommerce.orders\`\nORDER BY amount DESC\nLIMIT 10` },
]

function estimateCost(queryText: string): string {
  const gbMatch = queryText.length / 500
  const gb = Math.min(gbMatch, 1.0)
  if (gb < 1) return "$0.00 (最初の1TB/月は無料)"
  return `$${(gb * 0.005).toFixed(3)}`
}

export default function BigQueryDemo() {
  const [query, setQuery] = useState(BQ_SAMPLE_QUERIES[0].query)
  const [activeQueryIdx, setActiveQueryIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<typeof BQ_SAMPLE_QUERIES[0]["result"] | null>(null)
  const [expandedDataset, setExpandedDataset] = useState<string | null>("ecommerce")
  const [tab, setTab] = useState<Tab>("editor")
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([])
  const [selectedSchema, setSelectedSchema] = useState<string>("ecommerce.orders")
  const [jobHistory, setJobHistory] = useState(JOB_HISTORY_INITIAL)
  const [queryStats, setQueryStats] = useState<{ rows: number; duration: string; bytes: string; cost: string } | null>(null)

  async function runQuery() {
    setRunning(true)
    setResult(null)
    setQueryStats(null)
    setProgress(0)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 120))
      setProgress(i)
    }
    const exactMatch = BQ_SAMPLE_QUERIES.findIndex((q) => q.query === query)
    const idx = exactMatch >= 0 ? exactMatch : activeQueryIdx
    const res = BQ_SAMPLE_QUERIES[idx].result
    setResult(res)

    const stats = {
      rows: res.rows.length,
      duration: res.duration,
      bytes: res.processedBytes,
      cost: estimateCost(query),
    }
    setQueryStats(stats)

    const newEntry: QueryHistoryEntry = {
      query: query.slice(0, 60) + (query.length > 60 ? "..." : ""),
      ...stats,
      ts: new Date().toLocaleTimeString("ja-JP"),
    }
    setQueryHistory((prev) => [newEntry, ...prev].slice(0, 5))

    const newJob = {
      id: `bqjob_r${Math.floor(Math.random() * 900000 + 100000)}`,
      query: query.slice(0, 55) + "...",
      status: "完了",
      duration: res.duration,
      bytes: res.processedBytes,
      ts: new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
    }
    setJobHistory((prev) => [newJob, ...prev].slice(0, 10))

    setRunning(false)
  }

  const chartData = result?.rows.map((row) => ({
    name: row[0],
    value: parseFloat(String(row[1]).replace(/,/g, "")),
  }))

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "editor", label: "クエリエディタ", icon: <Play size={13} /> },
    { key: "schema", label: "スキーマ", icon: <Table2 size={13} /> },
    { key: "jobs", label: "ジョブ履歴", icon: <Briefcase size={13} /> },
  ]

  const modeColor = (mode: string) => {
    if (mode === "REQUIRED") return "text-gcp-red"
    if (mode === "NULLABLE") return "text-gcp-yellow"
    return "text-muted-foreground"
  }

  const typeColor = (type: string) => {
    if (type === "INTEGER" || type === "FLOAT") return "text-gcp-blue"
    if (type === "TIMESTAMP") return "text-gcp-green"
    if (type === "STRING") return "text-orange-400"
    return "text-muted-foreground"
  }

  return (
    <DemoShell
      title="BigQuery"
      description="SQLクエリを実行してペタバイト規模のデータを分析します"
      service="BigQuery"
      color="#4285F4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left: Dataset explorer */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">データセット</h3>
          {BQ_DEMO_DATASETS.map((ds) => (
            <div key={ds.id}>
              <button
                onClick={() => setExpandedDataset(expandedDataset === ds.id ? null : ds.id)}
                className="flex items-center gap-1.5 w-full text-left text-sm px-2 py-1.5 hover:bg-muted rounded"
              >
                <ChevronRight
                  size={14}
                  className={`transition-transform shrink-0 ${expandedDataset === ds.id ? "rotate-90" : ""}`}
                />
                <Database size={13} className="text-gcp-blue shrink-0" />
                <span className="font-medium text-foreground">{ds.name}</span>
              </button>
              {expandedDataset === ds.id && (
                <div className="ml-5 space-y-1 mt-1">
                  {ds.tables.map((table) => (
                    <button
                      key={table.name}
                      onClick={() => {
                        const q = `SELECT * FROM \`${ds.name}.${table.name}\`\nLIMIT 100`
                        setQuery(q)
                        setActiveQueryIdx(0)
                        setSelectedSchema(`${ds.name}.${table.name}`)
                        setTab("editor")
                      }}
                      className="flex items-center gap-1.5 w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-gcp-yellow">▦</span>
                      <span>{table.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Saved queries */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Bookmark size={11} />
              保存済みクエリ
            </p>
            <div className="space-y-1">
              {SAVED_QUERIES.map((sq) => (
                <button
                  key={sq.label}
                  onClick={() => { setQuery(sq.query); setTab("editor") }}
                  className="w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded text-gcp-blue/80 hover:text-gcp-blue"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sample queries */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">クエリ例</p>
            <div className="space-y-1">
              {BQ_SAMPLE_QUERIES.map((sq, i) => (
                <button
                  key={sq.label}
                  onClick={() => { setQuery(sq.query); setActiveQueryIdx(i); setTab("editor") }}
                  className="w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Query history */}
          {queryHistory.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                <History size={11} />
                クエリ履歴
              </p>
              <div className="space-y-1">
                {queryHistory.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(h.query.replace(/\.\.\.$/, "")); setTab("editor") }}
                    className="w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground font-mono leading-relaxed"
                  >
                    <span className="line-clamp-2">{h.query}</span>
                    <span className="text-[10px] text-muted-foreground/60 mt-0.5 block">{h.ts}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Tabs + content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-border pb-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? "border-gcp-blue text-gcp-blue"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Editor tab */}
          {tab === "editor" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">SQLエディタ</span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono px-1.5 py-0">
                      Ctrl+Enter で実行
                    </Badge>
                  </div>
                  <Button
                    onClick={runQuery}
                    disabled={running}
                    size="sm"
                    className="bg-gcp-blue hover:bg-gcp-blue-dark text-white h-8 text-xs"
                    onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && runQuery()}
                  >
                    <Play size={13} className="mr-1.5" />
                    {running ? "実行中..." : "実行 (▶)"}
                  </Button>
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); runQuery() } }}
                  className="w-full h-36 code-editor-bg rounded-lg p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-gcp-blue/50 scrollbar-thin"
                  spellCheck={false}
                />
                {/* Cost estimation */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BarChart3 size={11} className="text-gcp-green" />
                  <span>推定コスト: <strong className="text-gcp-green">{estimateCost(query)}</strong></span>
                </div>
              </div>

              {/* Progress */}
              {running && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-gcp-blue animate-pulse" />
                    クエリを実行中...
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}

              {/* Results */}
              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Stats bar */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground p-3 bg-gcp-blue/5 rounded-lg border border-gcp-blue/20">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gcp-blue" />
                      <span>実行時間: <strong className="text-foreground">{queryStats?.duration}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={12} className="text-gcp-blue" />
                      <span>処理データ量: <strong className="text-foreground">{queryStats?.bytes}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gcp-green font-medium">費用: {queryStats?.cost}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                      {queryStats?.rows} 行返却
                    </Badge>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="query-table">
                      <thead>
                        <tr>
                          {result.columns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-muted/30"}>
                            {row.map((cell, j) => (
                              <td key={j}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Chart */}
                  {chartData && chartData.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">可視化</p>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                            <Bar dataKey="value" fill="#4285F4" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {!result && !running && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-4 bg-muted/30 rounded-lg">
                  <AlertCircle size={14} />
                  クエリを入力して実行ボタンをクリックするか Ctrl+Enter で実行してください
                </div>
              )}
            </div>
          )}

          {/* Schema tab */}
          {tab === "schema" && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">テーブルを選択</p>
                <div className="flex gap-1 flex-wrap">
                  {Object.keys(SCHEMA_DATA).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSchema(key)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-mono ${
                        selectedSchema === key
                          ? "border-gcp-blue bg-gcp-blue/10 text-gcp-blue"
                          : "border-border text-muted-foreground hover:border-gcp-blue/40"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">フィールド名</th>
                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">型</th>
                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">モード</th>
                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(SCHEMA_DATA[selectedSchema] ?? []).map((row, i) => (
                      <tr key={row.field} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-3 py-2 font-mono font-semibold text-foreground">{row.field}</td>
                        <td className={`px-3 py-2 font-mono font-medium ${typeColor(row.type)}`}>{row.type}</td>
                        <td className={`px-3 py-2 font-mono text-[11px] ${modeColor(row.mode)}`}>{row.mode}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="text-gcp-red font-mono">REQUIRED</span> — NULLを許可しない</span>
                <span className="flex items-center gap-1"><span className="text-gcp-yellow font-mono">NULLABLE</span> — NULLを許可する</span>
              </div>
            </motion.div>
          )}

          {/* Jobs tab */}
          {tab === "jobs" && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">最近のジョブ</p>
                <Badge variant="outline" className="text-xs">{jobHistory.length} 件</Badge>
              </div>
              <div className="space-y-2">
                {jobHistory.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-lg border border-border bg-card space-y-2 hover:border-gcp-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-mono text-gcp-blue">{job.id}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{job.query}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs shrink-0">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={10} /> {job.duration}</span>
                      <span className="flex items-center gap-1"><BarChart3 size={10} /> {job.bytes}</span>
                      <span className="ml-auto">{job.ts}</span>
                    </div>
                  </div>
                ))}
                {jobHistory.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                    クエリを実行するとジョブが記録されます
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
