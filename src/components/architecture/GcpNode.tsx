"use client"

import { memo, useState, useRef, useCallback, useEffect } from "react"
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

// ─── Lucide fallback icons ───
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

// ─── Service name → GCP official icon SVG file ───
// Files are in /public/icons/gcp/{name}-512-color.svg
const GCP_ICON_MAP: Record<string, string> = {
  // Compute
  "Compute": "compute",
  "Compute Engine": "compute",
  "Cloud Run": "serverlesscomputing",
  "GKE": "gke",
  "Functions": "serverlesscomputing",
  "Cloud Functions": "serverlesscomputing",
  // Storage & Database
  "Storage": "cloud-storage",
  "Cloud Storage": "cloud-storage",
  "Database": "cloudsql",
  "Cloud SQL": "cloudsql",
  "Firestore": "databases",
  "Bigtable": "databases",
  "Cloud Spanner": "cloudspanner",
  "AlloyDB": "alloydb",
  // Data & Analytics
  "BigQuery": "bigquery",
  "Dataflow": "dataanalytics",
  "Dataproc": "dataanalytics",
  "Looker": "looker",
  "Dataplex": "dataanalytics",
  "dbt": "dataanalytics",
  // AI/ML
  "Vertex AI": "vertexai",
  "ADK": "agents",
  // Networking
  "Network": "networking-512-color-rgb",
  "VPC": "networking-512-color-rgb",
  "Load Balancer": "networking-512-color-rgb",
  "LB": "networking-512-color-rgb",
  "CDN": "networking-512-color-rgb",
  // Security
  "Security": "securityidentity",
  "Firebase": "webmobile",
  // DevOps & Operations
  "Cloud Build": "devops",
  "Cloud Deploy": "devops",
  "Artifact Registry": "containers",
  "Cloud Ops": "operations",
  "Eventarc": "integrationservices",
  // Other
  "Pub/Sub": "integrationservices",
  "Marketplace": "marketplace",
  "Anthos": "anthos",
  "Cache": "databases",
  "Memorystore": "databases",
}

function getGcpIconPath(service: string): string | null {
  const iconName = GCP_ICON_MAP[service]
  if (!iconName) return null
  // Handle the special case where the filename already contains the full pattern
  if (iconName.includes("-color-rgb")) return `/icons/gcp/${iconName}.svg`
  return `/icons/gcp/${iconName}-512-color.svg`
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
  const { label, service, color, icon, role } = nodeData
  const IconComp = ICON_MAP[icon] || Box
  const gcpIconPath = getGcpIconPath(service)
  const lines = label.split("\n")

  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const productName = lines[0]
  const description = getServiceDescription(label)
  const hasTooltip = description || role

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

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

  // Render icon: GCP official logo or Lucide fallback
  const renderIcon = (size: number) => {
    if (gcpIconPath) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={gcpIconPath}
          alt={service}
          width={size}
          height={size}
          className="object-contain"
        />
      )
    }
    return <IconComp size={size} style={{ color }} />
  }

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
          style={{ backgroundColor: gcpIconPath ? "transparent" : `${color}15` }}
        >
          {renderIcon(gcpIconPath ? 24 : 16)}
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

      {/* Portal tooltip */}
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
                  style={{ backgroundColor: gcpIconPath ? "transparent" : `${color}18` }}
                >
                  {renderIcon(gcpIconPath ? 20 : 14)}
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
