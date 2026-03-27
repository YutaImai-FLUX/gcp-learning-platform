"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import {
  Globe, Server, Database, HardDrive, Shield, Key, Play, Box,
  Lock, Radio, Zap, Search, Code2, Brain, Sparkles, Cpu,
  BarChart3, Layers, GitBranch, Activity, Package, Users,
  ShoppingCart, Bell, MessageSquare, Network, Cable, Building2,
  Monitor, Flame, Router, TestTube, LineChart,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Server, Database, HardDrive, Shield, Key, Play, Box,
  Lock, Radio, Zap, Search, Code2, Brain, Sparkles, Cpu,
  BarChart3, Layers, GitBranch, Activity, Package, Users,
  ShoppingCart, Bell, MessageSquare, Network, Cable, Building2,
  Monitor, Flame, Router, TestTube, LineChart,
  SplitSquareHorizontal: Network,
  List: Layers,
  CheckCircle: Activity,
}

export type GcpNodeData = {
  label: string
  service: string
  color: string
  icon: string
}

function GcpNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as GcpNodeData
  const { label, color, icon } = nodeData
  const IconComp = ICON_MAP[icon] || Box
  const lines = label.split("\n")

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!w-1.5 !h-1.5 !bg-transparent !border-0" />

      <div
        className="group relative flex items-center gap-2 rounded-xl bg-white dark:bg-[#1e1f2e] px-3 py-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{
          border: `2px solid ${color}`,
          minWidth: 150,
          boxShadow: `0 2px 8px ${color}15, 0 1px 3px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Colored left accent */}
        <div
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
          style={{ backgroundColor: color }}
        />

        {/* Icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ml-1"
          style={{ backgroundColor: `${color}15` }}
        >
          <IconComp size={16} style={{ color }} />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          {lines.map((line, i) => (
            <span
              key={i}
              className={`leading-tight truncate ${
                i === 0
                  ? "text-[11px] font-semibold text-foreground"
                  : "text-[10px] text-muted-foreground"
              }`}
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
    </>
  )
}

export default memo(GcpNodeComponent)
