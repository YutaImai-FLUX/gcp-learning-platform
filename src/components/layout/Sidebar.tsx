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
  Sword,
  Layers,
  Map,
  Shield,
  Key,
  Building2,
  FileSearch,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { XPProgressBar } from "@/components/game/XPProgressBar"
import { StreakDisplay } from "@/components/game/StreakDisplay"
import { useSidebarStore } from "@/lib/stores/useSidebarStore"

interface NavChild {
  label: string
  href: string
  icon: React.ElementType
  separator?: boolean
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: NavChild[]
}

interface NavSection {
  label: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "",
    items: [
      { label: "ダッシュボード", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "学習",
    items: [
      { label: "資格学習センター", href: "/learn", icon: GraduationCap },
      { label: "ダンジョン冒険", href: "/dungeon", icon: Sword },
      { label: "フラッシュカード", href: "/flashcards", icon: Layers },
      { label: "デイリーチャレンジ", href: "/daily", icon: Target },
      { label: "資格ロードマップ", href: "/roadmap", icon: Map },
    ],
  },
  {
    label: "探索",
    items: [
      { label: "製品カタログ", href: "/products", icon: Package },
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
          { label: "─ Security ─", href: "", icon: Shield, separator: true },
          { label: "IAM ポリシー", href: "/demos/iam", icon: Shield },
          { label: "VPC & Firewall", href: "/demos/vpc-firewall", icon: Network },
          { label: "サービスアカウント", href: "/demos/service-accounts", icon: Key },
          { label: "Org Policy", href: "/demos/org-policy", icon: Building2 },
          { label: "Audit Logs", href: "/demos/audit-logs", icon: FileSearch },
        ],
      },
      { label: "アーキテクチャ図", href: "/architecture", icon: Network },
    ],
  },
  {
    label: "ツール",
    items: [
      { label: "提案シミュレーター", href: "/proposal", icon: FileText },
      { label: "最新アップデート", href: "/updates", icon: Sparkles },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedDemos, setExpandedDemos] = useState(pathname.startsWith("/demos"))
  const { collapsed, toggle } = useSidebarStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-[#292a2d] border-r border-border flex flex-col z-40 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border min-h-[57px]">
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-3 h-3 rounded-full bg-gcp-blue" />
          <span className="w-3 h-3 rounded-full bg-gcp-red" />
          <span className="w-3 h-3 rounded-full bg-gcp-yellow" />
          <span className="w-3 h-3 rounded-full bg-gcp-green" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[15px] text-foreground whitespace-nowrap">GCP Learning</span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-2 scrollbar-thin", collapsed ? "px-2" : "px-3")}>
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.label || "home"} className={sectionIdx > 0 ? "mt-4" : ""}>
            {/* Section label */}
            {section.label && !collapsed && (
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
            )}
            {section.label && collapsed && sectionIdx > 0 && (
              <div className="mx-2 mb-2 border-t border-border" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                const Icon = item.icon

                if (item.children) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          if (collapsed) {
                            toggle()
                            setExpandedDemos(true)
                          } else {
                            setExpandedDemos(!expandedDemos)
                          }
                        }}
                        className={cn(
                          "gcp-nav-item w-full",
                          collapsed ? "justify-center px-0" : "justify-between",
                          isActive && "active"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
                          <Icon size={18} className="shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            size={16}
                            className={cn("transition-transform", expandedDemos && "rotate-180")}
                          />
                        )}
                      </button>
                      {expandedDemos && !collapsed && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                          {item.children.map((child) => {
                            if (child.separator) {
                              return (
                                <div key={child.label} className="pt-2 pb-1 px-1">
                                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    {child.label.replace(/─/g, "").trim()}
                                  </span>
                                </div>
                              )
                            }
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
                    className={cn(
                      "gcp-nav-item",
                      collapsed ? "justify-center px-0" : "",
                      isActive && "active"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border">
        {!collapsed && (
          <div className="px-4 py-3 space-y-2">
            <XPProgressBar compact />
            <div className="flex items-center justify-between">
              <StreakDisplay compact />
              <p className="text-[10px] text-muted-foreground">v1.1.0</p>
            </div>
          </div>
        )}
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </aside>
  )
}
