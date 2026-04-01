"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Globe, Server, Database, ArrowRight,
  Check, X, Plus, Network, ChevronRight, Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DemoShell } from "@/components/demos/DemoShell"

// --- Types ---
interface FirewallRule {
  id: string
  name: string
  direction: "ingress" | "egress"
  priority: number
  action: "allow" | "deny"
  source: string
  targetTags: string[]
  protocol: string
  ports: string
  enabled: boolean
}

interface SimStep {
  rule: string
  matched: boolean
  action: "allow" | "deny" | "skip"
  detail: string
}

interface SimResult {
  allowed: boolean
  matchedRule: string
  steps: SimStep[]
}

// --- Mock Data ---
const SUBNETS = [
  { id: "web-subnet", name: "web-subnet", cidr: "10.0.1.0/24", region: "asia-northeast1", color: "#4285F4" },
  { id: "app-subnet", name: "app-subnet", cidr: "10.0.2.0/24", region: "asia-northeast1", color: "#34A853" },
  { id: "db-subnet", name: "db-subnet", cidr: "10.0.3.0/24", region: "asia-northeast1", color: "#EA4335" },
]

const VMS = [
  { id: "web-vm", name: "web-server", subnet: "web-subnet", ip: "10.0.1.10", tags: ["web", "http-server"], icon: "Globe" },
  { id: "app-vm", name: "app-server", subnet: "app-subnet", ip: "10.0.2.10", tags: ["app", "internal"], icon: "Server" },
  { id: "db-vm", name: "db-server", subnet: "db-subnet", ip: "10.0.3.10", tags: ["db", "mysql"], icon: "Database" },
]

const DEFAULT_RULES: FirewallRule[] = [
  { id: "fw-1", name: "allow-http", direction: "ingress", priority: 1000, action: "allow", source: "0.0.0.0/0", targetTags: ["http-server"], protocol: "tcp", ports: "80,443", enabled: true },
  { id: "fw-2", name: "allow-ssh-iap", direction: "ingress", priority: 1000, action: "allow", source: "35.235.240.0/20", targetTags: ["web", "app", "db"], protocol: "tcp", ports: "22", enabled: true },
  { id: "fw-3", name: "allow-internal", direction: "ingress", priority: 1000, action: "allow", source: "10.0.0.0/8", targetTags: ["internal", "db", "mysql"], protocol: "tcp", ports: "all", enabled: true },
  { id: "fw-4", name: "allow-app-to-db", direction: "ingress", priority: 900, action: "allow", source: "10.0.2.0/24", targetTags: ["mysql"], protocol: "tcp", ports: "3306", enabled: true },
  { id: "fw-5", name: "deny-direct-db", direction: "ingress", priority: 800, action: "deny", source: "0.0.0.0/0", targetTags: ["mysql"], protocol: "tcp", ports: "3306", enabled: true },
]

const VM_ICON_MAP: Record<string, React.ElementType> = { Globe, Server, Database }

const PROTOCOL_OPTIONS = [
  { label: "HTTP:80", protocol: "tcp", port: "80" },
  { label: "HTTPS:443", protocol: "tcp", port: "443" },
  { label: "SSH:22", protocol: "tcp", port: "22" },
  { label: "MySQL:3306", protocol: "tcp", port: "3306" },
  { label: "Custom", protocol: "tcp", port: "8080" },
]

// --- Helpers ---
function cidrContains(cidr: string, ip: string): boolean {
  if (cidr === "0.0.0.0/0") return true
  const [netAddr, bits] = cidr.split("/")
  const mask = ~((1 << (32 - parseInt(bits))) - 1) >>> 0
  const ipToNum = (s: string) => s.split(".").reduce((a, o) => (a << 8) | parseInt(o), 0) >>> 0
  return (ipToNum(ip) & mask) === (ipToNum(netAddr) & mask)
}

function portsMatch(rulePorts: string, testPort: string): boolean {
  if (rulePorts === "all") return true
  return rulePorts.split(",").map((p) => p.trim()).includes(testPort)
}

