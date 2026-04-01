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
import { useState, useEffect } from "react"
import { XPProgressBar } from "@/components/game/XPProgressBar"
import { StreakDisplay } from "@/components/game/StreakDisplay"
import { useSidebarStore } from "@/lib/stores/useSidebarStore"
import { useUpdatesBadge } from "@/lib/hooks/useUpdatesBadge"

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
      {
        label: "Google法人サービス",
        href: "/google-enterprise",
        icon: Building2,
        children: [
          { label: "AWT プリセールス", href: "/google-enterprise/awt", icon: Bot },
        ],
      },
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
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (pathname.startsWith("/demos")) initial.add("/demos")
    if (pathname.startsWith("/google-enterprise/")) initial.add("/google-enterprise")
    if (pathname.startsWith("/updates")) initial.add("/updates")
    return initial
  })
  const { collapsed, toggle } = useSidebarStore()
  const { hasNew: hasNewUpdate, markAsSeen: markUpdatesSeen } = useUpdatesBadge()

  // /updates 系ページ表示時に既読にする
  useEffect(() => {
    if (pathname.startsWith("/updates")) {
      markUpdatesSeen()
    }
  }, [pathname, markUpdatesSeen])

  // Ctrl+B でサイドバー開閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white/80 dark:bg-[#1c1f26]/80 backdrop-blur-xl border-r border-border flex flex-col z-40 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo / Toggle */}
      <div className={cn("flex items-center border-b border-border min-h-[57px]", collapsed ? "justify-center px-2 py-3" : "justify-between pl-5 pr-3 py-3")}>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-gcp-blue">G</span><span className="text-gcp-red">L</span><span className="text-gcp-yellow">P</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">by FLUX</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Google Learning Platform</span>
          </div>
        )}
        <div className={cn("relative shrink-0", collapsed ? "group/toggle-top" : "group/toggle-close")}>
          <button
            onClick={toggle}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
          <div className={cn(
            "absolute px-2.5 py-1.5 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity shadow-lg z-50",
            collapsed
              ? "left-full ml-2 top-1/2 -translate-y-1/2 group-hover/toggle-top:opacity-100"
              : "left-1/2 -translate-x-1/2 top-full mt-2 group-hover/toggle-close:opacity-100"
          )}>
            {collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
            <kbd className="ml-2 px-1.5 py-0.5 bg-background/20 rounded text-[10px] font-mono">Ctrl+B</kbd>
          </div>
        </div>
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
                  const isExpanded = expandedMenus.has(item.href)
                  const showParentBadge = item.href === "/updates" && hasNewUpdate
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          if (collapsed) {
                            toggle()
                            setExpandedMenus((prev) => new Set(prev).add(item.href))
                          } else {
                            setExpandedMenus((prev) => {
                              const next = new Set(prev)
                              if (next.has(item.href)) next.delete(item.href)
                              else next.add(item.href)
                              return next
                            })
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
                          <div className="relative shrink-0">
                            <Icon size={18} />
                            {showParentBadge && collapsed && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gcp-red ring-2 ring-white dark:ring-[#292a2d]" />
                            )}
                          </div>
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                        {!collapsed && (
                          <div className="flex items-center gap-1.5">
                            {showParentBadge && (
                              <span className="w-2 h-2 rounded-full bg-gcp-red animate-pulse" />
                            )}
                            <ChevronDown
                              size={16}
                              className={cn("transition-transform", isExpanded && "rotate-180")}
                            />
                          </div>
                        )}
                      </button>
                      {isExpanded && !collapsed && (
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
                            const childActive = child.href === "/updates" ? pathname === "/updates" : pathname.startsWith(child.href)
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

                const showBadge = item.href === "/updates" && hasNewUpdate

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
                    <div className="relative shrink-0">
                      <Icon size={18} />
                      {showBadge && collapsed && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gcp-red ring-2 ring-white dark:ring-[#292a2d]" />
                      )}
                    </div>
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>
                        {showBadge && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-gcp-red animate-pulse" />
                        )}
                      </>
                    )}
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
      </div>
    </aside>
  )
}
