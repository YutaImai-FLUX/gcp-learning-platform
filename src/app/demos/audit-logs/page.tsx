"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Play, Pause, ChevronDown, ChevronRight,
  AlertTriangle, Shield, ShieldAlert, Key, Lock, Mail,
  Clock, FileText, Eye, CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DemoShell } from "@/components/demos/DemoShell"

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuditLogEntry {
  id: string
  timestamp: string
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"
  logType: "Admin Activity" | "Data Access" | "System Event"
  principal: string
  method: string
  resource: string
  resourceType: string
  status: "success" | "error"
  suspicious: boolean
  callerIp?: string
  detail?: string
}

interface IncidentEvent {
  time: string
  event: string
  severity: string
  type: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LOG_ENTRIES: AuditLogEntry[] = [
  { id: "log-1", timestamp: "14:23:01.234", severity: "INFO", logType: "Data Access", principal: "tanaka@flux-corp.com", method: "bigquery.tables.getData", resource: "analytics_dataset.events", resourceType: "BigQuery", status: "success", suspicious: false, callerIp: "35.200.1.100" },
  { id: "log-2", timestamp: "14:23:05.891", severity: "INFO", logType: "Admin Activity", principal: "suzuki@flux-corp.com", method: "compute.instances.start", resource: "web-server-1", resourceType: "Compute Engine", status: "success", suspicious: false, callerIp: "35.200.1.101" },
  { id: "log-3", timestamp: "14:23:12.456", severity: "INFO", logType: "Data Access", principal: "data-pipeline@proj.iam", method: "storage.objects.get", resource: "gs://data-bucket/file.csv", resourceType: "Cloud Storage", status: "success", suspicious: false, callerIp: "35.200.1.102" },
  { id: "log-4", timestamp: "14:23:18.789", severity: "WARNING", logType: "Admin Activity", principal: "unknown@gmail.com", method: "iam.serviceAccountKeys.create", resource: "data-export@proj.iam", resourceType: "IAM", status: "error", suspicious: true, callerIp: "203.0.113.42", detail: "Permission denied: external account" },
  { id: "log-5", timestamp: "14:23:22.012", severity: "INFO", logType: "System Event", principal: "system", method: "compute.instances.automaticRestart", resource: "batch-worker-3", resourceType: "Compute Engine", status: "success", suspicious: false },
  { id: "log-6", timestamp: "14:23:28.345", severity: "ERROR", logType: "Data Access", principal: "legacy-batch@proj.iam", method: "bigquery.jobs.create", resource: "analytics_dataset", resourceType: "BigQuery", status: "error", suspicious: false, callerIp: "35.200.1.103", detail: "Quota exceeded: concurrent queries" },
  { id: "log-7", timestamp: "14:23:35.678", severity: "CRITICAL", logType: "Admin Activity", principal: "admin@flux-corp.com", method: "iam.serviceAccountKeys.create", resource: "data-export@proj.iam", resourceType: "IAM", status: "success", suspicious: true, callerIp: "203.0.113.42", detail: "Key created from unusual IP at unusual time" },
  { id: "log-8", timestamp: "14:23:42.901", severity: "WARNING", logType: "Data Access", principal: "data-export@proj.iam", method: "bigquery.tables.export", resource: "analytics_dataset.users (100GB)", resourceType: "BigQuery", status: "success", suspicious: true, callerIp: "203.0.113.42", detail: "Large data export from new SA key" },
  { id: "log-9", timestamp: "14:23:48.234", severity: "INFO", logType: "Data Access", principal: "tanaka@flux-corp.com", method: "storage.objects.list", resource: "gs://app-assets/", resourceType: "Cloud Storage", status: "success", suspicious: false, callerIp: "35.200.1.100" },
  { id: "log-10", timestamp: "14:23:55.567", severity: "INFO", logType: "Admin Activity", principal: "ci-cd@proj.iam", method: "run.services.create", resource: "api-service-v2", resourceType: "Cloud Run", status: "success", suspicious: false, callerIp: "35.200.1.104" },
  { id: "log-11", timestamp: "14:24:02.890", severity: "WARNING", logType: "Admin Activity", principal: "admin@flux-corp.com", method: "storage.buckets.setIamPolicy", resource: "gs://export-bucket", resourceType: "Cloud Storage", status: "success", suspicious: true, callerIp: "203.0.113.42", detail: "Bucket policy changed to allow allUsers" },
  { id: "log-12", timestamp: "14:24:08.123", severity: "INFO", logType: "Data Access", principal: "monitoring@proj.iam", method: "monitoring.timeSeries.list", resource: "projects/my-project", resourceType: "Monitoring", status: "success", suspicious: false, callerIp: "35.200.1.105" },
]

const INCIDENT_TIMELINE: IncidentEvent[] = [
  { time: "02:28:15", event: "admin@flux-corp.com が異常なIPアドレス (203.0.113.42) からログイン", severity: "WARNING", type: "認証" },
  { time: "02:30:42", event: "data-export@proj.iam のサービスアカウントキーが作成された", severity: "CRITICAL", type: "IAM" },
  { time: "02:32:18", event: "作成されたSAキーがダウンロードされた", severity: "CRITICAL", type: "IAM" },
  { time: "02:35:03", event: "bigquery.tables.export が実行 (analytics_dataset.users, 100GB)", severity: "CRITICAL", type: "データアクセス" },
  { time: "02:36:27", event: "gs://export-bucket/export-data-2026.csv が作成された (100GB)", severity: "WARNING", type: "ストレージ" },
  { time: "02:37:45", event: "export-bucket のIAMポリシーが変更 (allUsers追加)", severity: "CRITICAL", type: "IAM" },
  { time: "02:38:12", event: "外部IP (198.51.100.10) から export-data-2026.csv がダウンロードされた", severity: "CRITICAL", type: "データ流出" },
]

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  ERROR: "bg-red-400 text-white",
  WARNING: "bg-amber-400 text-black",
  INFO: "bg-blue-400 text-white",
}

