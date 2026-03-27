"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, Play, Square, RefreshCw, CheckCircle, Cpu, MemoryStick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DemoShell } from "@/components/demos/DemoShell"
import { GCE_MACHINE_TYPES, GCE_REGIONS, GCE_OS_IMAGES } from "@/lib/data/demo-data"
import { Progress } from "@/components/ui/progress"

type InstanceStatus = "stopped" | "starting" | "running" | "stopping"

interface VMInstance {
  name: string
  machineType: string
  region: string
  os: string
  status: InstanceStatus
  externalIp?: string
  internalIp: string
  cpuUsage: number
  memUsage: number
}

export default function GCEDemo() {
  const [name, setName] = useState("my-instance-1")
  const [machineType, setMachineType] = useState("e2-micro")
  const [region, setRegion] = useState("asia-northeast1")
  const [os, setOs] = useState("debian-12")
  const [instances, setInstances] = useState<VMInstance[]>([])
  const [creating, setCreating] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const selectedMachine = GCE_MACHINE_TYPES.find((m) => m.id === machineType)

  async function createInstance() {
    if (!name) return
    setCreating(true)
    const steps = [
      `インスタンス "${name}" を作成中...`,
      "ディスクを割り当て中...",
      "ネットワークを設定中...",
      "VMを起動中...",
      `インスタンス "${name}" が起動しました ✓`,
    ]
    setLog([])
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 700))
      setLog((prev) => [...prev, step])
    }

    setInstances((prev) => [
      ...prev,
      {
        name,
        machineType,
        region,
        os,
        status: "running",
        externalIp: `34.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}`,
        internalIp: `10.146.0.${Math.floor(Math.random()*254)+1}`,
        cpuUsage: Math.floor(Math.random() * 30) + 2,
        memUsage: Math.floor(Math.random() * 40) + 10,
      },
    ])
    setCreating(false)
    setName(`my-instance-${instances.length + 2}`)
  }

  function stopInstance(idx: number) {
    setInstances((prev) =>
      prev.map((inst, i) => i === idx ? { ...inst, status: "stopping" } : inst)
    )
    const tid = setTimeout(() => {
      setInstances((prev) =>
        prev.map((inst, i) => i === idx ? { ...inst, status: "stopped", externalIp: undefined } : inst)
      )
    }, 1500)
    timersRef.current.push(tid)
  }

  function startInstance(idx: number) {
    setInstances((prev) =>
      prev.map((inst, i) => i === idx ? { ...inst, status: "starting" } : inst)
    )
    const tid = setTimeout(() => {
      setInstances((prev) =>
        prev.map((inst, i) => i === idx ? {
          ...inst,
          status: "running",
          externalIp: `34.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}`,
        } : inst)
      )
    }, 2000)
    timersRef.current.push(tid)
  }

  const statusBadge = (s: InstanceStatus) => {
    const map = {
      running: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      stopped: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      starting: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      stopping: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[s]}`}>
        {s === "running" && "● "}
        {s === "starting" && "○ "}
        {s === "stopping" && "○ "}
        {s}
      </span>
    )
  }

  return (
    <DemoShell
      title="Compute Engine"
      description="仮想マシンインスタンスを作成・管理します"
      service="Compute Engine"
      color="#4285F4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create form */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Server size={16} />
            新しいインスタンスを作成
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">インスタンス名</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-instance-1"
                className="font-mono text-sm h-9"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">マシンタイプ</label>
              <Select value={machineType} onValueChange={(v) => v && setMachineType(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GCE_MACHINE_TYPES.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.vCPU} vCPU, {m.memory})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">リージョン / ゾーン</label>
              <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GCE_REGIONS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">ブートディスクイメージ</label>
              <Select value={os} onValueChange={(v) => v && setOs(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GCE_OS_IMAGES.map((img) => (
                    <SelectItem key={img.id} value={img.id}>{img.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMachine && (
              <div className="bg-gcp-blue-light dark:bg-gcp-blue/10 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-gcp-blue">料金見積もり</p>
                <p className="text-sm font-bold text-gcp-blue-dark dark:text-gcp-blue">{selectedMachine.price}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedMachine.vCPU} vCPU · {selectedMachine.memory} RAM
                </p>
              </div>
            )}

            <Button
              onClick={createInstance}
              disabled={creating || !name}
              className="w-full bg-gcp-blue hover:bg-gcp-blue-dark text-white"
            >
              {creating ? (
                <><RefreshCw size={15} className="mr-2 animate-spin" />作成中...</>
              ) : (
                <><Play size={15} className="mr-2" />インスタンスを作成</>
              )}
            </Button>
          </div>

          {/* Creation Log */}
          {log.length > 0 && (
            <div className="terminal-bg rounded-lg p-3 text-xs space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
              {log.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i === log.length - 1 && line.includes("✓") ? (
                    <CheckCircle size={12} className="text-green-400 shrink-0" />
                  ) : (
                    <span className="text-green-400 shrink-0">$</span>
                  )}
                  <span className={line.includes("✓") ? "text-green-400" : "text-gray-300"}>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instances list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            VMインスタンス ({instances.length})
          </h3>

          {instances.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed border-border text-muted-foreground text-sm gap-2">
              <Server size={32} className="opacity-30" />
              <p>インスタンスを作成してください</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {instances.map((inst, i) => (
                  <motion.div
                    key={inst.name + i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-muted rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-mono text-sm font-semibold text-foreground">{inst.name}</div>
                        <div className="text-xs text-muted-foreground">{inst.machineType} · {inst.region}</div>
                      </div>
                      {statusBadge(inst.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-muted-foreground">内部IP: </span>
                        <span className="font-mono">{inst.internalIp}</span>
                      </div>
                      {inst.externalIp && (
                        <div>
                          <span className="text-muted-foreground">外部IP: </span>
                          <span className="font-mono">{inst.externalIp}</span>
                        </div>
                      )}
                    </div>

                    {inst.status === "running" && (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Cpu size={11} className="text-muted-foreground" />
                          <span className="text-muted-foreground w-8">CPU</span>
                          <Progress value={inst.cpuUsage} className="h-1.5 flex-1" />
                          <span className="text-muted-foreground w-8 text-right">{inst.cpuUsage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <MemoryStick size={11} className="text-muted-foreground" />
                          <span className="text-muted-foreground w-8">RAM</span>
                          <Progress value={inst.memUsage} className="h-1.5 flex-1" />
                          <span className="text-muted-foreground w-8 text-right">{inst.memUsage}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {inst.status === "running" && (
                        <Button size="sm" variant="outline" onClick={() => stopInstance(i)} className="h-7 text-xs">
                          <Square size={11} className="mr-1" />停止
                        </Button>
                      )}
                      {inst.status === "stopped" && (
                        <Button size="sm" variant="outline" onClick={() => startInstance(i)} className="h-7 text-xs">
                          <Play size={11} className="mr-1" />起動
                        </Button>
                      )}
                      {(inst.status === "starting" || inst.status === "stopping") && (
                        <Button size="sm" variant="outline" disabled className="h-7 text-xs">
                          <RefreshCw size={11} className="mr-1 animate-spin" />処理中...
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
