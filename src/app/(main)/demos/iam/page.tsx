"use client"

import { useState } from "react"
import { DemoShell } from "@/components/demos/DemoShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Lock, Users, User, Bot, CheckCircle, XCircle,
  AlertTriangle, Building2, FolderOpen, FileCode2, Plus, Play, X,
} from "lucide-react"

// --- Mock Data ---

const PRINCIPALS = [
  { id: "user:tanaka@example.com", name: "田中太郎", type: "ユーザー" },
  { id: "user:suzuki@example.com", name: "鈴木花子", type: "ユーザー" },
  { id: "sa:data-pipeline@proj.iam", name: "data-pipeline SA", type: "サービスアカウント" },
  { id: "sa:web-app@proj.iam", name: "web-app SA", type: "サービスアカウント" },
  { id: "group:dev-team@example.com", name: "開発チーム", type: "グループ" },
]

const ROLES = [
  { id: "roles/owner", name: "オーナー", category: "基本ロール", level: "danger", permissions: ["*"] },
  { id: "roles/editor", name: "編集者", category: "基本ロール", level: "warning", permissions: ["*.get", "*.list", "*.create", "*.update", "*.delete"] },
  { id: "roles/viewer", name: "閲覧者", category: "基本ロール", level: "safe", permissions: ["*.get", "*.list"] },
  { id: "roles/bigquery.dataViewer", name: "BigQuery データ閲覧者", category: "事前定義ロール", level: "safe", permissions: ["bigquery.datasets.get", "bigquery.tables.get", "bigquery.tables.list", "bigquery.tables.getData"] },
  { id: "roles/bigquery.dataEditor", name: "BigQuery データ編集者", category: "事前定義ロール", level: "safe", permissions: ["bigquery.datasets.get", "bigquery.tables.get", "bigquery.tables.list", "bigquery.tables.getData", "bigquery.tables.create", "bigquery.tables.update", "bigquery.tables.delete"] },
  { id: "roles/bigquery.admin", name: "BigQuery 管理者", category: "事前定義ロール", level: "warning", permissions: ["bigquery.*"] },
  { id: "roles/storage.objectViewer", name: "Storage オブジェクト閲覧者", category: "事前定義ロール", level: "safe", permissions: ["storage.objects.get", "storage.objects.list"] },
  { id: "roles/storage.objectAdmin", name: "Storage オブジェクト管理者", category: "事前定義ロール", level: "warning", permissions: ["storage.objects.*"] },
  { id: "roles/compute.viewer", name: "Compute 閲覧者", category: "事前定義ロール", level: "safe", permissions: ["compute.instances.get", "compute.instances.list"] },
  { id: "roles/compute.instanceAdmin", name: "Compute インスタンス管理者", category: "事前定義ロール", level: "warning", permissions: ["compute.instances.*"] },
  { id: "roles/custom.dataAnalyst", name: "データ分析者 (カスタム)", category: "カスタムロール", level: "safe", permissions: ["bigquery.datasets.get", "bigquery.tables.get", "bigquery.tables.list", "bigquery.tables.getData", "bigquery.jobs.create"] },
]

const HIERARCHY = [
  { id: "org", name: "flux-corp.com", level: "Organization", depth: 0 },
  { id: "folder-dev", name: "開発部門", level: "Folder", depth: 1, parentId: "org" },
  { id: "proj-web", name: "my-web-project", level: "Project", depth: 2, parentId: "folder-dev" },
  { id: "proj-data", name: "my-data-project", level: "Project", depth: 2, parentId: "folder-dev" },
  { id: "folder-prod", name: "本番環境", level: "Folder", depth: 1, parentId: "org" },
  { id: "proj-prod", name: "production-app", level: "Project", depth: 2, parentId: "folder-prod" },
]

const RESOURCES = [
  { id: "bq-dataset", name: "analytics_dataset", type: "BigQuery Dataset", project: "proj-data" },
  { id: "gcs-bucket", name: "user-uploads-bucket", type: "Cloud Storage Bucket", project: "proj-web" },
  { id: "gce-instance", name: "web-server-1", type: "Compute Engine Instance", project: "proj-web" },
]

