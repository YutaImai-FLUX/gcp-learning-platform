"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Bot,
  Wrench,
  CheckCircle,
  Sparkles,
  Play,
  Plus,
  Code2,
  Globe,
  Search,
  BarChart3,
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DemoShell } from "@/components/demos/DemoShell"

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

interface AgentDef {
  id: string
  name: string
  model: string
  tools: string[]
  status: "idle" | "running" | "done"
}

interface ExecStep {
  id: number
  agentName: string
  action: string
  content: string
  timestamp: string
  type: "thinking" | "tool_call" | "tool_result" | "response"
}

// ──────────────────────────────────────────
// Constants
// ──────────────────────────────────────────

const MODELS = ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]

const TOOL_OPTIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "google_search", label: "google_search", icon: <Globe size={13} /> },
  { id: "code_interpreter", label: "code_interpreter", icon: <Code2 size={13} /> },
  { id: "bigquery_tool", label: "bigquery_tool", icon: <BarChart3 size={13} /> },
  { id: "vertex_ai_search", label: "vertex_ai_search", icon: <Search size={13} /> },
]

const TOOL_BADGE_COLOR: Record<string, string> = {
  google_search: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  code_interpreter: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  bigquery_tool: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  vertex_ai_search: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

const STEP_BORDER_COLOR: Record<ExecStep["type"], string> = {
  thinking: "border-l-[#4285F4]",
  tool_call: "border-l-[#FBBC05]",
  tool_result: "border-l-[#34A853]",
  response: "border-l-[#4285F4]",
}

// ──────────────────────────────────────────
// Helper: step icon
// ──────────────────────────────────────────

function StepIcon({ type }: { type: ExecStep["type"] }) {
  if (type === "thinking") return <Brain size={14} className="text-[#4285F4] shrink-0 mt-0.5" />
  if (type === "tool_call") return <Wrench size={14} className="text-[#FBBC05] shrink-0 mt-0.5" />
  if (type === "tool_result") return <CheckCircle size={14} className="text-[#34A853] shrink-0 mt-0.5" />
  return <Sparkles size={14} className="text-[#4285F4] shrink-0 mt-0.5" />
}

// ──────────────────────────────────────────
// Main page
// ──────────────────────────────────────────

export default function ADKDemo() {
  // Agent builder state
  const [agentName, setAgentName] = useState("my-research-agent")
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [agents, setAgents] = useState<AgentDef[]>([])

  // Workflow state
  const [task, setTask] = useState(
    "最新のAIトレンドを調べて、Pythonコードで分析レポートを作成してください"
  )
  const [orchMode, setOrchMode] = useState<"single" | "multi">("multi")
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<ExecStep[]>([])
  const [completed, setCompleted] = useState(false)
  const [metrics, setMetrics] = useState<{ time: number; tokens: number; stepCount: number } | null>(null)

  // ── Toggle tool selection ──
  function toggleTool(toolId: string) {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    )
  }

  // ── Create agent ──
  function createAgent() {
    if (!agentName.trim() || selectedTools.length === 0) return
    const newAgent: AgentDef = {
      id: `agent-${Date.now()}`,
      name: agentName.trim(),
      model: selectedModel,
      tools: [...selectedTools],
      status: "idle",
    }
    setAgents((prev) => [...prev, newAgent])
    setAgentName("my-research-agent")
    setSelectedTools([])
  }

  // ── Simulate execution ──
  async function runWorkflow() {
    if (agents.length === 0 || running) return
    setRunning(true)
    setCompleted(false)
    setSteps([])
    setMetrics(null)

    const primaryAgent = agents[0]
    const allTools = agents.flatMap((a) => a.tools)
    const hasCode = allTools.includes("code_interpreter")

    // Update agent statuses to running
    setAgents((prev) => prev.map((a) => ({ ...a, status: "running" })))

    const startTime = Date.now()
    let stepId = 0

    const addStep = async (step: Omit<ExecStep, "id" | "timestamp">) => {
      await new Promise((r) => setTimeout(r, 600))
      const newStep: ExecStep = {
        ...step,
        id: stepId++,
        timestamp: new Date().toLocaleTimeString("ja-JP"),
      }
      setSteps((prev) => [...prev, newStep])
    }

    // Step 1: Orchestrator thinking
    await addStep({
      type: "thinking",
      agentName: "Orchestrator",
      action: "タスク分析",
      content: "タスクを分析中... サブタスクに分割します",
    })

    // Step 2: Agent 1 google_search call
    await addStep({
      type: "tool_call",
      agentName: primaryAgent.name,
      action: "google_search",
      content: 'query: "AI trends 2025 machine learning"',
    })

    // Step 3: google_search result
    await addStep({
      type: "tool_result",
      agentName: primaryAgent.name,
      action: "google_search",
      content:
        "10件の検索結果を取得。主要トレンド: マルチモーダルAI、AIエージェント、オープンソースLLM...",
    })

    // Step 4 & 5: code_interpreter (if available)
    if (hasCode) {
      const codeAgent = agents.find((a) => a.tools.includes("code_interpreter")) ?? primaryAgent
      await addStep({
        type: "tool_call",
        agentName: codeAgent.name,
        action: "code_interpreter",
        content:
          "```python\nimport pandas as pd\ntrends = ['Multimodal AI', 'AI Agents', 'Open Source LLM']\n...",
      })
      await addStep({
        type: "tool_result",
        agentName: codeAgent.name,
        action: "code_interpreter",
        content: "コード実行完了。出力: データフレーム生成 (3 rows × 4 cols)",
      })
    }

    // Step: Orchestrator synthesizing
    await addStep({
      type: "thinking",
      agentName: "Orchestrator",
      action: "結果統合",
      content: "各エージェントの結果を統合中...",
    })

    // Final response
    await addStep({
      type: "response",
      agentName: "Orchestrator",
      action: "最終回答",
      content:
        "## AIトレンド分析レポート\n\n**トップ3トレンド:**\n1. マルチモーダルAI: テキスト・画像・音声を統合...\n2. AIエージェント: 自律的なタスク実行...\n3. オープンソースLLM: Llama, Mistral等...",
    })

    const elapsed = Math.round((Date.now() - startTime) / 1000)
    setMetrics({ time: elapsed, tokens: Math.floor(Math.random() * 1500) + 800, stepCount: stepId })
    setAgents((prev) => prev.map((a) => ({ ...a, status: "done" })))
    setCompleted(true)
    setRunning(false)
  }

  // ── Reset ──
  function resetWorkflow() {
    setSteps([])
    setCompleted(false)
    setMetrics(null)
    setAgents((prev) => prev.map((a) => ({ ...a, status: "idle" })))
  }

  // ── Final response step ──
  const finalStep = steps.find((s) => s.type === "response")

  return (
    <DemoShell
      title="Agent Development Kit (ADK)"
      description="Geminiを活用したAIエージェントの構築・マルチエージェントオーケストレーションを体験"
      service="Vertex AI ADK"
      color="#4285F4"
      demoId="adk"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ════════════════════════════════════════
            LEFT COLUMN: Agent Registry & Config
        ════════════════════════════════════════ */}
        <div className="space-y-5">
          {/* ── Agent Builder ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plus size={14} />
              エージェントビルダー
            </h3>

            {/* Agent name */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">エージェント名</label>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="my-research-agent"
                className="text-sm font-mono"
              />
            </div>

            {/* Model selector */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">モデル</label>
              <Select value={selectedModel} onValueChange={(v) => v && setSelectedModel(v)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m} value={m} className="font-mono text-sm">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tools checklist */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">ツール</label>
              <div className="flex flex-wrap gap-2">
                {TOOL_OPTIONS.map((tool) => {
                  const active = selectedTools.includes(tool.id)
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                        active
                          ? "border-[#4285F4] bg-blue-50 text-[#4285F4] dark:bg-blue-950 dark:text-blue-300"
                          : "border-border text-muted-foreground hover:border-[#4285F4]/50"
                      }`}
                    >
                      {tool.icon}
                      {tool.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Create button */}
            <Button
              onClick={createAgent}
              disabled={!agentName.trim() || selectedTools.length === 0}
              className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white"
              size="sm"
            >
              <Plus size={14} className="mr-1.5" />
              エージェントを作成
            </Button>
          </div>

          {/* ── Agents List ── */}
          {agents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Bot size={14} />
                登録済みエージェント ({agents.length})
              </h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 rounded-lg border border-border bg-muted/20 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Bot size={14} className="text-[#4285F4]" />
                        <span className="text-sm font-medium font-mono">{agent.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          agent.status === "running"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : agent.status === "done"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {agent.status === "running" && (
                          <RefreshCw size={10} className="inline mr-0.5 animate-spin" />
                        )}
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Badge variant="outline" className="text-xs font-mono px-1.5 py-0">
                        {agent.model}
                      </Badge>
                      {agent.tools.map((t) => (
                        <span
                          key={t}
                          className={`text-xs px-1.5 py-0.5 rounded ${TOOL_BADGE_COLOR[t] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agents.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2 border border-dashed border-border rounded-lg">
              <Bot size={28} className="opacity-20" />
              <p className="text-xs">エージェントを作成してください</p>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            RIGHT COLUMN: Workflow Execution
        ════════════════════════════════════════ */}
        <div className="space-y-5">
          {agents.length > 0 ? (
            <>
              {/* ── Orchestrator ── */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ChevronRight size={14} />
                  オーケストレーター
                </h3>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">タスクを入力</label>
                  <Textarea
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    rows={3}
                    className="text-sm resize-none"
                    placeholder="タスクを入力..."
                  />
                </div>

                {/* Orchestration mode */}
                <div className="flex gap-2">
                  {(["single", "multi"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setOrchMode(mode)}
                      className={`flex-1 py-1.5 text-xs rounded-md border transition-all ${
                        orchMode === mode
                          ? "border-[#4285F4] bg-blue-50 text-[#4285F4] font-medium dark:bg-blue-950 dark:text-blue-300"
                          : "border-border text-muted-foreground hover:border-[#4285F4]/50"
                      }`}
                    >
                      {mode === "single" ? "シングルエージェント" : "マルチエージェント"}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={runWorkflow}
                    disabled={running || !task.trim()}
                    className="flex-1 bg-[#34A853] hover:bg-[#2d9248] text-white"
                    size="sm"
                  >
                    {running ? (
                      <>
                        <RefreshCw size={13} className="mr-1.5 animate-spin" />
                        ADK実行中...
                      </>
                    ) : (
                      <>
                        <Play size={13} className="mr-1.5" />
                        実行
                      </>
                    )}
                  </Button>
                  {(steps.length > 0 || completed) && (
                    <Button variant="outline" size="sm" onClick={resetWorkflow} disabled={running}>
                      <RefreshCw size={13} />
                    </Button>
                  )}
                </div>
              </div>

              {/* ── Execution Log ── */}
              {steps.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles size={14} />
                    実行ログ
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {steps.map((step) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`p-3 rounded-lg bg-muted/30 border-l-4 ${STEP_BORDER_COLOR[step.type]} space-y-1`}
                        >
                          <div className="flex items-start gap-2">
                            <StepIcon type={step.type} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-foreground">
                                  {step.agentName}
                                </span>
                                <ChevronRight size={10} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-mono">
                                  {step.action}
                                </span>
                                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                                  {step.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-foreground/80 mt-0.5 whitespace-pre-wrap line-clamp-4">
                                {step.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── Final Response ── */}
              {completed && finalStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#34A853]" />
                    最終レスポンス
                  </h3>
                  <div className="p-4 rounded-lg border-2 border-[#34A853] bg-green-50/40 dark:bg-green-950/20 space-y-2">
                    <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {finalStep.content}
                    </pre>
                  </div>
                  {metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { label: "実行時間", value: `${metrics.time}s` },
                        { label: "トークン", value: metrics.tokens.toLocaleString() },
                        { label: "ステップ", value: `${metrics.stepCount}` },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="p-2 rounded-md bg-muted/40 text-center space-y-0.5"
                        >
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="text-sm font-semibold font-mono text-foreground">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm gap-2 border border-dashed border-border rounded-lg">
              <Play size={28} className="opacity-20" />
              <p className="text-xs">左側でエージェントを作成すると実行できます</p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