// --- Component ---
export default function VpcFirewallDemo() {
  const [rules, setRules] = useState<FirewallRule[]>(DEFAULT_RULES)
  const [source, setSource] = useState("internet")
  const [destination, setDestination] = useState("web-vm")
  const [protocolIdx, setProtocolIdx] = useState("0")
  const [simResult, setSimResult] = useState<SimResult | null>(null)
  const [simRunning, setSimRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  // New rule form
  const [newName, setNewName] = useState("")
  const [newDirection, setNewDirection] = useState<"ingress" | "egress">("ingress")
  const [newPriority, setNewPriority] = useState("1000")
  const [newAction, setNewAction] = useState<"allow" | "deny">("allow")
  const [newSource, setNewSource] = useState("0.0.0.0/0")
  const [newTargetTag, setNewTargetTag] = useState("web")
  const [newProtocol, setNewProtocol] = useState("tcp")
  const [newPorts, setNewPorts] = useState("80")

  const getSourceIp = useCallback((src: string): string => {
    if (src === "internet") return "203.0.113.50"
    const vm = VMS.find((v) => v.id === src)
    return vm?.ip ?? "0.0.0.0"
  }, [])

  const getDestVm = useCallback((dest: string) => VMS.find((v) => v.id === dest), [])

  const runSimulation = useCallback(async () => {
    setSimRunning(true)
    setSimResult(null)
    setCurrentStep(-1)

    const srcIp = getSourceIp(source)
    const destVm = getDestVm(destination)
    if (!destVm) return

    const opt = PROTOCOL_OPTIONS[parseInt(protocolIdx)]
    const direction: "ingress" | "egress" = source === "internet" ? "ingress" : "ingress"
    const sorted = [...rules].filter((r) => r.enabled).sort((a, b) => a.priority - b.priority)

    const steps: SimStep[] = []
    let matched = false
    let finalAllow = false
    let matchedRuleName = ""

    for (const rule of sorted) {
      if (rule.direction !== direction) {
        steps.push({ rule: rule.name, matched: false, action: "skip", detail: `方向不一致 (${rule.direction})` })
        continue
      }
      const srcMatch = cidrContains(rule.source, srcIp)
      if (!srcMatch) {
        steps.push({ rule: rule.name, matched: false, action: "skip", detail: `送信元不一致 (${rule.source} vs ${srcIp})` })
        continue
      }
      const tagMatch = rule.targetTags.some((t) => destVm.tags.includes(t))
      if (!tagMatch) {
        steps.push({ rule: rule.name, matched: false, action: "skip", detail: `タグ不一致 (${rule.targetTags.join(",")})` })
        continue
      }
      const portMatch = portsMatch(rule.ports, opt.port)
      if (!portMatch) {
        steps.push({ rule: rule.name, matched: false, action: "skip", detail: `ポート不一致 (${rule.ports} vs ${opt.port})` })
        continue
      }
      steps.push({ rule: rule.name, matched: true, action: rule.action, detail: `マッチ! → ${rule.action === "allow" ? "許可" : "拒否"}` })
      matched = true
      finalAllow = rule.action === "allow"
      matchedRuleName = rule.name
      break
    }

    if (!matched) {
      steps.push({ rule: "implied-deny-ingress", matched: true, action: "deny", detail: "暗黙の拒否ルール適用 (priority 65535)" })
      matchedRuleName = "implied-deny-ingress"
    }

    const result: SimResult = { allowed: finalAllow, matchedRule: matchedRuleName, steps }

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      await new Promise((r) => setTimeout(r, 600))
    }

    setSimResult(result)
    setSimRunning(false)
  }, [source, destination, protocolIdx, rules, getSourceIp, getDestVm])

  const addRule = () => {
    if (!newName.trim()) return
    const rule: FirewallRule = {
      id: `fw-${Date.now()}`,
      name: newName.trim(),
      direction: newDirection,
      priority: Math.max(0, Math.min(65535, parseInt(newPriority) || 1000)),
      action: newAction,
      source: newSource,
      targetTags: [newTargetTag],
      protocol: newProtocol,
      ports: newPorts,
      enabled: true,
    }
    setRules((prev) => [...prev, rule])
    setNewName("")
    setNewPorts("80")
  }

  const removeRule = (id: string) => setRules((prev) => prev.filter((r) => r.id !== id))

  return (
    <DemoShell
      title="VPC ネットワーク & ファイアウォール"
      description="VPC / サブネット / ファイアウォールルールを構築し、パケットフローを視覚的にシミュレート"
      service="VPC Network"
      color="#34A853"
      demoId="vpc-firewall"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ===== Left: Network Topology ===== */}
        <div className="lg:col-span-3 space-y-4">
          {/* VPC Box */}
          <div className="rounded-xl border-2 border-[#34A853]/40 bg-[#34A853]/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Network size={18} className="text-[#34A853]" />
              <span className="font-semibold text-sm">my-vpc</span>
              <Badge variant="outline" className="text-[10px] ml-auto">カスタムモード</Badge>
            </div>

            {/* Internet Gateway */}
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <Globe size={14} className="text-blue-500" />
                <span className="text-xs font-medium">インターネットゲートウェイ</span>
              </div>
            </div>

            {/* Firewall shield row */}
            <div className="flex items-center justify-center gap-1 mb-3">
              <div className="h-px flex-1 bg-border" />
              <motion.div
                animate={simRunning ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Shield size={20} className={
                  simResult ? (simResult.allowed ? "text-green-500" : "text-red-500") : "text-amber-500"
                } />
              </motion.div>
              <span className="text-[10px] text-muted-foreground">ファイアウォール</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Subnets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUBNETS.map((subnet) => {
                const subnetVms = VMS.filter((v) => v.subnet === subnet.id)
                return (
                  <div
                    key={subnet.id}
                    className="rounded-lg border-2 p-3"
                    style={{ borderColor: subnet.color + "60", backgroundColor: subnet.color + "08" }}
                  >
                    <div className="text-xs font-semibold mb-1" style={{ color: subnet.color }}>
                      {subnet.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-2">{subnet.cidr}</div>
                    {subnetVms.map((vm) => {
                      const Icon = VM_ICON_MAP[vm.icon] || Server
                      const isSource = source === vm.id
                      const isDest = destination === vm.id
                      return (
                        <motion.div
                          key={vm.id}
                          className={`rounded-md border px-2 py-1.5 mb-1.5 last:mb-0 bg-white dark:bg-[#1e1e1e] ${
                            isSource ? "ring-2 ring-blue-400" : isDest ? "ring-2 ring-amber-400" : ""
                          }`}
                          animate={
                            simResult && isDest
                              ? { boxShadow: simResult.allowed
                                  ? ["0 0 0px #34A853", "0 0 12px #34A853", "0 0 0px #34A853"]
                                  : ["0 0 0px #EA4335", "0 0 12px #EA4335", "0 0 0px #EA4335"]
                                }
                              : {}
                          }
                          transition={{ duration: 1.5, repeat: simResult && isDest ? 2 : 0 }}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon size={12} className="text-muted-foreground" />
                            <span className="text-[11px] font-medium">{vm.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{vm.ip}</div>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {vm.tags.map((t) => (
                              <Badge key={t} variant="outline" className="text-[8px] px-1 py-0 h-3.5">{t}</Badge>
                            ))}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Packet Simulation */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ArrowRight size={15} className="text-[#34A853]" />
              パケットシミュレーション
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">送信元</label>
                <Select value={source} onValueChange={(v) => v && setSource(v)}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internet">Internet</SelectItem>
                    {VMS.map((vm) => (
                      <SelectItem key={vm.id} value={vm.id}>{vm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">宛先</label>
                <Select value={destination} onValueChange={(v) => v && setDestination(v)}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VMS.map((vm) => (
                      <SelectItem key={vm.id} value={vm.id}>{vm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">プロトコル/ポート</label>
                <Select value={protocolIdx} onValueChange={(v) => v && setProtocolIdx(v)}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROTOCOL_OPTIONS.map((opt, i) => (
                      <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  className="w-full bg-[#34A853] hover:bg-[#2d9248] text-white h-8 text-xs"
                  onClick={runSimulation}
                  disabled={simRunning}
                >
                  {simRunning ? "評価中..." : "送信テスト"}
                </Button>
              </div>
            </div>

            {/* Evaluation log */}
            <AnimatePresence>
              {(simRunning || simResult) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-[#1a1a2e] dark:bg-[#0d0d1a] text-green-400 p-3 font-mono text-[11px] space-y-1 overflow-hidden"
                >
                  <div className="text-gray-500 mb-1">
                    $ packet-test --src {getSourceIp(source)} --dst {getDestVm(destination)?.ip} --port {PROTOCOL_OPTIONS[parseInt(protocolIdx)].port}
                  </div>
                  {simResult?.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={i <= currentStep ? { opacity: 1, x: 0 } : { opacity: 0 }}
                      transition={{ delay: 0.05 }}
                      className="flex items-start gap-2"
                    >
                      {step.matched ? (
                        step.action === "allow" ? (
                          <Check size={12} className="text-green-400 mt-0.5 shrink-0" />
                        ) : (
                          <X size={12} className="text-red-400 mt-0.5 shrink-0" />
                        )
                      ) : (
                        <ChevronRight size={12} className="text-gray-600 mt-0.5 shrink-0" />
                      )}
                      <span className={step.matched ? (step.action === "allow" ? "text-green-400" : "text-red-400") : "text-gray-500"}>
                        [{step.rule}] {step.detail}
                      </span>
                    </motion.div>
                  ))}
                  {simResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`mt-2 pt-2 border-t border-gray-700 font-bold ${simResult.allowed ? "text-green-400" : "text-red-400"}`}
                    >
                      {simResult.allowed ? "ALLOW" : "DENY"} (matched: {simResult.matchedRule})
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===== Right: Firewall Rules ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Rules Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-3 py-2 bg-muted/50 border-b border-border">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Shield size={14} className="text-[#34A853]" />
                ファイアウォールルール
              </h3>
            </div>
            <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`px-3 py-2 text-[11px] ${
                    rule.action === "allow"
                      ? "bg-green-50/50 dark:bg-green-950/10"
                      : "bg-red-50/50 dark:bg-red-950/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{rule.name}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1 py-0 h-4 ${
                          rule.action === "allow"
                            ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                            : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                        }`}
                      >
                        {rule.action === "allow" ? "許可" : "拒否"}
                      </Badge>
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-muted-foreground">
                    <span>方向: {rule.direction === "ingress" ? "上り(ingress)" : "下り(egress)"}</span>
                    <span>優先度: {rule.priority}</span>
                    <span>送信元: {rule.source}</span>
                    <span>プロトコル: {rule.protocol}:{rule.ports}</span>
                    <span className="col-span-2">タグ: {rule.targetTags.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Rule Form */}
          <div className="rounded-xl border border-border p-3 space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Plus size={14} className="text-[#34A853]" />
              ルール追加
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">ルール名</label>
                <Input
                  className="h-7 text-xs"
                  placeholder="my-rule"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">方向</label>
                <Select value={newDirection} onValueChange={(v) => v && setNewDirection(v as "ingress" | "egress")}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingress">上り (ingress)</SelectItem>
                    <SelectItem value="egress">下り (egress)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">優先度 (0-65535)</label>
                <Input
                  className="h-7 text-xs"
                  type="number"
                  min={0}
                  max={65535}
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">アクション</label>
                <Select value={newAction} onValueChange={(v) => v && setNewAction(v as "allow" | "deny")}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">許可</SelectItem>
                    <SelectItem value="deny">拒否</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">送信元 (CIDR)</label>
                <Input
                  className="h-7 text-xs"
                  placeholder="0.0.0.0/0"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">ターゲットタグ</label>
                <Select value={newTargetTag} onValueChange={(v) => v && setNewTargetTag(v)}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["web", "http-server", "app", "internal", "db", "mysql"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">プロトコル</label>
                <Select value={newProtocol} onValueChange={(v) => v && setNewProtocol(v)}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="icmp">ICMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">ポート</label>
                <Input
                  className="h-7 text-xs"
                  placeholder="80,443"
                  value={newPorts}
                  onChange={(e) => setNewPorts(e.target.value)}
                />
              </div>
            </div>
            <Button
              size="sm"
              className="w-full bg-[#34A853] hover:bg-[#2d9248] text-white h-7 text-xs mt-1"
              onClick={addRule}
            >
              <Plus size={12} className="mr-1" />
              追加
            </Button>
          </div>

          {/* Implied Rules Info */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-amber-700 dark:text-amber-400">
              <Info size={13} />
              暗黙のルール
            </h4>
            <div className="space-y-2 text-[11px] text-muted-foreground">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-green-300 text-green-700 dark:border-green-700 dark:text-green-400 shrink-0 mt-0.5">
                  許可
                </Badge>
                <div>
                  <span className="font-medium text-foreground">implied-allow-egress</span>
                  <span className="ml-1">(priority 65534)</span>
                  <p className="mt-0.5">全ての送信トラフィックをデフォルトで許可</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 shrink-0 mt-0.5">
                  拒否
                </Badge>
                <div>
                  <span className="font-medium text-foreground">implied-deny-ingress</span>
                  <span className="ml-1">(priority 65535)</span>
                  <p className="mt-0.5">マッチするルールがない受信トラフィックを全て拒否</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  )
}
