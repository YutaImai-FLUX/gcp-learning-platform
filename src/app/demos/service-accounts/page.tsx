"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Key, Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle,
  XCircle, Bot, Lock, Unlock, RefreshCw, Trash2, Eye, EyeOff,
  Plus, Download, ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DemoShell } from "@/components/demos/DemoShell"

interface ServiceAccount {
  id: string; name: string; email: string; description: string
  keys: number; lastUsed: string; status: string
  roles: string[]; riskScore: number
}

const SERVICE_ACCOUNTS: ServiceAccount[] = [
  { id: "sa-1", name: "data-pipeline", email: "data-pipeline@my-project.iam.gserviceaccount.com", description: "データパイプライン用SA", keys: 2, lastUsed: "2026-03-28", status: "active", roles: ["roles/bigquery.dataEditor", "roles/storage.objectViewer"], riskScore: 30 },
  { id: "sa-2", name: "web-backend", email: "web-backend@my-project.iam.gserviceaccount.com", description: "Webアプリバックエンド", keys: 1, lastUsed: "2026-03-29", status: "active", roles: ["roles/cloudsql.client", "roles/secretmanager.secretAccessor"], riskScore: 15 },
  { id: "sa-3", name: "ci-cd-deployer", email: "ci-cd-deployer@my-project.iam.gserviceaccount.com", description: "CI/CDデプロイ用", keys: 3, lastUsed: "2026-01-15", status: "active", roles: ["roles/owner"], riskScore: 95 },
  { id: "sa-4", name: "legacy-batch", email: "legacy-batch@my-project.iam.gserviceaccount.com", description: "旧バッチ処理（移行予定）", keys: 1, lastUsed: "2025-08-20", status: "active", roles: ["roles/editor"], riskScore: 80 },
  { id: "sa-5", name: "monitoring-agent", email: "monitoring-agent@my-project.iam.gserviceaccount.com", description: "監視エージェント", keys: 0, lastUsed: "2026-03-29", status: "active", roles: ["roles/monitoring.viewer"], riskScore: 5 },
]

const TABS = ["SA管理", "認証方式の比較", "権限棚卸し"] as const

function riskColor(score: number) {
  if (score >= 70) return "text-red-500"
  if (score >= 30) return "text-amber-500"
  return "text-green-500"
}

function riskBg(score: number) {
  if (score >= 70) return "bg-red-500/10 border-red-500/30"
  if (score >= 30) return "bg-amber-500/10 border-amber-500/30"
  return "bg-green-500/10 border-green-500/30"
}

