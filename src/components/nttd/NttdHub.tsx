"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, AlertTriangle, Briefcase, Users, CalendarClock,
  CheckCircle2, LayoutList, GanttChartSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MilestoneGantt } from "@/components/nttd/MilestoneGantt"
import { ProjectDrawer } from "@/components/nttd/ProjectDrawer"
import type { Project, Milestone } from "@/lib/types/project"
import { daysUntil, getNextMilestone, getProjectProgress, STATUS_LABELS, MEMBERS } from "@/lib/types/project"
import { MOCK_PROJECTS } from "@/lib/nttd-mock"
import { REVIEWER_COLORS } from "@/lib/nttd-templates"
import { cn } from "@/lib/utils"

// ─── Overlap detection ────────────────────────────────────────────────────────

interface OverlapAlert {
  date: string
  reviewer: string
  projects: string[]
}

function detectOverlaps(projects: Project[]): OverlapAlert[] {
  const map: Record<string, { reviewer: string; projects: string[] }> = {}
  for (const p of projects) {
    if (p.status === "won" || p.status === "lost") continue
    for (const m of p.milestones) {
      if (!m.date || !m.isReview || m.completed) continue
      const key = `${m.date}__${m.reviewer ?? "none"}`
      if (!map[key]) map[key] = { reviewer: m.reviewer ?? "", projects: [] }
      if (!map[key].projects.includes(p.name)) map[key].projects.push(p.name)
    }
  }
  return Object.entries(map)
    .filter(([, v]) => v.projects.length >= 2)
    .map(([k, v]) => ({ date: k.split("__")[0], ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// ─── Project Card ─────────────────────────────────────────────────────────────

const PRIORITY_ACCENT: Record<string, string> = {
  "高": "border-l-red-400",
  "中": "border-l-amber-400",
  "低": "border-l-slate-300",
}

const MEMBER_AVATAR: Record<string, string> = {
  "金山": "bg-violet-500",
  "今井": "bg-sky-500",
  "秋武": "bg-emerald-500",
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "xs" }) {
  const sz = size === "xs" ? "w-5 h-5 text-[9px]" : "w-7 h-7 text-xs"
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold text-white shrink-0", sz, MEMBER_AVATAR[name] ?? "bg-gray-400")}>
      {name[0]}
    </div>
  )
}

function MilestoneDots({ milestones }: { milestones: Milestone[] }) {
  const ps = milestones.filter((m) => m.track === "presales")
  const fde = milestones.filter((m) => m.track === "fde")
  const renderDots = (list: Milestone[], color: string) => (
    <div className="flex items-center gap-0.5 flex-wrap">
      {list.map((m) => (
        <div
          key={m.id}
          className={cn(
            "rounded-full border transition-all",
            m.completed
              ? "w-2.5 h-2.5 border-transparent"
              : m.date
              ? "w-2.5 h-2.5 border-current"
              : "w-2 h-2 border-dashed border-muted-foreground/40"
          )}
          style={m.completed ? { backgroundColor: m.isReview ? (REVIEWER_COLORS[m.reviewer ?? ""]?.dot ?? color) : color } : { borderColor: m.date ? (m.isReview ? (REVIEWER_COLORS[m.reviewer ?? ""]?.dot ?? color) : color) : undefined }}
          title={`${m.label}${m.date ? ` (${m.date})` : " (未設定)"}`}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-1">
      {ps.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-sky-500 font-semibold uppercase w-8 shrink-0">PS</span>
          {renderDots(ps, "#0284c7")}
        </div>
      )}
      {fde.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-emerald-500 font-semibold uppercase w-8 shrink-0">FDE</span>
          {renderDots(fde, "#059669")}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, selected, onClick }: {
  project: Project
  selected: boolean
  onClick: () => void
}) {
  const next = getNextMilestone(project)
  const progress = getProjectProgress(project)
  const days = next ? daysUntil(next.date) : null
  const isActive = project.status === "active"

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border-l-4 border border-border bg-card px-4 py-3 transition-all duration-150",
        "hover:border-primary/40 hover:shadow-md",
        PRIORITY_ACCENT[project.priority],
        selected && "ring-2 ring-primary ring-offset-1 border-primary/30 shadow-md",
        !isActive && "opacity-60"
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug truncate">{project.name}</p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{project.client}</p>
        </div>
        <Badge className={cn(
          "text-[10px] px-1.5 py-0 h-4 shrink-0 border-0 mt-0.5",
          project.status === "active"  ? "bg-blue-100 text-blue-700"   :
          project.status === "won"     ? "bg-green-100 text-green-700" :
          project.status === "lost"    ? "bg-red-100 text-red-600"     :
                                         "bg-gray-100 text-gray-500"
        )}>
          {STATUS_LABELS[project.status]}
        </Badge>
      </div>

      {/* Assignees */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Avatar name={project.mainAssignee} />
        {project.subAssignee && <Avatar name={project.subAssignee} size="xs" />}
        <span className="text-[11px] text-muted-foreground">
          {project.mainAssignee}{project.subAssignee ? `・${project.subAssignee}` : ""}
        </span>
      </div>

      {/* Milestone dots */}
      <div className="mb-2.5">
        <MilestoneDots milestones={project.milestones} />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground w-8 text-right">{progress}%</span>
      </div>

      {/* Next milestone */}
      {next ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {next.isReview && next.reviewer && (
              <span className={cn("text-[9px] px-1 py-0.5 rounded font-medium", REVIEWER_COLORS[next.reviewer]?.bg, REVIEWER_COLORS[next.reviewer]?.text)}>
                {next.reviewer}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground truncate">{next.label}</span>
          </div>
          {days !== null && (
            <span className={cn(
              "text-[11px] font-semibold shrink-0 ml-2",
              days < 0 ? "text-red-500" : days <= 3 ? "text-red-500" : days <= 7 ? "text-orange-500" : "text-muted-foreground"
            )}>
              {days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "今日" : `残${days}日`}
            </span>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground/50 italic">日程未設定あり</p>
      )}
    </button>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ projects, overlaps }: { projects: Project[]; overlaps: OverlapAlert[] }) {
  const active = projects.filter((p) => p.status === "active")
  const urgent = active.filter((p) => {
    const next = getNextMilestone(p)
    return next && daysUntil(next.date) <= 7
  })
  const undated = active.filter((p) => p.milestones.some((m) => !m.date))

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {[
        { icon: Briefcase, label: `${active.length}件 進行中`, color: "text-blue-500", bg: "bg-blue-50" },
        { icon: CalendarClock, label: `今週${urgent.length}件期限`, color: urgent.length > 0 ? "text-red-500" : "text-muted-foreground", bg: urgent.length > 0 ? "bg-red-50" : "bg-muted/50" },
        { icon: Users, label: MEMBERS.join("・"), color: "text-muted-foreground", bg: "bg-muted/50" },
        ...(undated.length > 0 ? [{ icon: AlertTriangle, label: `${undated.length}件 日程未入力`, color: "text-amber-600", bg: "bg-amber-50" }] : []),
        ...(overlaps.length > 0 ? [{ icon: AlertTriangle, label: `重複${overlaps.length}件`, color: "text-orange-600", bg: "bg-orange-50" }] : []),
      ].map((s, i) => (
        <div key={i} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs", s.bg)}>
          <s.icon size={12} className={s.color} />
          <span className={cn("font-medium", s.color)}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main Hub ─────────────────────────────────────────────────────────────────

export function NttdHub() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [mobileTab, setMobileTab] = useState<"list" | "gantt">("list")

  const load = useCallback(async () => {
    const res = await fetch("/api/projects").then((r) => r.json()).catch(() => null)
    setProjects(Array.isArray(res) && res.length ? res : MOCK_PROJECTS)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const overlaps = useMemo(() => detectOverlaps(projects), [projects])

  const openNew = () => {
    setEditingProject(null)
    setDrawerOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditingProject(p)
    setDrawerOpen(true)
  }

  const handleSave = async (data: Omit<Project, "id" | "createdAt">) => {
    if (editingProject) {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()).catch(() => null)
      const updated = res ?? { ...editingProject, ...data }
      setProjects((prev) => prev.map((p) => p.id === editingProject.id ? updated : p))
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()).catch(() => null)
      if (res?.id) setProjects((prev) => [...prev, res])
    }
    setDrawerOpen(false)
    setEditingProject(null)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" }).catch(() => {})
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDrawerOpen(false)
    setEditingProject(null)
    if (selectedId === id) setSelectedId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeProjects = projects.filter((p) => p.status === "active")
  const wonLostProjects = projects.filter((p) => p.status !== "active")

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
            NTTデータ案件管理
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Googleプリセールス — 金山・今井・秋武</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile tab toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/50 md:hidden">
            <button
              onClick={() => setMobileTab("list")}
              className={cn("flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all", mobileTab === "list" ? "bg-white shadow text-foreground" : "text-muted-foreground")}
            >
              <LayoutList size={13} /> 一覧
            </button>
            <button
              onClick={() => setMobileTab("gantt")}
              className={cn("flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all", mobileTab === "gantt" ? "bg-white shadow text-foreground" : "text-muted-foreground")}
            >
              <GanttChartSquare size={13} /> タイムライン
            </button>
          </div>
          <Button size="sm" onClick={openNew} className="gap-1.5 h-8">
            <Plus size={14} />
            新規案件
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar projects={projects} overlaps={overlaps} />

      {/* Overlap alerts */}
      {overlaps.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-700">
            <AlertTriangle size={14} />
            レビュー重複アラート
          </div>
          {overlaps.map((ov, i) => (
            <div key={i} className="text-xs text-orange-700">
              <span className="font-semibold">{ov.date}</span>
              {" — "}
              <span className={cn("font-medium", REVIEWER_COLORS[ov.reviewer]?.text ?? "text-orange-700")}>
                {ov.reviewer}
              </span>
              {" に "}
              {ov.projects.join("・")}
              {" が重複しています"}
            </div>
          ))}
        </div>
      )}

      {/* Main split layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Project list */}
        <div className={cn(
          "flex flex-col gap-2 overflow-y-auto",
          "md:w-80 lg:w-96 md:shrink-0",
          mobileTab === "list" ? "flex" : "hidden md:flex"
        )}>
          {/* Active projects */}
          <div className="space-y-2">
            {activeProjects.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard
                  project={p}
                  selected={selectedId === p.id}
                  onClick={() => {
                    setSelectedId(p.id === selectedId ? null : p.id)
                    openEdit(p)
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Won/Lost (collapsed) */}
          {wonLostProjects.length > 0 && (
            <details className="group mt-2">
              <summary className="text-xs text-muted-foreground font-medium cursor-pointer list-none flex items-center gap-1 hover:text-foreground select-none py-1">
                <CheckCircle2 size={12} className="text-green-500" />
                完了・失注 ({wonLostProjects.length}件)
              </summary>
              <div className="space-y-2 mt-2">
                {wonLostProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    selected={selectedId === p.id}
                    onClick={() => { setSelectedId(p.id === selectedId ? null : p.id); openEdit(p) }}
                  />
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Gantt */}
        <div className={cn(
          "flex-1 min-w-0 overflow-hidden",
          mobileTab === "gantt" ? "flex flex-col" : "hidden md:flex md:flex-col"
        )}>
          <MilestoneGantt
            projects={activeProjects}
            overlaps={overlaps}
            selectedProjectId={selectedId}
            onSelectProject={(id) => {
              const p = projects.find((proj) => proj.id === id)
              if (p) { setSelectedId(id); openEdit(p) }
            }}
          />
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <ProjectDrawer
            project={editingProject}
            onSave={handleSave}
            onDelete={editingProject ? () => handleDelete(editingProject.id) : undefined}
            onClose={() => { setDrawerOpen(false); setEditingProject(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
