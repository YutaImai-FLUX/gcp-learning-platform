"use client"

import { memo, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import {
  Globe, Server, Database, HardDrive, Shield, Key, Play, Box,
  Lock, Radio, Zap, Search, Code2, Brain, Sparkles, Cpu,
  BarChart3, Layers, GitBranch, Activity, Package, Users,
  ShoppingCart, Bell, MessageSquare, Network, Cable, Building2,
  Monitor, Flame, Router, TestTube, LineChart,
} from "lucide-react"
import { getServiceDescription } from "@/lib/data/gcp-service-descriptions"

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
  role?: string
}

function GcpNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as GcpNodeData
  const { label, color, icon, role } = nodeData
  const IconComp = ICON_MAP[icon] || Box
  const lines = label.split("\n")

  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const productName = lines[0]
  const description = getServiceDescription(label)
  const hasTooltip = description || role

  const handleMouseEnter = useCallback(() => {
    if (!hasTooltip || !nodeRef.current) return
    timerRef.current = setTimeout(() => {
      if (!nodeRef.current) return
      const rect = nodeRef.current.getBoundingClientRect()
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    }, 300)
  }, [hasTooltip])

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTooltipPos(null)
  }, [])

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!w-1.5 !h-1.5 !bg-transparent !border-0" />

      <div
        ref={nodeRef}
        className="group relative flex items-center gap-2 rounded-xl bg-white dark:bg-[#1e1f2e] px-3 py-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{
          border: `2px solid ${color}`,
          minWidth: 150,
          boxShadow: `0 2px 8px ${color}15, 0 1px 3px rgba(0,0,0,0.08)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

        {/* Tooltip indicator dot */}
        {hasTooltip && (
          <div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: color }}
          />
        )}
      </div>

      {/* Portal tooltip rendered outside ReactFlow canvas */}
      {tooltipPos && hasTooltip && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 8,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div
              className="bg-white dark:bg-[#1e1f2e] rounded-xl shadow-2xl border border-border/60 p-3 w-[280px]"
              style={{
                boxShadow: `0 8px 32px ${color}20, 0 4px 16px rgba(0,0,0,0.12)`,
                borderTop: `3px solid ${color}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <IconComp size={14} style={{ color }} />
                </div>
                <span className="text-xs font-bold text-foreground leading-tight">
                  {productName}
                </span>
              </div>

              {/* Description */}
              {description && (
                <div className="mb-2">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                    製品概要
                  </div>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Role */}
              {role && (
                <div
                  className="rounded-lg px-2.5 py-1.5"
                  style={{ backgroundColor: `${color}08` }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color }}>
                    このアーキテクチャでの役割
                  </div>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">
                    {role}
                  </p>
                </div>
              )}

              {/* Arrow */}
              <div
                className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[#1e1f2e] border-r border-b border-border/60"
              />
            </div>
          </div>,
          document.body
        )
      }

      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5 !bg-transparent !border-0" />
    </>
  )
}

export default memo(GcpNodeComponent)