const ACTIONS = [
  { id: "bigquery.datasets.get", name: "BigQuery データセット取得", service: "BigQuery" },
  { id: "bigquery.tables.getData", name: "BigQuery テーブルデータ読取", service: "BigQuery" },
  { id: "bigquery.tables.create", name: "BigQuery テーブル作成", service: "BigQuery" },
  { id: "bigquery.jobs.create", name: "BigQuery ジョブ作成(クエリ実行)", service: "BigQuery" },
  { id: "storage.objects.get", name: "Storage オブジェクト取得", service: "Storage" },
  { id: "storage.objects.create", name: "Storage オブジェクト作成", service: "Storage" },
  { id: "storage.objects.delete", name: "Storage オブジェクト削除", service: "Storage" },
  { id: "compute.instances.get", name: "Compute インスタンス情報取得", service: "Compute" },
  { id: "compute.instances.start", name: "Compute インスタンス起動", service: "Compute" },
  { id: "compute.instances.delete", name: "Compute インスタンス削除", service: "Compute" },
]

type Binding = { principalId: string; roleId: string; hierarchyId: string }
type EvalResult = {
  allowed: boolean
  chain: { level: string; node: string; role: string | null; result: "ALLOW" | "DENY" | "NO_BINDING" }[]
  suggestedRole?: string
}

const levelIcon = (level: string) => {
  if (level === "Organization") return <Building2 size={14} />
  if (level === "Folder") return <FolderOpen size={14} />
  return <FileCode2 size={14} />
}

const principalIcon = (type: string) => {
  if (type === "サービスアカウント") return <Bot size={12} />
  if (type === "グループ") return <Users size={12} />
  return <User size={12} />
}

const roleBadgeColor = (level: string) => {
  if (level === "danger") return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
  if (level === "warning") return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
  return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
}

function permissionMatches(granted: string, requested: string): boolean {
  if (granted === "*") return true
  // wildcard like "*.get" matches "bigquery.datasets.get"
  if (granted.startsWith("*.")) {
    const suffix = granted.slice(1) // ".get"
    return requested.endsWith(suffix)
  }
  // service wildcard like "bigquery.*"
  if (granted.endsWith(".*")) {
    const prefix = granted.slice(0, -1) // "bigquery."
    return requested.startsWith(prefix)
  }
  // service.resource wildcard like "storage.objects.*"
  if (granted.endsWith(".*")) {
    const prefix = granted.slice(0, -1)
    return requested.startsWith(prefix)
  }
  return granted === requested
}

function getAncestorChain(nodeId: string): string[] {
  const chain: string[] = [nodeId]
  let current = HIERARCHY.find(h => h.id === nodeId)
  while (current?.parentId) {
    chain.unshift(current.parentId)
    current = HIERARCHY.find(h => h.id === current!.parentId)
  }
  return chain
}

