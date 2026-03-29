"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Send, RefreshCw, Activity, Clock, Cpu, Plus, CheckCircle2, XCircle, Zap, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DemoShell } from "@/components/demos/DemoShell"
import { VERTEX_MODELS, VERTEX_PREDICTION_EXAMPLES } from "@/lib/data/demo-data"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Tab = "models" | "gemini" | "training"

interface Prediction {
  input: string
  output: { label: string; confidence: number }
  latency: number
  timestamp: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface TrainingJob {
  id: string
  name: string
  status: "running" | "completed" | "failed"
  progress: number
  duration: string
  machineType: string
  startTime: string
  dataset: string
  modelType: string
}

const INITIAL_TRAINING_JOBS: TrainingJob[] = [
  {
    id: "job-001",
    name: "fraud-detection-v3",
    status: "completed",
    progress: 100,
    duration: "2h 14m",
    machineType: "n1-standard-8",
    startTime: "2026-03-26 10:00",
    dataset: "gs://my-dataset/fraud/train_v3.csv",
    modelType: "AutoML",
  },
  {
    id: "job-002",
    name: "sentiment-custom-bert",
    status: "running",
    progress: 67,
    duration: "1h 23m (実行中)",
    machineType: "n1-standard-8 x4",
    startTime: "2026-03-26 13:00",
    dataset: "gs://my-dataset/sentiment/corpus_ja.jsonl",
    modelType: "Custom (BERT)",
  },
  {
    id: "job-003",
    name: "image-classifier-v1",
    status: "failed",
    progress: 38,
    duration: "44m (失敗)",
    machineType: "n1-highmem-4",
    startTime: "2026-03-26 11:45",
    dataset: "gs://my-dataset/images/labeled_v1/",
    modelType: "AutoML Vision",
  },
]

const DEPLOYED_ENDPOINTS = [
  { name: "fraud-detection-endpoint", model: "fraud-detection-v2", traffic: 100, rps: 142 },
  { name: "sentiment-endpoint-prod", model: "sentiment-bert-v4", traffic: 80, rps: 37 },
]

function getGeminiResponse(msg: string, model: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes("bigquery") || lower.includes("ビッグクエリ")) {
    return `BigQueryはサーバーレスのデータウェアハウスで、ペタバイト規模のデータを標準SQLで分析できます。\n\n主な特徴:\n• サーバーレス — インフラ管理不要\n• カラム型ストレージによる高速分析\n• 最初の1TB/月のクエリ処理は無料\n• BQML でSQL内から機械学習モデルを訓練可能\n\n${model} を使用してお答えしました。`
  }
  if (lower.includes("kubernetes") || lower.includes("gke") || lower.includes("コンテナ")) {
    return `Google Kubernetes Engine (GKE) は、Google が管理するマネージドKubernetesサービスです。\n\n主な特徴:\n• Autopilotモード — ノードの管理が完全自動\n• 自動スケーリング (HPA/VPA/Cluster Autoscaler)\n• Workload Identity でGCPサービスへ安全にアクセス\n• Anthos によるハイブリッドクラスター管理\n\n${model} を使用してお答えしました。`
  }
  if (lower.includes("gcp") || lower.includes("google cloud") || lower.includes("クラウド")) {
    return `Google Cloud Platform (GCP) は、Googleのインフラ上で動作するクラウドコンピューティングサービス群です。\n\n主要サービス:\n• Compute Engine — IaaS仮想マシン\n• Cloud Run — サーバーレスコンテナ実行\n• BigQuery — サーバーレスデータウェアハウス\n• Vertex AI — フルマネージドML基盤\n• Cloud Storage — オブジェクトストレージ\n\n${model} を使用してお答えしました。`
  }
  return `ご質問ありがとうございます。${model} を使用してお答えします。\n\nVertex AI の Gemini API は、テキスト生成・要約・コード生成・マルチモーダル理解など幅広いタスクに対応しています。システムプロンプトでモデルの振る舞いをカスタマイズでき、temperature パラメータで出力の多様性を制御できます。\n\n本番環境では Vertex AI SDK または REST API 経由でご利用いただけます。`
}

