"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Box, Terminal, RefreshCw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DemoShell } from "@/components/demos/DemoShell"
import { GKE_MOCK_PODS, GKE_KUBECTL_COMMANDS } from "@/lib/data/demo-data"

export default function GKEDemo() {
  const [clusterCreated, setClusterCreated] = useState(false)
  const [creating, setCreating] = useState(false)
  const [nodes] = useState(3)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])
  const [cmdInput, setCmdInput] = useState("")
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Welcome to Google Kubernetes Engine Shell",
    "Type a kubectl command below to simulate execution.",
    "",
  ])

  async function createCluster() {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 3000))
    if (!mountedRef.current) return
    setClusterCreated(true)
    setCreating(false)
    setTerminalLines((prev) => [
      ...prev,
      "$ gcloud container clusters create my-cluster --num-nodes=3 --zone=asia-northeast1-a",
      "Creating cluster my-cluster in asia-northeast1-a...",
      "Cluster [my-cluster] is running.",
      "kubeconfig entry generated for my-cluster.",
      "",
    ])
  }

  function executeCommand(cmd: string) {
    const trimmed = cmd.trim()
    if (!trimmed) return
    setTerminalLines((prev) => [...prev, `$ ${trimmed}`])

    if (trimmed.includes("get nodes")) {
      setTerminalLines((prev) => [
        ...prev,
        "NAME                                        STATUS   ROLES    AGE   VERSION",
        "gke-my-cluster-default-pool-abc123-0001    Ready    <none>   2d    v1.28.5-gke.1000",
        "gke-my-cluster-default-pool-abc123-0002    Ready    <none>   2d    v1.28.5-gke.1000",
        "gke-my-cluster-default-pool-abc123-0003    Ready    <none>   2d    v1.28.5-gke.1000",
        "",
      ])
    } else if (trimmed.includes("get pods")) {
      setTerminalLines((prev) => [
        ...prev,
        "NAME                                    READY   STATUS    RESTARTS   AGE",
        ...GKE_MOCK_PODS.map(
          (p) =>
            `${p.name.padEnd(40)} ${p.ready.padEnd(8)} ${p.status.padEnd(10)} ${String(p.restarts).padEnd(10)} ${p.age}`
        ),
        "",
      ])
    } else if (trimmed.includes("get svc")) {
      setTerminalLines((prev) => [
        ...prev,
        "NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE",
        "kubernetes        ClusterIP      10.96.0.1       <none>          443/TCP        15d",
        "api-server        LoadBalancer   10.96.45.12     34.84.123.45    80:31234/TCP   2d",
        "redis             ClusterIP      10.96.78.90     <none>          6379/TCP       10d",
        "",
      ])
    } else if (trimmed.includes("scale")) {
      const match = trimmed.match(/--replicas=(\d+)/)
      const replicas = match ? match[1] : "?"
      setTerminalLines((prev) => [
        ...prev,
        `deployment.apps/api-server scaled (replicas: ${replicas})`,
        "",
      ])
    } else if (trimmed.includes("logs")) {
      setTerminalLines((prev) => [
        ...prev,
        `[${new Date().toISOString()}] INFO: Server started on port 8080`,
        `[${new Date().toISOString()}] INFO: Health check passed`,
        `[${new Date().toISOString()}] INFO: Processing request GET /api/users`,
        `[${new Date().toISOString()}] INFO: Response 200 OK (42ms)`,
        "",
      ])
    } else if (trimmed.includes("apply")) {
      setTerminalLines((prev) => [
        ...prev,
        "deployment.apps/api-server configured",
        "service/api-server unchanged",
        "",
      ])
    } else {
      setTerminalLines((prev) => [...prev, `Error: unknown command or resource '${trimmed.split(" ")[1] ?? ""}'`, ""])
    }
    setCmdInput("")
  }

  return (
    <DemoShell
      title="Google Kubernetes Engine"
      description="Kubernetesクラスターを管理し、アプリケーションをオーケストレーションします"
      service="GKE"
      color="#4285F4"
    >
      <div className="space-y-5">
        {/* Cluster status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">my-cluster</span>
                {clusterCreated ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs border-0">● Running</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">未作成</Badge>
                )}
              </div>
              {!clusterCreated ? (
                <Button
                  onClick={createCluster}
                  disabled={creating}
                  size="sm"
                  className="w-full bg-gcp-blue hover:bg-gcp-blue-dark text-white"
                >
                  {creating ? (
                    <><RefreshCw size={13} className="mr-1.5 animate-spin" />作成中 (~90秒)...</>
                  ) : (
                    <><Play size={13} className="mr-1.5" />クラスターを作成</>
                  )}
                </Button>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ノード数</span>
                    <span className="font-medium">{nodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kubernetes</span>
                    <span className="font-medium">1.28.5-gke</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ゾーン</span>
                    <span className="font-medium">asia-northeast1-a</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total CPU</span>
                    <span className="font-medium">6 vCPU</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">CPU使用率</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-1.5" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pods table */}
          {clusterCreated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2">
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted px-3 py-2 flex items-center gap-2">
                  <Box size={13} className="text-gcp-blue" />
                  <span className="text-xs font-semibold">Pods (namespace: default)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground">
                        {["NAME", "READY", "STATUS", "RESTARTS", "CPU", "MEMORY"].map((h) => (
                          <th key={h} className="text-left px-3 py-2 font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {GKE_MOCK_PODS.map((pod, i) => (
                        <tr key={pod.name} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                          <td className="px-3 py-2 font-mono text-xs truncate max-w-[200px]">{pod.name}</td>
                          <td className="px-3 py-2">{pod.ready}</td>
                          <td className="px-3 py-2">
                            <span className={`font-medium ${pod.status === "Running" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                              {pod.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">{pod.restarts}</td>
                          <td className="px-3 py-2 font-mono">{pod.cpu}</td>
                          <td className="px-3 py-2 font-mono">{pod.memory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* kubectl terminal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Cloud Shell / kubectl</span>
          </div>

          <div className="terminal-bg rounded-xl overflow-hidden border border-gray-700">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2d2d2d]">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-400 text-xs ml-2 font-mono">Cloud Shell — my-cluster (asia-northeast1-a)</span>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto scrollbar-thin text-xs font-mono space-y-0.5">
              {terminalLines.map((line, i) => (
                <div key={i} className={line.startsWith("$") ? "text-green-400" : line.startsWith("Error") ? "text-red-400" : "text-gray-300"}>
                  {line || "\u00A0"}
                </div>
              ))}
              <div className="flex items-center gap-1">
                <span className="text-green-400">$</span>
                <Input
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeCommand(cmdInput)}
                  placeholder="kubectl get pods"
                  className="bg-transparent border-0 text-gray-300 placeholder:text-gray-600 font-mono text-xs h-6 p-0 focus-visible:ring-0"
                  disabled={!clusterCreated}
                />
              </div>
            </div>
          </div>

          {/* Command suggestions */}
          <div className="flex flex-wrap gap-2">
            {GKE_KUBECTL_COMMANDS.slice(0, 6).map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={() => { setCmdInput(cmd.cmd); executeCommand(cmd.cmd) }}
                disabled={!clusterCreated}
                className="text-xs px-2.5 py-1 bg-muted hover:bg-accent rounded border border-border font-mono text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                title={cmd.desc}
              >
                {cmd.cmd.split(" ").slice(0, 3).join(" ")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  )
}