// ─── Tab 1: SA Management ───────────────────────────────────
function SAManagementTab() {
  const [accounts, setAccounts] = useState(SERVICE_ACCOUNTS)
  const [selected, setSelected] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [createLog, setCreateLog] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [keyWarning, setKeyWarning] = useState(false)
  const [keyDownloaded, setKeyDownloaded] = useState(false)

  const selectedSA = accounts.find((a) => a.id === selected)

  async function handleCreate() {
    if (!newName) return
    setCreating(true)
    setCreateLog([])
    const logs = [
      `$ gcloud iam service-accounts create ${newName}`,
      `Created service account [${newName}].`,
      `$ gcloud iam service-accounts describe ${newName}@my-project.iam.gserviceaccount.com`,
      `displayName: ${newName}`,
      `email: ${newName}@my-project.iam.gserviceaccount.com`,
      `✓ サービスアカウントが正常に作成されました`,
    ]
    for (const line of logs) {
      await new Promise((r) => setTimeout(r, 400))
      setCreateLog((p) => [...p, line])
    }
    setAccounts((p) => [...p, {
      id: `sa-${Date.now()}`, name: newName, email: `${newName}@my-project.iam.gserviceaccount.com`,
      description: newDesc || "新規SA", keys: 0, lastUsed: "-", status: "active", roles: [], riskScore: 0,
    }])
    setNewName("")
    setNewDesc("")
    setCreating(false)
  }

  function handleCreateKey() {
    setKeyWarning(true)
    setKeyDownloaded(false)
  }

  function handleDownloadKey() {
    setKeyDownloaded(true)
    if (selectedSA) {
      setAccounts((p) => p.map((a) => a.id === selectedSA.id ? { ...a, keys: a.keys + 1, riskScore: Math.min(100, a.riskScore + 15) } : a))
    }
  }

  function handleDisableKey() {
    if (selectedSA) {
      setAccounts((p) => p.map((a) => a.id === selectedSA.id ? { ...a, keys: Math.max(0, a.keys - 1), riskScore: Math.max(0, a.riskScore - 10) } : a))
    }
    setKeyWarning(false)
    setKeyDownloaded(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Create SA Form */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><Plus size={16} /> SA作成</h3>
            <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="SA名（例: my-service）" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="説明（任意）" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>my-project</option>
            </select>
            <Button size="sm" onClick={handleCreate} disabled={creating || !newName} className="bg-[#EA4335] hover:bg-[#d33426] text-white">
              {creating ? <RefreshCw size={14} className="animate-spin mr-1" /> : <Plus size={14} className="mr-1" />} 作成
            </Button>
            {createLog.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-950 rounded-md p-3 font-mono text-xs text-green-400 max-h-40 overflow-auto">
                {createLog.map((l, i) => <div key={i}>{l}</div>)}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* SA List */}
        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Bot size={16} /> サービスアカウント一覧</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 pr-2">名前</th>
                  <th className="text-center py-2 px-2">キー数</th>
                  <th className="text-center py-2 px-2">最終使用</th>
                  <th className="text-center py-2 px-2">リスク</th>
                </tr></thead>
                <tbody>
                  {accounts.map((sa) => (
                    <tr key={sa.id} onClick={() => setSelected(sa.id)} className={`border-b border-border/50 cursor-pointer hover:bg-muted/50 transition ${selected === sa.id ? "bg-muted" : ""}`}>
                      <td className="py-2 pr-2 font-medium">{sa.name}</td>
                      <td className="text-center py-2 px-2"><Badge variant="outline" className="text-[10px]"><Key size={10} className="mr-1" />{sa.keys}</Badge></td>
                      <td className="text-center py-2 px-2 text-muted-foreground">{sa.lastUsed}</td>
                      <td className="text-center py-2 px-2"><span className={`font-bold ${riskColor(sa.riskScore)}`}>{sa.riskScore}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedSA && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <Card className={`border ${riskBg(selectedSA.riskScore)}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{selectedSA.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedSA.email}</p>
                  </div>
                  <Badge className={selectedSA.riskScore >= 70 ? "bg-red-500" : selectedSA.riskScore >= 30 ? "bg-amber-500" : "bg-green-500"}>
                    リスクスコア: {selectedSA.riskScore}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedSA.roles.map((r) => (
                    <Badge key={r} variant="outline" className={`text-[10px] ${r.includes("owner") || r.includes("editor") ? "border-red-500/50 text-red-500" : ""}`}>
                      <Shield size={10} className="mr-1" />{r}
                    </Badge>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Key size={14} /> キー管理（現在 {selectedSA.keys} 個）</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={handleCreateKey}><Plus size={14} className="mr-1" /> キー作成</Button>
                    {selectedSA.keys > 0 && <>
                      <Button size="sm" variant="outline" onClick={handleDisableKey} className="text-amber-500 border-amber-500/50"><EyeOff size={14} className="mr-1" /> キーを無効化</Button>
                      <Button size="sm" variant="outline" onClick={handleDisableKey} className="text-red-500 border-red-500/50"><Trash2 size={14} className="mr-1" /> キーを削除</Button>
                    </>}
                  </div>
                </div>

                <AnimatePresence>
                  {keyWarning && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-red-500/10 border border-red-500/40 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-500">セキュリティ警告</p>
                          <p className="text-xs text-muted-foreground mt-1">SA キーの作成はセキュリティリスクを伴います。キーが漏洩した場合、このSAに紐づく全てのリソースへのアクセスが可能になります。Workload Identity の使用を推奨します。</p>
                        </div>
                      </div>
                      {!keyDownloaded ? (
                        <Button size="sm" onClick={handleDownloadKey} className="bg-red-500 hover:bg-red-600 text-white">
                          <Download size={14} className="mr-1" /> それでもキーを作成する
                        </Button>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-950 rounded-md p-3 font-mono text-[11px] text-red-400 space-y-1">
                          <p>⚠️ JSONキーがダウンロードされました:</p>
                          <pre className="text-green-400 text-[10px]">{`{\n  "type": "service_account",\n  "project_id": "my-project",\n  "private_key_id": "abc123...",\n  "private_key": "-----BEGIN RSA PRIVATE KEY-----\\n...",\n  "client_email": "${selectedSA.email}"\n}`}</pre>
                          <p className="text-red-400 font-bold mt-2">⚠️ このキーは二度と表示されません。安全に保管してください。</p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Tab 2: Authentication Methods Comparison ────────────────
function ComparisonTab() {
  const [leakSimulation, setLeakSimulation] = useState(false)
  const [leakStep, setLeakStep] = useState(0)
  const [wiStep, setWiStep] = useState<number | null>(null)

  async function runLeakSimulation() {
    setLeakSimulation(true)
    setLeakStep(0)
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 800))
      setLeakStep(i)
    }
  }

  const saFlowSteps = [
    { label: "開発者", icon: Bot },
    { label: "JSONキーをDL", icon: Download },
    { label: "コード/env に保存", icon: Key },
    { label: "アプリがキー使用", icon: Unlock },
    { label: "GCP API", icon: Shield },
  ]
  const saRisks = [
    "キーが漏洩したら？ → 全リソースへの不正アクセス",
    "キーのローテーションは？ → 手動対応が必要",
    "誰がキーを持っている？ → 追跡困難",
  ]

  const wiFlowSteps = [
    { label: "GKE Pod", icon: Bot, detail: "アプリケーションコンテナがKubernetes上で起動" },
    { label: "Kubernetes SA", icon: Shield, detail: "Pod に紐づく Kubernetes Service Account" },
    { label: "Workload Identity 連携", icon: RefreshCw, detail: "GKE が自動でトークンを発行・ローテーション" },
    { label: "GCP SA", icon: ShieldCheck, detail: "IAM ポリシーで最小権限を適用" },
    { label: "GCP API", icon: Lock, detail: "短命トークンで安全にアクセス" },
  ]
  const wiBenefits = [
    "キー不要 → 漏洩リスクゼロ",
    "自動ローテーション → 短命トークン（1時間）",
    "監査可能 → Cloud Audit Logs で追跡",
  ]

  const comparisonRows = [
    { item: "セキュリティ", saKey: "★★☆☆☆", wi: "★★★★★" },
    { item: "運用負荷", saKey: "★★★★☆（高い）", wi: "★☆☆☆☆（低い）" },
    { item: "キー漏洩リスク", saKey: "高", wi: "なし" },
    { item: "トークン有効期間", saKey: "無期限", wi: "1時間" },
    { item: "監査性", saKey: "低", wi: "高" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SA Key Method */}
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-red-500 flex items-center gap-2"><XCircle size={18} /> SA キー方式（非推奨）</h3>
            <div className="flex items-center gap-1 flex-wrap">
              {saFlowSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <motion.div whileHover={{ scale: 1.05 }} className={`flex flex-col items-center p-2 rounded-lg border text-[11px] min-w-[70px] ${leakSimulation && leakStep >= i && i > 0 && i < 4 ? "border-red-500 bg-red-500/20" : "border-border bg-background"}`}>
                    <s.icon size={16} className={leakSimulation && leakStep >= i && i > 0 && i < 4 ? "text-red-500" : "text-muted-foreground"} />
                    <span className="mt-1 text-center leading-tight">{s.label}</span>
                  </motion.div>
                  {i < saFlowSteps.length - 1 && <ArrowRight size={12} className="text-muted-foreground shrink-0" />}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {saRisks.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-red-500/10 border border-red-500/20 rounded-md p-2">
                  <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" /><span>{r}</span>
                </div>
              ))}
            </div>
            <Button size="sm" onClick={runLeakSimulation} disabled={leakSimulation && leakStep < 4} className="bg-red-500 hover:bg-red-600 text-white">
              <ShieldAlert size={14} className="mr-1" /> 漏洩シミュレーション
            </Button>
            <AnimatePresence>
              {leakSimulation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  {leakStep >= 1 && <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-xs bg-red-500/10 border border-red-500/30 rounded-md p-2 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" /> キーが GitHub リポジトリに漏洩
                  </motion.div>}
                  {leakStep >= 2 && <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-xs bg-red-500/15 border border-red-500/40 rounded-md p-2 flex items-center gap-2">
                    <Unlock size={14} className="text-red-500" /> 攻撃者がキーを取得、認証成功
                  </motion.div>}
                  {leakStep >= 3 && <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-xs bg-red-500/20 border border-red-500/50 rounded-md p-2 flex items-center gap-2">
                    <Eye size={14} className="text-red-500" /> BigQuery, Cloud Storage へ不正アクセス中...
                  </motion.div>}
                  {leakStep >= 4 && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <div className="relative flex items-center justify-center py-4">
                        <motion.div animate={{ scale: [1, 1.8, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-24 h-24 rounded-full bg-red-500/10" />
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="absolute w-16 h-16 rounded-full bg-red-500/20" />
                        <ShieldAlert size={28} className="text-red-500 relative z-10" />
                      </div>
                      <p className="text-xs text-center text-red-500 font-semibold">影響範囲: SA に紐づく全リソースが侵害されました</p>
                      <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => { setLeakSimulation(false); setLeakStep(0) }}>
                        <RefreshCw size={14} className="mr-1" /> リセット
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Workload Identity */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-green-500 flex items-center gap-2"><CheckCircle size={18} /> Workload Identity（推奨）</h3>
            <div className="flex items-center gap-1 flex-wrap">
              {wiFlowSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <motion.div whileHover={{ scale: 1.05 }} onClick={() => setWiStep(wiStep === i ? null : i)} className={`flex flex-col items-center p-2 rounded-lg border text-[11px] min-w-[70px] cursor-pointer ${wiStep === i ? "border-green-500 bg-green-500/20" : "border-border bg-background"}`}>
                    <s.icon size={16} className={wiStep === i ? "text-green-500" : "text-muted-foreground"} />
                    <span className="mt-1 text-center leading-tight">{s.label}</span>
                  </motion.div>
                  {i < wiFlowSteps.length - 1 && <ArrowRight size={12} className="text-muted-foreground shrink-0" />}
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {wiStep !== null && (
                <motion.div key={wiStep} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs bg-green-500/10 border border-green-500/30 rounded-md p-3">
                  <p className="font-medium text-green-600">{wiFlowSteps[wiStep].label}</p>
                  <p className="text-muted-foreground mt-1">{wiFlowSteps[wiStep].detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              {wiBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-green-500/10 border border-green-500/20 rounded-md p-2">
                  <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" /><span>{b}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="border-border">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">比較表</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-2 pr-4">項目</th>
                <th className="text-center py-2 px-4 text-red-500">SA キー</th>
                <th className="text-center py-2 px-4 text-green-500">Workload Identity</th>
              </tr></thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.item} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{row.item}</td>
                    <td className="text-center py-2 px-4 text-red-400">{row.saKey}</td>
                    <td className="text-center py-2 px-4 text-green-400">{row.wi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab 3: Permission Audit ─────────────────────────────────
function PermissionAuditTab() {
  const [accounts, setAccounts] = useState(SERVICE_ACCOUNTS)
  const [optimized, setOptimized] = useState(false)

  const recommendations: Record<string, string[]> = {
    "sa-3": [
      "Owner権限が付与されています。最小権限のロールに変更してください",
      "3つのキーが存在します。使用していないキーの削除を推奨します",
      "73日間未使用です。使用目的を確認してください",
    ],
    "sa-4": [
      "このSAは221日間未使用です。無効化を推奨します",
      "Editor権限が付与されています。最小権限のロールに変更してください",
    ],
    "sa-1": [
      "2つのキーが存在します。Workload Identity への移行を検討してください",
    ],
  }

  const permCounts: Record<string, number> = {
    "sa-1": 45, "sa-2": 28, "sa-3": 5000, "sa-4": 3200, "sa-5": 12,
  }

  function handleOptimize() {
    setOptimized(true)
    setAccounts((p) => p.map((a) => {
      if (a.id === "sa-3") return { ...a, roles: ["roles/cloudbuild.builds.builder"], keys: 1, riskScore: 20 }
      if (a.id === "sa-4") return { ...a, status: "disabled", riskScore: 0 }
      if (a.id === "sa-1") return { ...a, keys: 0, riskScore: 10 }
      return a
    }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((sa) => (
          <motion.div key={sa.id} layout>
            <Card className={`border ${riskBg(sa.riskScore)} ${sa.status === "disabled" ? "opacity-60" : ""}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{sa.name}</h4>
                  <Badge className={sa.riskScore >= 70 ? "bg-red-500" : sa.riskScore >= 30 ? "bg-amber-500" : "bg-green-500"} variant="default">
                    {sa.riskScore >= 70 ? "高リスク" : sa.riskScore >= 30 ? "中リスク" : "低リスク"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>権限数: <span className="font-mono text-foreground">{permCounts[sa.id]?.toLocaleString()}</span></div>
                  <div>最終活動: <span className="text-foreground">{sa.lastUsed}</span></div>
                  <div>キー数: <span className="text-foreground">{sa.keys}</span></div>
                  <div>状態: <span className={sa.status === "active" ? "text-green-500" : "text-muted-foreground"}>{sa.status === "active" ? "有効" : "無効"}</span></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sa.roles.map((r) => (
                    <Badge key={r} variant="outline" className={`text-[10px] ${r.includes("owner") || r.includes("editor") ? "border-red-500/50 text-red-500" : ""}`}>
                      {r.replace("roles/", "")}
                    </Badge>
                  ))}
                </div>
                {/* Risk bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${sa.riskScore}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full ${sa.riskScore >= 70 ? "bg-red-500" : sa.riskScore >= 30 ? "bg-amber-500" : "bg-green-500"}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><ShieldAlert size={16} /> 推奨アクション</h3>
          {!optimized ? (
            <>
              <div className="space-y-2">
                {Object.entries(recommendations).map(([saId, recs]) => {
                  const sa = SERVICE_ACCOUNTS.find((a) => a.id === saId)
                  return recs.map((rec, i) => (
                    <motion.div key={`${saId}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 text-xs bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">{sa?.name}:</strong> {rec}</span>
                    </motion.div>
                  ))
                })}
              </div>
              <Button size="sm" onClick={handleOptimize} className="bg-[#EA4335] hover:bg-[#d33426] text-white">
                <ShieldCheck size={14} className="mr-1" /> 最適化を適用
              </Button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium"><CheckCircle size={16} /> 最適化が完了しました</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>- ci-cd-deployer: Owner → cloudbuild.builds.builder に変更、不要なキーを削除</p>
                <p>- legacy-batch: 無効化しました</p>
                <p>- data-pipeline: キーを削除し、Workload Identity に移行しました</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export default function ServiceAccountsDemo() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(TABS[0])

  return (
    <DemoShell
      title="サービスアカウント & Workload Identity"
      description="SA鍵管理 vs Workload Identity の比較体験。セキュリティリスクと推奨パターンを学ぶ"
      service="IAM - Service Accounts"
      color="#EA4335"
    >
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border mb-4">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-[#EA4335] text-[#EA4335]" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === "SA管理" && <SAManagementTab />}
          {activeTab === "認証方式の比較" && <ComparisonTab />}
          {activeTab === "権限棚卸し" && <PermissionAuditTab />}
        </motion.div>
      </AnimatePresence>
    </DemoShell>
  )
}
