"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  PlayCircle,
  Network,
  GraduationCap,
  FileText,
  Server,
  HardDrive,
  BarChart3,
  Brain,
  Radio,
  Box,
  Zap,
  ChevronDown,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  {
    label: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "製品カタログ",
    href: "/products",
    icon: Package,
  },
  {
    label: "インタラクティブデモ",
    href: "/demos",
    icon: PlayCircle,
    children: [
      { label: "Compute Engine", href: "/demos/gce", icon: Server },
      { label: "Cloud Storage", href: "/demos/gcs", icon: HardDrive },
      { label: "BigQuery", href: "/demos/bigquery", icon: BarChart3 },
      { label: "Cloud Run", href: "/demos/cloud-run", icon: PlayCircle },
      { label: "GKE", href: "/demos/gke", icon: Box },
      { label: "Pub/Sub", href: "/demos/pubsub", icon: Radio },
      { label: "Vertex AI", href: "/demos/vertex-ai", icon: Brain },
      { label: "Cloud Functions", href: "/demos/cloud-functions", icon: Zap },
      { label: "ADK (AI Agents)", href: "/demos/adk", icon: Bot },
    ],
  },
  {
    label: "アーキテクチャ図",
    href: "/architecture",
    icon: Network,
  },
  {
    label: "提案シミュレーター",
    href: "/proposal",
    icon: FileText,
  },
  {
    label: "資格学習センター",
    href: "/learn",
    icon: GraduationCap,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedDemos, setExpandedDemos] = useState(pathname.startsWith("/demos"))

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#292a2d] border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gcp-blue" />
          <span className="w-3 h-3 rounded-full bg-gcp-red" />
          <span className="w-3 h-3 rounded-full bg-gcp-yellow" />
          <span className="w-3 h-3 rounded-full bg-gcp-green" />
        </div>
        <span className="font-bold text-[15px] text-foreground">GCP Learning</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.children) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => setExpandedDemos(!expandedDemos)}
                  className={cn(
                    "gcp-nav-item w-full justify-between",
                    isActive && "active"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn("transition-transform", expandedDemos && "rotate-180")}
                  />
                </button>
                {expandedDemos && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      const childActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn("gcp-nav-item text-xs", childActive && "active")}
                        >
                          <ChildIcon size={15} />
                          <span>{child.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("gcp-nav-item", isActive && "active")}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">GCP Interactive Learning</p>
        <p className="text-xs text-muted-foreground">v1.0.0 · 模擬デモ環境</p>
      </div>
    </aside>
  )
}
