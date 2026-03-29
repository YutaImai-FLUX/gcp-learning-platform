"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2, FolderOpen, FileCode2, Shield, ShieldCheck, ShieldAlert,
  Plus, Play, ChevronRight, ChevronDown, Check, X, AlertTriangle, MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DemoShell } from "@/components/demos/DemoShell"

/* ── Types ── */
interface Policy {
  id: string
  constraint: string
  constraintLabel: string
  enforced: boolean
  dryRun: boolean
  values?: string[]
  inheritedFrom?: string
}

interface HierarchyNode {
  id: string
  name: string
  type: "organization" | "folder" | "project"
  parentId: string | null
  policies: Policy[]
}

interface Constraint {
  id: string
  label: string
  description: string
  type: "list" | "boolean"
  options?: string[]
}

interface TestScenario {
  id: string
  label: string
  constraint: string
  targetProject: string
  testValue: string
}

/* ── Mock Data ── */
const CONSTRAINTS: Constraint[] = [
  { id: "compute.vmExternalIpAccess", label: "外部IPアドレスの制限", description: "VMインスタンスに外部IPアドレスの付与を制限する", type: "list" },
  { id: "gcp.resourceLocations", label: "リソースロケーション制限", description: "リソースを特定のリージョンにのみ作成可能にする", type: "list", options: ["asia-northeast1", "asia-northeast2", "us-central1", "europe-west1"] },
  { id: "iam.allowedPolicyMemberDomains", label: "許可ドメイン制限", description: "IAMポリシーのメンバーを特定のドメインに制限する", type: "list" },
  { id: "compute.requireShieldedVm", label: "Shielded VM 必須化", description: "すべてのVMインスタンスでShielded VMを必須にする", type: "boolean" },
  { id: "storage.uniformBucketLevelAccess", label: "均一バケットアクセス必須", description: "Cloud Storageバケットで均一なバケットレベルアクセスを必須にする", type: "boolean" },
  { id: "sql.restrictPublicIp", label: "Cloud SQL 公開IP禁止", description: "Cloud SQLインスタンスへの公開IPアドレスの付与を禁止する", type: "boolean" },
]

const INITIAL_NODES: HierarchyNode[] = [
  { id: "org", name: "flux-corp.com", type: "organization", parentId: null, policies: [
    { id: "p1", constraint: "gcp.resourceLocations", constraintLabel: "リソースロケーション制限", enforced: true, dryRun: false, values: ["asia-northeast1", "asia-northeast2", "us-central1"] },
    { id: "p2", constraint: "iam.allowedPolicyMemberDomains", constraintLabel: "許可ドメイン制限", enforced: true, dryRun: false, values: ["flux-corp.com"] },
  ]},
  { id: "folder-dev", name: "開発部門", type: "folder", parentId: "org", policies: [] },
  { id: "proj-web", name: "my-web-project", type: "project", parentId: "folder-dev", policies: [] },
  { id: "proj-data", name: "my-data-project", type: "project", parentId: "folder-dev", policies: [] },
  { id: "folder-prod", name: "本番環境", type: "folder", parentId: "org", policies: [
    { id: "p3", constraint: "compute.requireShieldedVm", constraintLabel: "Shielded VM 必須化", enforced: true, dryRun: false },
    { id: "p4", constraint: "sql.restrictPublicIp", constraintLabel: "Cloud SQL 公開IP禁止", enforced: true, dryRun: false },
    { id: "p5", constraint: "compute.vmExternalIpAccess", constraintLabel: "外部IPアドレスの制限", enforced: true, dryRun: false, values: [] },
  ]},
  { id: "proj-prod", name: "production-app", type: "project", parentId: "folder-prod", policies: [] },
  { id: "folder-staging", name: "検証環境", type: "folder", parentId: "org", policies: [
    { id: "p6", constraint: "sql.restrictPublicIp", constraintLabel: "Cloud SQL 公開IP禁止", enforced: false, dryRun: true },
  ]},
  { id: "proj-staging", name: "staging-app", type: "project", parentId: "folder-staging", policies: [] },
]

const TEST_SCENARIOS: TestScenario[] = [
  { id: "t1", label: "開発者がus-west1にVMを作成しようとした", constraint: "gcp.resourceLocations", targetProject: "proj-web", testValue: "us-west1" },
  { id: "t2", label: "本番環境で外部IPを持つVMを作成しようとした", constraint: "compute.vmExternalIpAccess", targetProject: "proj-prod", testValue: "external-ip" },
  { id: "t3", label: "本番環境で公開SQLインスタンスを作成しようとした", constraint: "sql.restrictPublicIp", targetProject: "proj-prod", testValue: "public-ip" },
  { id: "t4", label: "検証環境で公開SQLインスタンスを作成しようとした", constraint: "sql.restrictPublicIp", targetProject: "proj-staging", testValue: "public-ip" },
  { id: "t5", label: "外部ユーザー(gmail.com)にIAMロールを付与しようとした", constraint: "iam.allowedPolicyMemberDomains", targetProject: "proj-web", testValue: "user@gmail.com" },
]

