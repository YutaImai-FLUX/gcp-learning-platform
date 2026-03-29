"use client"

import { useState } from "react"
import { Play, RefreshCw, CheckCircle, ExternalLink, BarChart3, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { DemoShell } from "@/components/demos/DemoShell"
import { CLOUD_RUN_DEPLOY_STEPS } from "@/lib/data/demo-data"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface CloudRunService {
  name: string
  image: string
  url: string
  region: string
  minInstances: number
  maxInstances: number
  revision: string
  traffic: number
  instances: number
  rps: number
  p99: string
  status: "running" | "deploying" | "failed"
}

function generateMetrics(points = 20) {
  return Array.from({ length: points }, (_, i) => ({
    t: `${i}m`,
    rps: Math.floor(Math.random() * 600 + 200),
    latency: Math.floor(Math.random() * 80 + 60),
  }))
}

export default function CloudRunDemo() {
  const [serviceName, setServiceName] = useState("my-api-service")
  const [image, setImage] = useState("asia-northeast1-docker.pkg.dev/my-project/my-repo/app:v1.0")
  const [services, setServices] = useState<CloudRunService[]>([])
  const [deployLog, setDeployLog] = useState<string[]>([])
  const [deploying, setDeploying] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [metrics] = useState(generateMetrics())

  async function deployService() {
    if (!serviceName || !image) return
    setDeploying(true)
    setDeployLog([])

    for (const step of CLOUD_RUN_DEPLOY_STEPS) {
      await new Promise((r) => setTimeout(r, 800))
      setDeployLog((prev) => [...prev, step])
    }

    const revNum = (services.filter((s) => s.name === serviceName).length + 1).toString().padStart(5, "0")
    const newService: CloudRunService = {
      name: serviceName,
      image,
      url: `https://${serviceName}-abcdef-an.a.run.app`,
      region: "asia-northeast1",
      minInstances: 0,
      maxInstances: 100,
      revision: `${serviceName}-${revNum}`,
      traffic: 100,
      instances: 2,
      rps: Math.floor(Math.random() * 500 + 100),
      p99: `${Math.floor(Math.random() * 100 + 80)}ms`,
      status: "running",
    }

    setServices((prev) => {
      const existing = prev.findIndex((s) => s.name === serviceName)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newService
        return updated
      }
      return [...prev, newService]
    })
    setSelected(serviceName)
    setDeploying(false)
  }

  const selectedService = services.find((s) => s.name === selected)

  return (
    <DemoShell
      title="Cloud Run"
      description="コンテナをサーバーレスでデプロイ・管理します"
      service="Cloud Run"
      color="#34A853"
      demoId="cloud-run"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Deploy form */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Play size={15} />
            新しいサービスをデプロイ
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">サービス名</label>
              <Input value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="font-mono text-sm h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">コンテナイメージ</label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} className="font-mono text-xs h-9" />
            </div>
            <div className="bg-muted rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">リージョン</span>
                <span className="font-medium">asia-northeast1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最小インスタンス</span>
                <span className="font-medium">0 (ゼロスケール)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最大インスタンス</span>
                <span className="font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">1 vCPU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">メモリ</span>
                <span className="font-medium">512 MiB</span>
              </div>
            </div>

            <Button
              onClick={deployService}
              disabled={deploying || !serviceName}
              className="w-full bg-gcp-green hover:bg-gcp-green/90 text-white"
            >
              {deploying ? (
                <><RefreshCw size={15} className="mr-2 animate-spin" />デプロイ中...</>
              ) : (
                <><Play size={15} className="mr-2" />デプロイ</>
              )}
            </Button>
          </div>

          {/* Deploy log */}
          {deployLog.length > 0 && (
            <div className="terminal-bg rounded-lg p-3 text-xs space-y-1 max-h-44 overflow-y-auto scrollbar-thin">
              {deployLog.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  {line.includes("SUCCESS") ? (
                    <CheckCircle size={11} className="text-green-400 mt-0.5 shrink-0" />
                  ) : line.includes("ERROR") ? (
                    <AlertTriangle size={11} className="text-red-400 mt-0.5 shrink-0" />
                  ) : (
                    <span className="text-blue-400 shrink-0 mt-0.5">›</span>
                  )}
                  <span className={line.includes("SUCCESS") ? "text-green-400" : line.includes("ERROR") ? "text-red-400" : "text-gray-300"}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Service list */}
          {services.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">サービス一覧</p>
              <div className="space-y-1.5">
                {services.map((svc) => (
                  <button
                    key={svc.name}
                    onClick={() => setSelected(svc.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      selected === svc.name ? "bg-gcp-green/10 text-gcp-green" : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-green-500">●</span>
                    <span className="font-medium flex-1 truncate">{svc.name}</span>
                    <Badge className="text-xs bg-green-100 text-green-700 border-0">Running</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Service detail + metrics */}
        <div className="lg:col-span-2 space-y-4">
          {selectedService ? (
            <>
              <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{selectedService.name}</h3>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                    ● Running
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">URL</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-gcp-blue truncate">{selectedService.url}</span>
                      <ExternalLink size={11} className="text-gcp-blue shrink-0" />
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">リビジョン</span>
                    <div className="font-mono mt-0.5">{selectedService.revision}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">アクティブインスタンス</span>
                    <div className="font-medium mt-0.5">{selectedService.instances}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">トラフィック</span>
                    <div className="mt-0.5">
                      <Progress value={selectedService.traffic} className="h-1.5 mt-1" />
                      <span>{selectedService.traffic}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics charts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 size={13} className="text-gcp-blue" />
                      <span className="text-xs font-medium">リクエスト数/秒</span>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={metrics}>
                        <defs>
                          <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="rps" stroke="#4285F4" fill="url(#rpsGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={13} className="text-gcp-green" />
                      <span className="text-xs font-medium">レイテンシ (ms)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={metrics}>
                        <defs>
                          <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34A853" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="latency" stroke="#34A853" fill="url(#latGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm gap-2">
              <Play size={40} className="opacity-20" />
              <p>サービスをデプロイすると詳細が表示されます</p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