export default function IAMDemoPage() {
  const [bindings, setBindings] = useState<Binding[]>([])
  const [selectedPrincipal, setSelectedPrincipal] = useState(PRINCIPALS[0].id)
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id)
  const [selectedHierarchy, setSelectedHierarchy] = useState(HIERARCHY[0].id)

  const [evalResource, setEvalResource] = useState(RESOURCES[0].id)
  const [evalAction, setEvalAction] = useState(ACTIONS[0].id)
  const [evalPrincipal, setEvalPrincipal] = useState(PRINCIPALS[0].id)
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null)

  const addBinding = () => {
    const exists = bindings.some(
      b => b.principalId === selectedPrincipal && b.roleId === selectedRole && b.hierarchyId === selectedHierarchy
    )
    if (!exists) {
      setBindings([...bindings, { principalId: selectedPrincipal, roleId: selectedRole, hierarchyId: selectedHierarchy }])
    }
  }

  const removeBinding = (idx: number) => {
    setBindings(bindings.filter((_, i) => i !== idx))
  }

  const evaluate = () => {
    const resource = RESOURCES.find(r => r.id === evalResource)!
    const action = evalAction
    const ancestorChain = getAncestorChain(resource.project)
    const chain: EvalResult["chain"] = []
    let allowed = false

    for (const nodeId of ancestorChain) {
      const node = HIERARCHY.find(h => h.id === nodeId)!
      const nodeBindings = bindings.filter(b => b.hierarchyId === nodeId && b.principalId === evalPrincipal)
      if (nodeBindings.length === 0) {
        chain.push({ level: node.level, node: node.name, role: null, result: "NO_BINDING" })
      } else {
        let found = false
        for (const b of nodeBindings) {
          const role = ROLES.find(r => r.id === b.roleId)!
          const hasPermission = role.permissions.some(p => permissionMatches(p, action))
          if (hasPermission) {
            chain.push({ level: node.level, node: node.name, role: role.name, result: "ALLOW" })
            allowed = true
            found = true
            break
          }
        }
        if (!found) {
          const roleNames = nodeBindings.map(b => ROLES.find(r => r.id === b.roleId)!.name).join(", ")
          chain.push({ level: node.level, node: node.name, role: roleNames, result: "DENY" })
        }
      }
    }

    let suggestedRole: string | undefined
    if (!allowed) {
      const matching = ROLES.filter(r =>
        r.category !== "基本ロール" && r.permissions.some(p => permissionMatches(p, action))
      )
      if (matching.length > 0) suggestedRole = matching[0].name
    }

    setEvalResult({ allowed, chain, suggestedRole })
  }

  // Effective permissions for evalPrincipal
  const getEffectivePermissions = (): { permission: string; granted: boolean; service: string }[] => {
    const allPerms = new Set<string>()
    ACTIONS.forEach(a => allPerms.add(a.id))

    const principalBindings = bindings.filter(b => b.principalId === evalPrincipal)
    const grantedPerms = new Set<string>()
    for (const b of principalBindings) {
      const role = ROLES.find(r => r.id === b.roleId)!
      for (const actionItem of ACTIONS) {
        if (role.permissions.some(p => permissionMatches(p, actionItem.id))) {
          grantedPerms.add(actionItem.id)
        }
      }
    }

    return ACTIONS.map(a => ({
      permission: a.id,
      granted: grantedPerms.has(a.id),
      service: a.service,
    }))
  }

  const leastPrivilegeWarnings = (): string[] => {
    const warnings: string[] = []
    const principalBindings = bindings.filter(b => b.principalId === evalPrincipal)
    for (const b of principalBindings) {
      const role = ROLES.find(r => r.id === b.roleId)!
      if (role.id === "roles/owner" || role.id === "roles/editor") {
        const node = HIERARCHY.find(h => h.id === b.hierarchyId)!
        warnings.push(`${node.name} で「${role.name}」は過剰な権限です。最小権限の原則に従い、事前定義ロールの使用を検討してください。`)
      }
    }
    return warnings
  }

  const effectivePerms = getEffectivePermissions()
  const warnings = leastPrivilegeWarnings()
  const categories = ["基本ロール", "事前定義ロール", "カスタムロール"]

  const selectClass = "w-full h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-input/30"

  return (
    <DemoShell
      title="IAM Role & Policy Simulator"
      description="GCP IAMのロール・ポリシーをインタラクティブにシミュレーション。リソース階層の継承やアクセス評価を体験できます。"
      service="IAM & Admin"
      color="#EA4335"
      demoId="iam"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Resource Hierarchy & Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield size={16} className="text-[#EA4335]" />
              リソース階層 & バインディング
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hierarchy Tree */}
            <div className="space-y-1">
              {HIERARCHY.map(node => {
                const nodeBindings = bindings
                  .map((b, i) => ({ ...b, idx: i }))
                  .filter(b => b.hierarchyId === node.id)
                return (
                  <div key={node.id} style={{ paddingLeft: node.depth * 16 }}>
                    <div className="flex items-center gap-1.5 text-xs py-1">
                      {levelIcon(node.level)}
                      <span className="font-medium">{node.name}</span>
                      <span className="text-muted-foreground">({node.level})</span>
                    </div>
                    {nodeBindings.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-5 mb-1">
                        {nodeBindings.map(b => {
                          const role = ROLES.find(r => r.id === b.roleId)!
                          const principal = PRINCIPALS.find(p => p.id === b.principalId)!
                          return (
                            <motion.span
                              key={b.idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${roleBadgeColor(role.level)}`}
                            >
                              {principalIcon(principal.type)}
                              {principal.name}: {role.name}
                              <button onClick={() => removeBinding(b.idx)} className="hover:text-red-500 ml-0.5">
                                <X size={10} />
                              </button>
                            </motion.span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Add Binding Controls */}
            <div className="border-t pt-3 space-y-2">
              <label className="text-xs font-medium text-muted-foreground">プリンシパル</label>
              <select
                className={selectClass}
                value={selectedPrincipal}
                onChange={e => setSelectedPrincipal(e.target.value)}
              >
                {PRINCIPALS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                ))}
              </select>

              <label className="text-xs font-medium text-muted-foreground">ロール</label>
              <select
                className={selectClass}
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                {categories.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {ROLES.filter(r => r.category === cat).map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <label className="text-xs font-medium text-muted-foreground">階層レベル</label>
              <select
                className={selectClass}
                value={selectedHierarchy}
                onChange={e => setSelectedHierarchy(e.target.value)}
              >
                {HIERARCHY.map(h => (
                  <option key={h.id} value={h.id}>{"  ".repeat(h.depth)}{h.name} ({h.level})</option>
                ))}
              </select>

              <Button className="w-full mt-2" onClick={addBinding}>
                <Plus size={14} />
                バインディング追加
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column - Access Evaluation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock size={16} className="text-[#EA4335]" />
              アクセス評価
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">評価対象プリンシパル</label>
              <select
                className={selectClass}
                value={evalPrincipal}
                onChange={e => { setEvalPrincipal(e.target.value); setEvalResult(null) }}
              >
                {PRINCIPALS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <label className="text-xs font-medium text-muted-foreground">ターゲットリソース</label>
              <select
                className={selectClass}
                value={evalResource}
                onChange={e => { setEvalResource(e.target.value); setEvalResult(null) }}
              >
                {RESOURCES.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>

              <label className="text-xs font-medium text-muted-foreground">アクション</label>
              <select
                className={selectClass}
                value={evalAction}
                onChange={e => { setEvalAction(e.target.value); setEvalResult(null) }}
              >
                {ACTIONS.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <Button className="w-full" onClick={evaluate}>
              <Play size={14} />
              評価する
            </Button>

            {/* Evaluation Result */}
            <AnimatePresence mode="wait">
              {evalResult && (
                <motion.div
                  key={evalResult.allowed ? "allow" : "deny"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {/* Result Badge */}
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                    evalResult.allowed
                      ? "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800"
                  }`}>
                    {evalResult.allowed
                      ? <CheckCircle size={20} className="text-green-600" />
                      : <XCircle size={20} className="text-red-600" />
                    }
                    <span className={`font-bold text-sm ${evalResult.allowed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      {evalResult.allowed ? "ALLOW" : "DENY"}
                    </span>
                  </div>

                  {/* Terminal-style evaluation chain */}
                  <div className="bg-[#1e1e2e] rounded-lg p-3 font-mono text-xs text-gray-300 space-y-1.5 overflow-x-auto">
                    <div className="text-gray-500">$ gcloud iam check-access --principal={evalPrincipal}</div>
                    <div className="text-gray-500">  --action={evalAction}</div>
                    <div className="text-gray-500 mb-2">---</div>
                    {evalResult.chain.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-start gap-1"
                      >
                        <span className="text-gray-500 shrink-0">[{step.level}]</span>
                        <span className="text-blue-400 shrink-0">{step.node}</span>
                        <span className="text-gray-600 shrink-0">→</span>
                        {step.result === "NO_BINDING" && (
                          <span className="text-gray-500">バインディングなし</span>
                        )}
                        {step.result === "ALLOW" && (
                          <span className="text-green-400">ALLOW via {step.role}</span>
                        )}
                        {step.result === "DENY" && (
                          <span className="text-red-400">{step.role} では権限不足</span>
                        )}
                      </motion.div>
                    ))}
                    {evalResult.allowed && (
                      <div className="text-green-400 mt-2 border-t border-gray-700 pt-2">Result: ACCESS GRANTED</div>
                    )}
                    {!evalResult.allowed && (
                      <div className="text-red-400 mt-2 border-t border-gray-700 pt-2">Result: ACCESS DENIED</div>
                    )}
                  </div>

                  {/* Suggested role if denied */}
                  {!evalResult.allowed && evalResult.suggestedRole && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300"
                    >
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>推奨: 「{evalResult.suggestedRole}」ロールを付与するとこのアクションを許可できます。</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Right Column - Effective Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-[#EA4335]" />
              有効な権限
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {PRINCIPALS.find(p => p.id === evalPrincipal)?.name} の権限一覧
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Least privilege warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  最小権限チェック
                </div>
                {warnings.map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] p-2 rounded bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300"
                  >
                    {w}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Permissions by service */}
            {["BigQuery", "Storage", "Compute"].map(service => {
              const servicePerms = effectivePerms.filter(p => p.service === service)
              return (
                <div key={service}>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Badge className="text-[10px] h-4 bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20">{service}</Badge>
                  </div>
                  <div className="space-y-1">
                    {servicePerms.map(p => (
                      <div key={p.permission} className="flex items-center justify-between text-xs py-0.5">
                        <code className="text-[11px] text-muted-foreground">{p.permission}</code>
                        {p.granted ? (
                          <CheckCircle size={13} className="text-green-500 shrink-0" />
                        ) : (
                          <XCircle size={13} className="text-gray-300 dark:text-gray-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Summary */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">付与済み権限</span>
                <span className="font-medium">
                  {effectivePerms.filter(p => p.granted).length} / {effectivePerms.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
                <motion.div
                  className="bg-[#EA4335] h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(effectivePerms.filter(p => p.granted).length / effectivePerms.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  )
}