/* ── Helpers ── */
const nodeIcon = (type: HierarchyNode["type"], size = 18) => {
  if (type === "organization") return <Building2 size={size} className="text-yellow-600" />
  if (type === "folder") return <FolderOpen size={size} className="text-yellow-500" />
  return <FileCode2 size={size} className="text-blue-500" />
}

/* ── Component ── */
export default function OrgPolicyDemo() {
  const [nodes, setNodes] = useState<HierarchyNode[]>(INITIAL_NODES)
  const [selectedId, setSelectedId] = useState<string>("org")
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["org", "folder-dev", "folder-prod", "folder-staging"]))

  // Policy form
  const [addingPolicy, setAddingPolicy] = useState(false)
  const [selConstraint, setSelConstraint] = useState("")
  const [enforce, setEnforce] = useState(true)
  const [dryRun, setDryRun] = useState(false)
  const [listValues, setListValues] = useState<string[]>([])
  const [domainInput, setDomainInput] = useState("")

  // Test
  const [selScenario, setSelScenario] = useState("")
  const [testResult, setTestResult] = useState<{ blocked: boolean; dryRun: boolean; policySource: string; chain: string[] } | null>(null)
  const [testing, setTesting] = useState(false)

  const selected = nodes.find((n) => n.id === selectedId)!

  /* Ancestry chain for a node */
  function getAncestry(nodeId: string): string[] {
    const chain: string[] = []
    let current = nodes.find((n) => n.id === nodeId)
    while (current) {
      chain.unshift(current.id)
      current = current.parentId ? nodes.find((n) => n.id === current!.parentId) : undefined
    }
    return chain
  }

  /* Effective policies for a node (own + inherited) */
  const effectivePolicies = useMemo(() => {
    const ancestry = getAncestry(selectedId)
    const policies: (Policy & { source: string })[] = []
    for (const aid of ancestry) {
      const aNode = nodes.find((n) => n.id === aid)!
      for (const p of aNode.policies) {
        policies.push({ ...p, source: aNode.name })
      }
    }
    return policies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, nodes])

  /* Children helper */
  function getChildren(parentId: string) {
    return nodes.filter((n) => n.parentId === parentId)
  }

  /* Toggle expand */
  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  /* Add policy */
  function applyPolicy() {
    if (!selConstraint) return
    const c = CONSTRAINTS.find((c) => c.id === selConstraint)!
    const newPolicy: Policy = {
      id: `p-${Date.now()}`,
      constraint: c.id,
      constraintLabel: c.label,
      enforced: enforce,
      dryRun,
      values: c.type === "list" ? listValues : undefined,
    }
    setNodes((prev) => prev.map((n) => n.id === selectedId ? { ...n, policies: [...n.policies, newPolicy] } : n))
    setAddingPolicy(false)
    setSelConstraint("")
    setListValues([])
    setDomainInput("")
  }

  /* Run test */
  function runTest() {
    if (!selScenario) return
    setTesting(true)
    setTestResult(null)
    const scenario = TEST_SCENARIOS.find((s) => s.id === selScenario)!
    const ancestry = getAncestry(scenario.targetProject)

    setTimeout(() => {
      let blocked = false
      let isDryRun = false
      let policySource = ""
      for (const aid of ancestry) {
        const aNode = nodes.find((n) => n.id === aid)!
        for (const p of aNode.policies) {
          if (p.constraint !== scenario.constraint) continue
          const c = CONSTRAINTS.find((c) => c.id === p.constraint)!
          if (c.type === "boolean" && (p.enforced || p.dryRun)) {
            blocked = true
            isDryRun = p.dryRun && !p.enforced
            policySource = aNode.name
          }
          if (c.type === "list" && p.values && (p.enforced || p.dryRun)) {
            if (p.constraint === "gcp.resourceLocations" && !p.values.includes(scenario.testValue)) {
              blocked = true; isDryRun = p.dryRun && !p.enforced; policySource = aNode.name
            }
            if (p.constraint === "compute.vmExternalIpAccess" && p.values.length === 0) {
              blocked = true; isDryRun = p.dryRun && !p.enforced; policySource = aNode.name
            }
            if (p.constraint === "iam.allowedPolicyMemberDomains") {
              const domain = scenario.testValue.split("@")[1]
              if (!p.values.includes(domain)) {
                blocked = true; isDryRun = p.dryRun && !p.enforced; policySource = aNode.name
              }
            }
          }
          if (blocked) break
        }
        if (blocked) break
      }
      const chainNames = ancestry.map((a) => nodes.find((n) => n.id === a)!.name)
      setTestResult({ blocked, dryRun: isDryRun, policySource, chain: chainNames })
      setTesting(false)
    }, 800)
  }

  /* ── Tree renderer ── */
  function renderNode(node: HierarchyNode, depth: number) {
    const children = getChildren(node.id)
    const isExpanded = expanded.has(node.id)
    const isSelected = selectedId === node.id
    const hasChildren = children.length > 0
    const directPolicies = node.policies.length

    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div
          onClick={() => setSelectedId(node.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isSelected ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700" : "hover:bg-muted/50"
          }`}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(node.id) }} className="p-0.5">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : <span className="w-5" />}
          {nodeIcon(node.type)}
          <span className="text-sm font-medium">{node.name}</span>
          {directPolicies > 0 && (
            <Badge variant="outline" className="ml-auto text-[10px] border-yellow-400 text-yellow-700 dark:text-yellow-300">
              <Shield size={10} className="mr-1" />{directPolicies}
            </Badge>
          )}
        </div>
        {depth > 0 && node.policies.length > 0 && isSelected && (
          <div className="ml-10 mt-1 mb-1 flex gap-1 flex-wrap">
            {node.policies.map((p) => (
              <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                {p.constraintLabel}
              </span>
            ))}
          </div>
        )}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-l-2 border-yellow-200 dark:border-yellow-800 ml-5"
            >
              {children.map((c) => renderNode(c, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const rootNode = nodes.find((n) => n.parentId === null)!
  const constraintObj = CONSTRAINTS.find((c) => c.id === selConstraint)

  return (
    <DemoShell
      title="Organization Policy & リソース階層"
      description="組織ポリシーでリソース作成を制御し、階層的なガバナンスを体験する"
      service="Resource Manager"
      color="#FBBC05"
      demoId="org-policy"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left Column: Hierarchy Tree ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Building2 size={16} /> リソース階層
          </h2>
          <div className="border border-border rounded-lg p-3 bg-muted/20">
            {renderNode(rootNode, 0)}
          </div>

          {/* Selected node info */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              {nodeIcon(selected.type, 20)}
              <span className="font-semibold">{selected.name}</span>
              <Badge variant="outline" className="text-[10px]">{selected.type}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">直接適用ポリシー</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAddingPolicy(!addingPolicy)}>
                  <Plus size={12} className="mr-1" /> ポリシーを追加
                </Button>
              </div>
              {selected.policies.length === 0 && (
                <p className="text-xs text-muted-foreground italic">直接適用されたポリシーはありません</p>
              )}
              {selected.policies.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs bg-muted/30 rounded px-2 py-1.5">
                  <ShieldCheck size={13} className={p.dryRun ? "text-amber-500" : "text-green-600"} />
                  <span>{p.constraintLabel}</span>
                  {p.dryRun ? (
                    <Badge className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[10px]">ドライラン</Badge>
                  ) : (
                    <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-[10px]">適用中</Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Inheritance indicator */}
            {getAncestry(selectedId).length > 1 && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={12} /> 継承パス:
                </span>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {getAncestry(selectedId).map((aid, i, arr) => {
                    const n = nodes.find((n) => n.id === aid)!
                    return (
                      <span key={aid} className="flex items-center gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted">{n.name}</span>
                        {i < arr.length - 1 && <ChevronRight size={12} className="text-muted-foreground" />}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Policy Configuration & Testing ── */}
        <div className="space-y-6">
          {/* Section 1: Policy Configuration */}
          <AnimatePresence>
            {addingPolicy && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 space-y-3 bg-yellow-50/50 dark:bg-yellow-900/10"
              >
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Shield size={15} className="text-yellow-600" /> ポリシー設定
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-medium">制約テンプレート</label>
                  <select
                    value={selConstraint}
                    onChange={(e) => { setSelConstraint(e.target.value); setListValues([]); setDomainInput("") }}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
                  >
                    <option value="">選択してください</option>
                    {CONSTRAINTS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  {constraintObj && <p className="text-xs text-muted-foreground">{constraintObj.description}</p>}
                </div>

                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 text-xs">
                    <input type="radio" name="enforce" checked={enforce && !dryRun} onChange={() => { setEnforce(true); setDryRun(false) }} />
                    適用 (Enforce)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input type="radio" name="enforce" checked={dryRun} onChange={() => { setEnforce(false); setDryRun(true) }} />
                    ドライラン (Dry-run)
                  </label>
                </div>

                {constraintObj?.type === "list" && constraintObj.options && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">許可するリージョン</label>
                    <div className="flex flex-wrap gap-2">
                      {constraintObj.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={listValues.includes(opt)}
                            onChange={(e) => setListValues(e.target.checked ? [...listValues, opt] : listValues.filter((v) => v !== opt))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {constraintObj?.type === "list" && !constraintObj.options && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">
                      {constraintObj.id === "iam.allowedPolicyMemberDomains" ? "許可ドメイン" : "許可する値"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 text-sm border border-border rounded-md px-3 py-1.5 bg-background"
                        placeholder="例: flux-corp.com"
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                      />
                      <Button size="sm" variant="outline" className="h-8" onClick={() => {
                        if (domainInput && !listValues.includes(domainInput)) {
                          setListValues([...listValues, domainInput]); setDomainInput("")
                        }
                      }}>追加</Button>
                    </div>
                    {listValues.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {listValues.map((v) => (
                          <Badge key={v} variant="outline" className="text-[10px] cursor-pointer" onClick={() => setListValues(listValues.filter((x) => x !== v))}>
                            {v} <X size={10} className="ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={applyPolicy} disabled={!selConstraint} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Check size={13} className="mr-1" /> 適用
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAddingPolicy(false)}>キャンセル</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 2: Policy Test */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShieldAlert size={15} className="text-yellow-600" /> ポリシーテスト (What-If)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-medium">テストシナリオ</label>
              <select
                value={selScenario}
                onChange={(e) => { setSelScenario(e.target.value); setTestResult(null) }}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
              >
                <option value="">シナリオを選択</option>
                {TEST_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <Button size="sm" onClick={runTest} disabled={!selScenario || testing} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Play size={13} className="mr-1" /> {testing ? "テスト中..." : "テスト実行"}
            </Button>

            <AnimatePresence>
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className={`rounded-lg p-4 space-y-3 ${
                    testResult.blocked
                      ? testResult.dryRun
                        ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
                      : "bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {testResult.blocked ? (
                      testResult.dryRun ? (
                        <><AlertTriangle size={18} className="text-amber-600" /> <span className="text-amber-700 dark:text-amber-300">VIOLATION DETECTED (Dry-run)</span></>
                      ) : (
                        <><X size={18} className="text-red-600" /> <span className="text-red-700 dark:text-red-300">BLOCKED</span></>
                      )
                    ) : (
                      <><Check size={18} className="text-green-600" /> <span className="text-green-700 dark:text-green-300">ALLOWED</span></>
                    )}
                  </div>

                  {testResult.blocked && (
                    <div className="text-xs space-y-2">
                      <p>
                        <span className="font-medium">ブロックしたポリシー:</span>{" "}
                        {CONSTRAINTS.find((c) => c.id === TEST_SCENARIOS.find((s) => s.id === selScenario)?.constraint)?.label}
                        <span className="text-muted-foreground ml-1">(適用元: {testResult.policySource})</span>
                      </p>

                      <div>
                        <span className="font-medium">継承チェーン:</span>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {testResult.chain.map((name, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                name === testResult.policySource ? "bg-red-200 dark:bg-red-800 font-bold" : "bg-muted"
                              }`}>{name}</span>
                              {i < testResult.chain.length - 1 && <ChevronRight size={10} className="text-muted-foreground" />}
                            </span>
                          ))}
                        </div>
                      </div>

                      {testResult.dryRun && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
                          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                          <span>ドライラン: 実際にはブロックされませんが、違反が記録されます</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!testResult.blocked && (
                    <p className="text-xs text-muted-foreground">この操作を制限するポリシーは見つかりませんでした。</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 3: Effective Policies Table */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck size={15} className="text-yellow-600" /> 有効ポリシー一覧
              <span className="text-xs text-muted-foreground font-normal ml-1">({selected.name})</span>
            </h3>

            {effectivePolicies.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">有効なポリシーはありません</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">制約</th>
                      <th className="pb-2 pr-3 font-medium">適用元</th>
                      <th className="pb-2 pr-3 font-medium">状態</th>
                      <th className="pb-2 font-medium">種別</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectivePolicies.map((p, i) => {
                      const isInherited = p.source !== selected.name
                      return (
                        <motion.tr
                          key={`${p.id}-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border/50"
                        >
                          <td className="py-2 pr-3">{p.constraintLabel}</td>
                          <td className="py-2 pr-3 text-muted-foreground">{p.source}</td>
                          <td className="py-2 pr-3">
                            {p.dryRun ? (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[10px]">ドライラン</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-[10px]">適用中</Badge>
                            )}
                          </td>
                          <td className="py-2">
                            {isInherited ? (
                              <Badge variant="outline" className="text-[10px] border-blue-400 text-blue-600 dark:text-blue-300">継承</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] border-green-400 text-green-600 dark:text-green-300">直接</Badge>
                            )}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoShell>
  )
}