const LOG_TYPE_COLORS: Record<string, string> = {
  "Admin Activity": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Data Access": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "System Event": "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

const RESOURCE_TYPES = ["All", "BigQuery", "Cloud Storage", "Compute Engine", "IAM", "Cloud Run", "Monitoring"]

// ─── Helper: generate random timestamp ────────────────────────────────────────
function nextTimestamp(prev: string): string {
  const [h, m, rest] = prev.split(":")
  const [s, ms] = rest.split(".")
  let newMs = parseInt(ms) + Math.floor(Math.random() * 800 + 100)
  let newS = parseInt(s)
  let newM = parseInt(m)
  let newH = parseInt(h)
  if (newMs >= 1000) { newMs -= 1000; newS++ }
  if (newS >= 60) { newS -= 60; newM++ }
  if (newM >= 60) { newM -= 60; newH++ }
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}:${String(newS).padStart(2, "0")}.${String(newMs).padStart(3, "0")}`
}

function randomEntry(id: number, ts: string): AuditLogEntry {
  const templates = [
    { severity: "INFO" as const, logType: "Data Access" as const, principal: "tanaka@flux-corp.com", method: "bigquery.tables.getData", resource: "analytics_dataset.events", resourceType: "BigQuery", status: "success" as const, suspicious: false, callerIp: "35.200.1.100" },
    { severity: "INFO" as const, logType: "Admin Activity" as const, principal: "ci-cd@proj.iam", method: "run.services.update", resource: "api-service-v2", resourceType: "Cloud Run", status: "success" as const, suspicious: false, callerIp: "35.200.1.104" },
    { severity: "INFO" as const, logType: "Data Access" as const, principal: "data-pipeline@proj.iam", method: "storage.objects.get", resource: "gs://data-bucket/input.csv", resourceType: "Cloud Storage", status: "success" as const, suspicious: false, callerIp: "35.200.1.102" },
    { severity: "WARNING" as const, logType: "Admin Activity" as const, principal: "admin@flux-corp.com", method: "iam.roles.update", resource: "roles/customEditor", resourceType: "IAM", status: "success" as const, suspicious: true, callerIp: "203.0.113.42", detail: "Role permissions expanded" },
    { severity: "INFO" as const, logType: "System Event" as const, principal: "system", method: "compute.instances.automaticRestart", resource: "batch-worker-5", resourceType: "Compute Engine", status: "success" as const, suspicious: false },
    { severity: "ERROR" as const, logType: "Data Access" as const, principal: "legacy-batch@proj.iam", method: "bigquery.jobs.create", resource: "analytics_dataset", resourceType: "BigQuery", status: "error" as const, suspicious: false, callerIp: "35.200.1.103", detail: "Quota exceeded" },
  ]
  const t = templates[Math.floor(Math.random() * templates.length)]
  return { ...t, id: `log-stream-${id}`, timestamp: ts }
}

// ─── JSON detail builder ──────────────────────────────────────────────────────
function buildJsonDetail(entry: AuditLogEntry): string {
  return JSON.stringify({
    protoPayload: {
      "@type": "type.googleapis.com/google.cloud.audit.AuditLog",
      serviceName: `${entry.resourceType.toLowerCase().replace(/\s/g, "")}.googleapis.com`,
      methodName: entry.method,
      authenticationInfo: { principalEmail: entry.principal },
      requestMetadata: { callerIp: entry.callerIp || "internal" },
      resourceName: entry.resource,
      status: entry.status === "error" ? { code: 7, message: entry.detail || "PERMISSION_DENIED" } : { code: 0 },
    },
    severity: entry.severity,
    logName: `projects/my-project/logs/cloudaudit.googleapis.com%2F${entry.logType === "Admin Activity" ? "activity" : entry.logType === "Data Access" ? "data_access" : "system_event"}`,
    timestamp: `2026-03-29T${entry.timestamp}Z`,
  }, null, 2)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuditLogsDemo() {
  const [activeTab, setActiveTab] = useState<"stream" | "investigation">("stream")

  return (
    <DemoShell
      title="Cloud Audit Logs & インシデント調査"
      description="監査ログのリアルタイム分析とセキュリティインシデントの調査を体験する"
      service="Cloud Logging"
      color="#4285F4"
    >
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {[
          { key: "stream" as const, label: "ログストリーム", icon: <Eye size={14} /> },
          { key: "investigation" as const, label: "インシデント調査", icon: <ShieldAlert size={14} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#4285F4] text-[#4285F4]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "stream" ? (
          <motion.div key="stream" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LogStreamTab />
          </motion.div>
        ) : (
          <motion.div key="investigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InvestigationTab />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoShell>
  )
}

// ─── Tab 1: Log Stream ───────────────────────────────────────────────────────
function LogStreamTab() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_LOG_ENTRIES)
  const [streaming, setStreaming] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [logTypes, setLogTypes] = useState({ "Admin Activity": true, "Data Access": true, "System Event": true })
  const [severity, setSeverity] = useState("ALL")
  const [principalFilter, setPrincipalFilter] = useState("")
  const [resourceType, setResourceType] = useState("All")
  const streamCounter = useRef(0)
  const lastTs = useRef("14:24:08.123")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!streaming) return
    const interval = setInterval(() => {
      streamCounter.current++
      lastTs.current = nextTimestamp(lastTs.current)
      const entry = randomEntry(streamCounter.current, lastTs.current)
      setLogs((prev) => [...prev.slice(-80), entry])
    }, 1200)
    return () => clearInterval(interval)
  }, [streaming])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const filtered = logs.filter((l) => {
    if (!logTypes[l.logType]) return false
    if (severity !== "ALL" && l.severity !== severity) return false
    if (principalFilter && !l.principal.toLowerCase().includes(principalFilter.toLowerCase())) return false
    if (resourceType !== "All" && l.resourceType !== resourceType) return false
    return true
  })

  const anomalyCount = filtered.filter((l) => l.suspicious).length

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-1 mr-2">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">フィルタ:</span>
        </div>

        {/* Log type checkboxes */}
        <div className="flex items-center gap-2">
          {(["Admin Activity", "Data Access", "System Event"] as const).map((lt) => (
            <label key={lt} className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={logTypes[lt]}
                onChange={() => setLogTypes((p) => ({ ...p, [lt]: !p[lt] }))}
                className="rounded border-border"
              />
              <span>{lt}</span>
            </label>
          ))}
        </div>

        <span className="text-border">|</span>

        {/* Severity */}
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="text-xs rounded border border-border bg-background px-2 py-1"
        >
          {["ALL", "CRITICAL", "ERROR", "WARNING", "INFO"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Principal */}
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Principal..."
            value={principalFilter}
            onChange={(e) => setPrincipalFilter(e.target.value)}
            className="text-xs rounded border border-border bg-background pl-6 pr-2 py-1 w-36"
          />
        </div>

        {/* Resource type */}
        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="text-xs rounded border border-border bg-background px-2 py-1"
        >
          {RESOURCE_TYPES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setSeverity("ALL"); setPrincipalFilter(""); setResourceType("All"); setLogTypes({ "Admin Activity": true, "Data Access": true, "System Event": true }) }}>
            リセット
          </Button>
          <Button
            size="sm"
            className={`text-xs h-7 gap-1 ${streaming ? "bg-red-500 hover:bg-red-600" : "bg-[#4285F4] hover:bg-[#3367D6]"}`}
            onClick={() => setStreaming(!streaming)}
          >
            {streaming ? <><Pause size={12} /> 停止</> : <><Play size={12} /> ストリーム開始</>}
          </Button>
        </div>
      </div>

      {/* Counters */}
      <div className="flex gap-4 text-xs">
        <span className="text-muted-foreground">合計: <strong className="text-foreground">{logs.length}</strong></span>
        <span className="text-muted-foreground">表示: <strong className="text-foreground">{filtered.length}</strong></span>
        <span className="text-muted-foreground">異常検出: <strong className="text-amber-500">{anomalyCount}</strong></span>
      </div>

      {/* Log stream */}
      <div ref={scrollRef} className="bg-[#0d1117] rounded-lg border border-gray-800 overflow-auto max-h-[420px] font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">フィルタに一致するログがありません</div>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id}>
              <div
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className={`flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer border-l-2 transition-colors ${
                  entry.suspicious
                    ? entry.severity === "CRITICAL" ? "border-l-red-500 bg-red-500/5" : "border-l-amber-500 bg-amber-500/5"
                    : "border-l-transparent"
                }`}
              >
                {expandedId === entry.id ? <ChevronDown size={12} className="text-gray-500 shrink-0" /> : <ChevronRight size={12} className="text-gray-500 shrink-0" />}
                <span className="text-gray-500 w-[90px] shrink-0">{entry.timestamp}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${SEVERITY_COLORS[entry.severity]}`}>
                  {entry.severity}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] border shrink-0 ${LOG_TYPE_COLORS[entry.logType]}`}>
                  {entry.logType}
                </span>
                <span className="text-cyan-400 w-[180px] truncate shrink-0">{entry.principal}</span>
                <span className="text-green-400 w-[240px] truncate shrink-0">{entry.method}</span>
                <span className="text-gray-400 truncate flex-1">{entry.resource}</span>
                <span className="shrink-0">{entry.status === "success" ? "✅" : "❌"}</span>
              </div>

              <AnimatePresence>
                {expandedId === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <pre className="px-8 py-3 text-[11px] text-gray-300 bg-[#161b22] border-t border-gray-800 whitespace-pre-wrap">
                      {buildJsonDetail(entry)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Tab 2: Incident Investigation ──────────────────────────────────────────
function InvestigationTab() {
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [actions, setActions] = useState<Record<string, boolean>>({})
  const [actionAnimating, setActionAnimating] = useState<string | null>(null)

  const steps = [
    "トリガーイベントを確認",
    "関連アクティビティを追跡",
    "ブラスト半径を分析",
    "インシデント対応",
    "レポート生成",
  ]

  const executeAction = useCallback((key: string) => {
    setActionAnimating(key)
    setTimeout(() => {
      setActions((p) => ({ ...p, [key]: true }))
      setActionAnimating(null)
    }, 1500)
  }, [])

  const allActionsComplete = ["key", "sa", "bucket", "notify"].every((k) => actions[k])

  return (
    <div className="space-y-4">
      {/* Scenario header */}
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-500 text-sm">アラート: 不審なデータエクスポートを検出</h3>
            <p className="text-xs text-muted-foreground mt-1">
              深夜にサービスアカウントキーが作成され、大量のデータエクスポートが検出されました
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < currentStep ? "bg-green-500 text-white" : i === currentStep ? "bg-[#4285F4] text-white" : "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[11px] hidden sm:inline ${i === currentStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-6 h-0.5 mx-1 ${i < currentStep ? "bg-green-500" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {currentStep === 0 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Eye size={16} /> Step 1: トリガーイベントを確認</h4>
            <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500 text-white text-[10px]">CRITICAL</Badge>
                <span className="text-gray-400">02:30:42 JST</span>
              </div>
              <div className="text-gray-300 space-y-1">
                <p><span className="text-cyan-400">principal:</span> admin@flux-corp.com</p>
                <p><span className="text-green-400">method:</span> iam.serviceAccountKeys.create</p>
                <p><span className="text-amber-400">resource:</span> data-export@proj.iam.gserviceaccount.com</p>
                <p><span className="text-red-400">callerIp:</span> 203.0.113.42 (通常と異なるIPアドレス)</p>
              </div>
            </div>
            <Button size="sm" className="bg-[#4285F4] hover:bg-[#3367D6] text-xs" onClick={() => setCurrentStep(1)}>
              次のステップ <ChevronRight size={14} />
            </Button>
          </motion.div>
        )}

        {/* Step 2 */}
        {currentStep === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Clock size={16} /> Step 2: 関連アクティビティを追跡</h4>
            <div className="relative pl-6 space-y-0">
              {INCIDENT_TIMELINE.map((evt, i) => (
                <div key={i} className="relative pb-4">
                  {/* Timeline line */}
                  {i < INCIDENT_TIMELINE.length - 1 && (
                    <div className="absolute left-[-16px] top-3 w-0.5 h-full bg-border" />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-[-20px] top-1.5 w-3 h-3 rounded-full border-2 ${
                    evt.severity === "CRITICAL" ? "bg-red-500 border-red-300" : "bg-amber-500 border-amber-300"
                  }`} />

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      evt.severity === "CRITICAL" ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10" : "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{evt.time}</span>
                      <Badge className={`text-[10px] ${evt.severity === "CRITICAL" ? SEVERITY_COLORS.CRITICAL : SEVERITY_COLORS.WARNING}`}>{evt.severity}</Badge>
                      <Badge variant="outline" className="text-[10px]">{evt.type}</Badge>
                    </div>
                    <p className="text-xs mt-1">{evt.event}</p>
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setCurrentStep(0)}>戻る</Button>
              <Button size="sm" className="bg-[#4285F4] hover:bg-[#3367D6] text-xs" onClick={() => setCurrentStep(2)}>
                次のステップ <ChevronRight size={14} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {currentStep === 2 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Shield size={16} /> Step 3: ブラスト半径を分析</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                <h5 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1"><Key size={12} /> 侵害されたSA</h5>
                <p className="text-xs font-mono">data-export@proj.iam</p>
                <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <p>roles/bigquery.dataViewer</p>
                  <p>roles/storage.objectAdmin</p>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1"><Eye size={12} /> アクセスされたデータ</h5>
                <p className="text-xs font-mono">analytics_dataset.users</p>
                <p className="text-[11px] text-muted-foreground mt-1">100GB / ユーザー個人情報含む</p>
              </div>
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1"><FileText size={12} /> 作成されたファイル</h5>
                <p className="text-xs font-mono break-all">gs://export-bucket/export-data-2026.csv</p>
                <p className="text-[11px] text-muted-foreground mt-1">外部IPからダウンロード済み</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-500" />
                <span className="text-sm font-bold text-red-500">リスク評価: 高</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">個人情報を含む大量データが外部に流出した可能性があります。即座に対応が必要です。</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setCurrentStep(1)}>戻る</Button>
              <Button size="sm" className="bg-[#4285F4] hover:bg-[#3367D6] text-xs" onClick={() => setCurrentStep(3)}>
                次のステップ <ChevronRight size={14} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4 */}
        {currentStep === 3 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><ShieldAlert size={16} /> Step 4: インシデント対応</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "key", icon: <Key size={14} />, label: "SA キーを無効化", desc: "侵害されたサービスアカウントキーを失効させる" },
                { key: "sa", icon: <Shield size={14} />, label: "SA を無効化", desc: "data-export サービスアカウントを無効にする" },
                { key: "bucket", icon: <Lock size={14} />, label: "バケットをロック", desc: "export-bucket のパブリックアクセスを削除する" },
                { key: "notify", icon: <Mail size={14} />, label: "セキュリティチームに通知", desc: "インシデントレポートを送信する" },
              ].map((action) => (
                <motion.div
                  key={action.key}
                  className={`p-4 rounded-lg border transition-colors ${
                    actions[action.key]
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-border hover:border-[#4285F4]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1.5">{action.icon} {action.label}</span>
                    {actions[action.key] && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{action.desc}</p>
                  <Button
                    size="sm"
                    className="text-xs w-full"
                    variant={actions[action.key] ? "outline" : "default"}
                    disabled={!!actions[action.key] || actionAnimating === action.key}
                    onClick={() => executeAction(action.key)}
                  >
                    {actionAnimating === action.key ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block">
                        ⏳
                      </motion.span>
                    ) : actions[action.key] ? "完了" : "実行"}
                  </Button>
                  <AnimatePresence>
                    {actions[action.key] && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 p-2 rounded bg-[#0d1117] font-mono text-[10px] text-green-400">
                        {action.key === "key" && "✅ SA key disabled: data-export@proj.iam (key_id: a1b2c3d4)"}
                        {action.key === "sa" && "✅ SA disabled: data-export@proj.iam.gserviceaccount.com"}
                        {action.key === "bucket" && "✅ Removed allUsers from gs://export-bucket IAM policy"}
                        {action.key === "notify" && "✅ Incident report sent to security-team@flux-corp.com"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setCurrentStep(2)}>戻る</Button>
              <Button size="sm" className="bg-[#4285F4] hover:bg-[#3367D6] text-xs" disabled={!allActionsComplete} onClick={() => setCurrentStep(4)}>
                次のステップ <ChevronRight size={14} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5 */}
        {currentStep === 4 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><FileText size={16} /> Step 5: レポート生成</h4>
            <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4 text-xs">
              <div>
                <h5 className="font-bold text-sm mb-1">インシデントレポート</h5>
                <p className="text-muted-foreground">生成日時: 2026-03-29 03:15 JST | ステータス: 対応完了</p>
              </div>
              <div>
                <h6 className="font-semibold mb-1">概要</h6>
                <p className="text-muted-foreground">2026-03-29 02:28 JST、admin@flux-corp.com のアカウントが異常なIPアドレス (203.0.113.42) から使用され、サービスアカウントキーの作成と大量データのエクスポートが行われました。</p>
              </div>
              <div>
                <h6 className="font-semibold mb-1">タイムライン</h6>
                <div className="space-y-1 font-mono text-[11px]">
                  {INCIDENT_TIMELINE.map((evt, i) => (
                    <p key={i} className="text-muted-foreground"><span className="text-foreground">{evt.time}</span> — {evt.event}</p>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="font-semibold mb-1">影響範囲</h6>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>侵害されたSA: data-export@proj.iam</li>
                  <li>流出データ: analytics_dataset.users (100GB, 個人情報含む)</li>
                  <li>流出先: 外部IP 198.51.100.10</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold mb-1">実施した対応</h6>
                <ul className="list-disc list-inside text-green-600 dark:text-green-400 space-y-0.5">
                  <li>SAキーを無効化</li>
                  <li>サービスアカウントを無効化</li>
                  <li>バケットのパブリックアクセスを削除</li>
                  <li>セキュリティチームに通知済み</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold mb-1">推奨事項</h6>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>admin@flux-corp.com のパスワードをリセットし、MFAを再設定する</li>
                  <li>全SAキーのローテーションを実施する</li>
                  <li>VPC Service Controls の導入を検討する</li>
                  <li>異常検知アラートの閾値を見直す</li>
                  <li>データ分類ポリシーを策定し、機密データのアクセス制限を強化する</li>
                </ul>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => { setCurrentStep(0); setActions({}) }}>
              最初からやり直す
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