export default function VertexAIDemo() {
  const mountedRef = useRef(true)

  // Models tab
  const [selectedModel, setSelectedModel] = useState(VERTEX_MODELS[1].id)
  const [predInput, setPredInput] = useState(VERTEX_PREDICTION_EXAMPLES[0].input)
  const [predicting, setPredicting] = useState(false)
  const [history, setHistory] = useState<Prediction[]>([])
  const [progress, setProgress] = useState(0)

  // Tab
  const [tab, setTab] = useState<Tab>("models")

  // Gemini tab
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("あなたはGCPエキスパートです。")
  const [temperature, setTemperature] = useState(0.7)
  const [geminiModel, setGeminiModel] = useState("gemini-2.0-flash")

  // Training tab
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>(INITIAL_TRAINING_JOBS)
  const [creatingJob, setCreatingJob] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, streamedText])

  const model = VERTEX_MODELS.find((m) => m.id === selectedModel)

  async function predict() {
    if (!predInput || !model || model.status !== "Deployed") return
    setPredicting(true)
    setProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 80))
      if (!mountedRef.current) return
      setProgress(i)
    }
    const example = VERTEX_PREDICTION_EXAMPLES.find((e) =>
      predInput.includes(e.input.slice(0, 10))
    )
    const output = example?.output ?? {
      label: predInput.length % 3 === 0 ? "POSITIVE" : predInput.length % 3 === 1 ? "NEGATIVE" : "NEUTRAL",
      confidence: Math.random() * 0.2 + 0.8,
    }
    const latency = Math.floor(Math.random() * 50 + 25)
    if (!mountedRef.current) return
    setHistory((prev) => [
      { input: predInput, output, latency, timestamp: new Date().toLocaleTimeString("ja-JP") },
      ...prev,
    ])
    setPredicting(false)
  }

  async function sendMessage() {
    if (!userInput.trim() || streaming) return
    const msg = userInput.trim()
    setChatMessages((prev) => [...prev, { role: "user", content: msg }])
    setUserInput("")
    setStreaming(true)
    setStreamedText("")

    const response = getGeminiResponse(msg, geminiModel)

    for (let i = 0; i <= response.length; i++) {
      await new Promise((r) => setTimeout(r, 30))
      if (!mountedRef.current) return
      setStreamedText(response.slice(0, i))
    }

    if (!mountedRef.current) return
    setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
    setStreamedText("")
    setStreaming(false)
  }

  async function createTrainingJob() {
    setCreatingJob(true)
    await new Promise((r) => setTimeout(r, 800))
    if (!mountedRef.current) return
    const newJob: TrainingJob = {
      id: `job-${Date.now()}`,
      name: `custom-model-${new Date().getSeconds().toString().padStart(2, "0")}`,
      status: "running",
      progress: 0,
      duration: "0m (開始中)",
      machineType: "n1-standard-8",
      startTime: new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
      dataset: "gs://my-dataset/training/latest/",
      modelType: "AutoML",
    }
    setTrainingJobs((prev) => [newJob, ...prev])
    setCreatingJob(false)

    // Animate progress
    let p = 0
    const tick = setInterval(() => {
      if (!mountedRef.current) { clearInterval(tick); return }
      p += Math.floor(Math.random() * 8 + 2)
      if (p >= 100) { p = 100; clearInterval(tick) }
      setTrainingJobs((prev) =>
        prev.map((j) =>
          j.id === newJob.id
            ? { ...j, progress: p, duration: `${Math.floor(p / 10)}m (実行中)`, status: p >= 100 ? "completed" : "running" }
            : j
        )
      )
    }, 600)
  }

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      Available: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      Deployed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Training: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      Failed: "bg-red-100 text-red-700",
    }
    return map[status] ?? "bg-gray-100 text-gray-600"
  }

  const labelColor = (label: string) => {
    if (label === "POSITIVE") return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    if (label === "NEGATIVE") return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  }

  const jobStatusIcon = (status: TrainingJob["status"]) => {
    if (status === "completed") return <CheckCircle2 size={14} className="text-gcp-green" />
    if (status === "failed") return <XCircle size={14} className="text-gcp-red" />
    return <RefreshCw size={14} className="text-gcp-yellow animate-spin" />
  }

  const jobStatusBadge = (status: TrainingJob["status"]) => {
    if (status === "completed") return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    if (status === "failed") return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "models", label: "モデルレジストリ", icon: <Brain size={13} /> },
    { key: "gemini", label: "Gemini API", icon: <Zap size={13} /> },
    { key: "training", label: "学習ジョブ", icon: <Cpu size={13} /> },
  ]

  return (
    <DemoShell
      title="Vertex AI"
      description="機械学習モデルのデプロイと予測リクエストを体験します"
      service="Vertex AI"
      color="#4285F4"
      demoId="vertex-ai"
    >
      <div className="space-y-4">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-border">
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

        {/* ── Model Registry tab ── */}
        {tab === "models" && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Brain size={15} />
                モデルレジストリ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {VERTEX_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.status === "Deployed" && setSelectedModel(m.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedModel === m.id
                        ? "border-gcp-blue bg-gcp-blue-light dark:bg-gcp-blue/10"
                        : "border-border hover:border-gcp-blue/30"
                    } ${m.status !== "Deployed" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Brain size={16} className={selectedModel === m.id ? "text-gcp-blue" : "text-muted-foreground"} />
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusColor(m.status)}`}>
                        {m.status === "Training" && <RefreshCw size={10} className="inline mr-0.5 animate-spin" />}
                        {m.status}
                      </span>
                    </div>
                    <div className="font-semibold text-foreground leading-tight mb-1">{m.name}</div>
                    <div className="text-muted-foreground text-xs mb-1">{m.type}</div>
                    {m.status === "Deployed" && (
                      <>
                        <div className="mt-2 pt-2 border-t border-border grid grid-cols-2 gap-1 text-xs">
                          <div>
                            <span className="text-muted-foreground">精度</span>
                            <div className="font-medium text-green-600">{m.accuracy}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">P50</span>
                            <div className="font-medium">{m.latency}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 h-6 text-[10px] border-gcp-blue/40 text-gcp-blue hover:bg-gcp-blue/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          エンドポイントにデプロイ
                        </Button>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Send size={14} />
                  オンライン予測
                  {model && <Badge variant="secondary" className="text-xs font-mono">{model.name}</Badge>}
                </h3>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">入力テキスト</label>
                  <Textarea
                    value={predInput}
                    onChange={(e) => setPredInput(e.target.value)}
                    rows={3}
                    className="font-sans text-sm resize-none"
                    placeholder="テキストを入力してください..."
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">サンプル入力:</p>
                  <div className="space-y-1">
                    {VERTEX_PREDICTION_EXAMPLES.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setPredInput(ex.input)}
                        className="w-full text-left text-xs px-3 py-2 bg-muted hover:bg-accent rounded-lg transition-colors line-clamp-1"
                      >
                        {ex.input}
                      </button>
                    ))}
                  </div>
                </div>

                {predicting && <Progress value={progress} className="h-1.5" />}

                <Button
                  onClick={predict}
                  disabled={predicting || !predInput || model?.status !== "Deployed"}
                  className="w-full bg-gcp-blue hover:bg-gcp-blue-dark text-white"
                >
                  {predicting ? (
                    <><RefreshCw size={14} className="mr-2 animate-spin" />予測中...</>
                  ) : (
                    <><Send size={14} className="mr-2" />予測を実行</>
                  )}
                </Button>

                {model?.status !== "Deployed" && (
                  <p className="text-xs text-muted-foreground">
                    ※ Deployed 状態のモデルのみ予測リクエストを送信できます
                  </p>
                )}
              </div>

              {/* History */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Activity size={14} />
                  予測結果履歴 ({history.length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                  <AnimatePresence>
                    {history.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-border bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${labelColor(h.output.label)}`}>
                            {h.output.label}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={11} />
                            <span>{h.latency}ms</span>
                            <span>·</span>
                            <span>{h.timestamp}</span>
                          </div>
                        </div>
                        <div className="text-xs text-foreground line-clamp-2">{h.input}</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">信頼度</span>
                            <span className="font-mono font-semibold">{(h.output.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={h.output.confidence * 100} className="h-1.5" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
                      <Brain size={32} className="opacity-20" />
                      <p>予測を実行すると結果が表示されます</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deployed endpoints */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Server size={14} />
                デプロイ済みエンドポイント
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEPLOYED_ENDPOINTS.map((ep) => (
                  <div key={ep.name} className="p-3 rounded-lg border border-border bg-card text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-gcp-blue text-[11px]">{ep.name}</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px]">稼働中</Badge>
                    </div>
                    <div className="text-muted-foreground">モデル: {ep.model}</div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>トラフィック: <strong className="text-foreground">{ep.traffic}%</strong></span>
                      <span>RPS: <strong className="text-foreground">{ep.rps}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Gemini API tab ── */}
        {tab === "gemini" && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Settings row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs text-muted-foreground mb-1 block">モデル</label>
                <Select value={geminiModel} onValueChange={(v) => v && setGeminiModel(v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.0-flash">gemini-2.0-flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash-8b">gemini-1.5-flash-8b</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
                  <span>Temperature</span>
                  <span className="font-mono text-foreground">{temperature.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 accent-gcp-blue cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>0.0 (決定的)</span>
                  <span>1.0 (多様)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">システムプロンプト</label>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={2}
                className="font-sans text-xs resize-none"
                placeholder="システムプロンプトを入力..."
              />
            </div>

            {/* Chat area */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
                <Zap size={13} className="text-gcp-blue" />
                <span className="text-xs font-medium">チャット</span>
                <Badge variant="outline" className="text-[10px] font-mono ml-auto">{geminiModel}</Badge>
              </div>

              <div className="h-72 overflow-y-auto scrollbar-thin p-3 space-y-3">
                {chatMessages.length === 0 && !streaming && (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                    <Zap size={28} className="opacity-20" />
                    <p>GCPについて何でも質問してください</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {["BigQueryとは?", "GKEの特徴", "GCPのサービス一覧"].map((hint) => (
                        <button
                          key={hint}
                          onClick={() => setUserInput(hint)}
                          className="px-2.5 py-1 rounded-full border border-border hover:border-gcp-blue/40 hover:text-gcp-blue text-[11px] transition-colors"
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gcp-blue text-white rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm border border-border"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {streaming && streamedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-sm text-xs whitespace-pre-wrap leading-relaxed bg-muted text-foreground border border-border">
                      {streamedText}
                      <span className="inline-block w-1.5 h-3.5 bg-gcp-blue ml-0.5 align-middle animate-pulse rounded-sm" />
                    </div>
                  </motion.div>
                )}

                {streaming && !streamedText && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-muted border border-border">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 0.15, 0.3].map((delay) => (
                          <div
                            key={delay}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                            style={{ animationDelay: `${delay}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border p-3 flex gap-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="メッセージを入力... (Enter で送信)"
                  className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gcp-blue/50"
                  disabled={streaming}
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!userInput.trim() || streaming}
                  className="bg-gcp-blue hover:bg-gcp-blue-dark text-white h-8 px-3"
                >
                  <Send size={13} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Training Jobs tab ── */}
        {tab === "training" && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Cpu size={15} />
                学習ジョブ
              </h3>
              <Button
                size="sm"
                onClick={createTrainingJob}
                disabled={creatingJob}
                className="bg-gcp-blue hover:bg-gcp-blue-dark text-white h-8 text-xs"
              >
                {creatingJob ? (
                  <><RefreshCw size={12} className="mr-1.5 animate-spin" />作成中...</>
                ) : (
                  <><Plus size={12} className="mr-1.5" />新規学習ジョブを作成</>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {trainingJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-border bg-card space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {jobStatusIcon(job.status)}
                        <span className="font-mono font-semibold text-sm text-foreground">{job.name}</span>
                        <Badge className={`text-[10px] ${jobStatusBadge(job.status)}`}>
                          {job.status === "running" ? "実行中" : job.status === "completed" ? "完了" : "失敗"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{job.startTime}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block">マシンタイプ</span>
                        <span className="font-mono text-foreground">{job.machineType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">モデルタイプ</span>
                        <span className="font-medium text-foreground">{job.modelType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">所要時間</span>
                        <span className="text-foreground flex items-center gap-1"><Clock size={10} /> {job.duration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">進捗</span>
                        <span className="font-mono font-semibold text-foreground">{job.progress}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Progress
                        value={job.progress}
                        className={`h-1.5 ${job.status === "failed" ? "[&>div]:bg-gcp-red" : job.status === "completed" ? "[&>div]:bg-gcp-green" : ""}`}
                      />
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{job.dataset}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </DemoShell>
  )
}
