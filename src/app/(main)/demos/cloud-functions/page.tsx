"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Play, RefreshCw, CheckCircle, Send, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DemoShell } from "@/components/demos/DemoShell"
import { CF_DEFAULT_CODE, CF_DEPLOY_LOG } from "@/lib/data/demo-data"

export default function CloudFunctionsDemo() {
  const [code, setCode] = useState(CF_DEFAULT_CODE)
  const [runtime, setRuntime] = useState<string>("nodejs20")
  const [trigger, setTrigger] = useState<string>("HTTP")
  const [functionName, setFunctionName] = useState("helloGCP")
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [deployLog, setDeployLog] = useState<string[]>([])
  const [testParam, setTestParam] = useState('{"name":"Google Cloud"}')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [logLines, setLogLines] = useState<string[]>([])

  async function deploy() {
    setDeploying(true)
    setDeployLog([])
    setDeployed(false)
    for (const line of CF_DEPLOY_LOG) {
      await new Promise((r) => setTimeout(r, 350))
      setDeployLog((prev) => [...prev, line])
    }
    setDeployed(true)
    setDeploying(false)
  }

  async function testFunction() {
    if (!deployed) return
    setTesting(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 600))
    let name = "World"
    try {
      const parsed = JSON.parse(testParam)
      name = parsed.name ?? "World"
    } catch {}
    const result = {
      message: `Hello, ${name}! from Google Cloud Functions`,
      timestamp: new Date().toISOString(),
      region: "asia-northeast1",
    }
    setTestResult(JSON.stringify(result, null, 2))
    const logLine = `[${new Date().toISOString()}] Function execution started\n[${new Date().toISOString()}] ${result.message}\n[${new Date().toISOString()}] Function execution took 42 ms, finished with status: 'ok'`
    setLogLines((prev) => [...prev, ...logLine.split("\n")])
    setTesting(false)
  }

  return (
    <DemoShell
      title="Cloud Functions"
      description="サーバーレス関数の作成・デプロイ・テストを体験します"
      service="Cloud Functions"
      color="#FBBC05"
      demoId="cloud-functions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Code editor + config */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Code size={14} />
                関数コード
              </h3>
              <div className="flex gap-2">
                <Select value={runtime} onValueChange={(v) => v && setRuntime(v)}>
                  <SelectTrigger className="h-7 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["nodejs20", "nodejs18", "python311", "go121", "java17"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-xs font-mono ml-1">index.js</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-52 code-editor-bg p-3 font-mono text-xs resize-none focus:outline-none scrollbar-thin"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Config */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">関数名</label>
              <Input value={functionName} onChange={(e) => setFunctionName(e.target.value)} className="font-mono text-xs h-8" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">トリガー</label>
              <Select value={trigger} onValueChange={(v) => v && setTrigger(v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["HTTP", "Pub/Sub", "Cloud Storage", "Firestore"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={deploy}
            disabled={deploying}
            className="w-full bg-gcp-yellow text-white hover:bg-gcp-yellow/90"
          >
            {deploying ? (
              <><RefreshCw size={14} className="mr-2 animate-spin" />デプロイ中...</>
            ) : (
              <><Play size={14} className="mr-2" />デプロイ</>
            )}
          </Button>

          {/* Deploy log */}
          {deployLog.length > 0 && (
            <div className="terminal-bg rounded-lg p-3 text-xs space-y-0.5 max-h-44 overflow-y-auto scrollbar-thin">
              {deployLog.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.includes("SUCCESS") ? "text-green-400" :
                    line.includes("ERROR") ? "text-red-400" :
                    line.includes("[BUILD]") ? "text-blue-300" :
                    line.includes("[INFO]") ? "text-gray-300" :
                    "text-gray-400"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Test + Logs */}
        <div className="space-y-4">
          {/* Test panel */}
          <div className={`p-4 rounded-xl border space-y-3 transition-all ${
            deployed ? "border-gcp-yellow/40 bg-yellow-50/30 dark:bg-yellow-950/10" : "border-border opacity-60"
          }`}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send size={14} />
              HTTPトリガーテスト
              {deployed && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 text-xs">
                  <CheckCircle size={10} className="mr-1" />デプロイ済
                </Badge>
              )}
            </h3>

            {deployed && (
              <div className="font-mono text-xs text-gcp-blue bg-gcp-blue-light dark:bg-gcp-blue/10 px-3 py-2 rounded-lg break-all">
                POST https://asia-northeast1-my-project.cloudfunctions.net/{functionName}
              </div>
            )}

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">リクエストボディ (JSON)</label>
              <textarea
                value={testParam}
                onChange={(e) => setTestParam(e.target.value)}
                className="w-full h-16 code-editor-bg rounded-lg p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-gcp-yellow/50"
                disabled={!deployed}
              />
            </div>

            <Button
              onClick={testFunction}
              disabled={!deployed || testing}
              size="sm"
              className="bg-gcp-yellow text-white hover:bg-gcp-yellow/90"
            >
              {testing ? (
                <><RefreshCw size={13} className="mr-1.5 animate-spin" />送信中...</>
              ) : (
                <><Send size={13} className="mr-1.5" />リクエスト送信</>
              )}
            </Button>

            {testResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xs text-muted-foreground mb-1.5">
                  レスポンス <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 ml-1">200 OK</Badge>
                </p>
                <pre className="code-editor-bg rounded-lg p-3 text-xs font-mono text-green-400 overflow-x-auto scrollbar-thin">
                  {testResult}
                </pre>
              </motion.div>
            )}
          </div>

          {/* Logs */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap size={14} />
              実行ログ
            </h3>
            <div className="terminal-bg rounded-xl p-3 min-h-28 max-h-48 overflow-y-auto scrollbar-thin text-xs font-mono">
              {logLines.length === 0 ? (
                <span className="text-gray-600">関数をデプロイしてテストを実行すると、ログが表示されます</span>
              ) : (
                logLines.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.includes("finished with status") ? "text-green-400" :
                      line.includes("ERROR") ? "text-red-400" :
                      "text-gray-400"
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  )
}
