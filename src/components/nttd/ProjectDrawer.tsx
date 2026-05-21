"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  X, Trash2, ChevronDown, ChevronRight,
  CheckCircle2, Circle, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Project, Milestone } from "@/lib/types/project"
import { MEMBERS, PRIORITIES, PROJECT_STATUSES, STATUS_LABELS, daysUntil } from "@/lib/types/project"
import {
  PRESALES_TEMPLATES, ALL_FDE_TEMPLATES,
  getFdeTemplate,
  buildMilestones, REVIEWER_COLORS,
} from "@/lib/nttd-templates"
import { cn } from "@/lib/utils"

// ─── Milestone date row ───────────────────────────────────────────────────────

function MilestoneRow({
  milestone,
  index,
  onChange,
  onToggleComplete,
}: {
  milestone: Milestone
  index: number
  onChange: (date: string) => void
  onToggleComplete: () => void
}) {
  const days = milestone.date ? daysUntil(milestone.date) : null
  const isOverdue = days !== null && days < 0 && !milestone.completed
  const reviewerStyle = milestone.reviewer ? REVIEWER_COLORS[milestone.reviewer] : null
  const trackDot = milestone.track === "presales" ? "bg-sky-500" : "bg-emerald-500"

  return (
    <div className={cn(
      "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors group/row",
      milestone.completed ? "opacity-50" : isOverdue ? "bg-red-50/50" : "hover:bg-muted/40"
    )}>
      {/* Index + track dot */}
      <div className="flex items-center gap-1.5 w-6 shrink-0">
        <span className="text-[10px] text-muted-foreground font-mono">{index + 1}</span>
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", trackDot)} />
      </div>

      {/* Complete toggle */}
      <button onClick={onToggleComplete} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        {milestone.completed
          ? <CheckCircle2 size={16} className="text-green-500" />
          : isOverdue
          ? <AlertCircle size={16} className="text-red-400" />
          : <Circle size={16} />
        }
      </button>

      {/* Label + reviewer badge */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
        <span className={cn("text-sm", milestone.completed && "line-through text-muted-foreground")}>
          {milestone.label}
        </span>
        {reviewerStyle && milestone.reviewer && (
          <Badge className={cn("text-[10px] px-1.5 py-0 h-4 border-0 font-medium", reviewerStyle.bg, reviewerStyle.text)}>
            {milestone.reviewer}
          </Badge>
        )}
      </div>

      {/* Date input */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          type="date"
          value={milestone.date}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-7 text-xs w-36 px-2",
            !milestone.date && "border-dashed text-muted-foreground",
            isOverdue && "border-red-300 text-red-600",
          )}
        />
        {milestone.date && days !== null && !milestone.completed && (
          <span className={cn(
            "text-[10px] font-medium w-14 text-right",
            days < 0 ? "text-red-500" : days <= 3 ? "text-orange-500" : days <= 7 ? "text-amber-600" : "text-muted-foreground"
          )}>
            {days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "今日" : `残${days}日`}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Template section ─────────────────────────────────────────────────────────

function TemplateSection({
  track,
  templateId,
  onTemplateChange,
  milestones,
  onMilestoneChange,
  onToggleComplete,
}: {
  track: "presales" | "fde"
  templateId: string
  onTemplateChange: (id: string) => void
  milestones: Milestone[]
  onMilestoneChange: (phaseId: string, date: string) => void
  onToggleComplete: (phaseId: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const templates = track === "presales" ? PRESALES_TEMPLATES : ALL_FDE_TEMPLATES
  const current = track === "presales" ? PRESALES_TEMPLATES.find((t) => t.id === templateId) : ALL_FDE_TEMPLATES.find((t) => t.id === templateId)
  const trackMilestones = milestones.filter((m) => m.track === track)
  const filled = trackMilestones.filter((m) => m.date).length
  const completed = trackMilestones.filter((m) => m.completed).length

  const trackLabel = track === "presales" ? "プリセールス" : "FDE"
  const trackColor = track === "presales" ? "text-sky-600" : "text-emerald-600"
  const trackBg = track === "presales" ? "bg-sky-50" : "bg-emerald-50"
  const trackBorder = track === "presales" ? "border-sky-200" : "border-emerald-200"

  return (
    <div className={cn("rounded-xl border", trackBorder, trackBg)}>
      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-bold", trackColor)}>{trackLabel}</span>
          {current && (
            <span className="text-[11px] text-muted-foreground">
              {current.shortName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {trackMilestones.length > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {completed}/{trackMilestones.length}完了 · {filled}/{trackMilestones.length}日程入力
            </span>
          )}
          {expanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Template selector */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">テンプレート</label>
            <div className="relative">
              <select
                value={templateId}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="w-full h-8 pl-3 pr-8 text-sm rounded-lg border border-border bg-white appearance-none text-foreground focus:ring-2 focus:ring-ring"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.shortName}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Phase date rows */}
          {trackMilestones.length > 0 ? (
            <div className="bg-white/70 rounded-lg border border-border/50 divide-y divide-border/50">
              {trackMilestones.map((m, i) => (
                <MilestoneRow
                  key={m.id}
                  milestone={m}
                  index={i}
                  onChange={(date) => onMilestoneChange(m.id, date)}
                  onToggleComplete={() => onToggleComplete(m.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic py-1">テンプレートを選択するとフェーズが表示されます</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

interface Props {
  project: Project | null
  onSave: (data: Omit<Project, "id" | "createdAt">) => void
  onDelete?: () => void
  onClose: () => void
}

export function ProjectDrawer({ project, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(project?.name ?? "")
  const [client, setClient] = useState(project?.client ?? "")
  const [mainAssignee, setMainAssignee] = useState<typeof MEMBERS[number]>(project?.mainAssignee ?? "今井")
  const [subAssignee, setSubAssignee] = useState<typeof MEMBERS[number] | "">(project?.subAssignee ?? "")
  const [priority, setPriority] = useState(project?.priority ?? "中")
  const [status, setStatus] = useState(project?.status ?? "active")
  const [description, setDescription] = useState(project?.description ?? "")
  const [presalesTemplateId, setPresalesTemplateId] = useState(project?.presalesTemplateId ?? "ps-standard")
  const [fdeTemplateId, setFdeTemplateId] = useState(project?.fdeTemplateId ?? "")
  const [milestones, setMilestones] = useState<Milestone[]>(project?.milestones ?? [])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // When template changes, merge: keep existing dates, add new phases, remove old phases
  const handlePresalesTemplateChange = (newId: string) => {
    setPresalesTemplateId(newId)
    const fde = getFdeTemplate(fdeTemplateId)
    const fresh = buildMilestones(newId, fdeTemplateId)
    // Preserve dates for matching phase IDs
    const merged = fresh.map((m) => {
      const existing = milestones.find((e) => e.id === m.id)
      return existing ? { ...m, date: existing.date, completed: existing.completed } : m
    })
    // Keep FDE milestones
    const fdeMs = milestones.filter((m) => m.track === "fde" && fde.phases.some((p) => p.id === m.id))
    setMilestones([...merged.filter((m) => m.track === "presales"), ...fdeMs])
  }

  const handleFdeTemplateChange = (newId: string) => {
    setFdeTemplateId(newId)
    const fresh = buildMilestones(presalesTemplateId, newId)
    const merged = fresh.map((m) => {
      const existing = milestones.find((e) => e.id === m.id)
      return existing ? { ...m, date: existing.date, completed: existing.completed } : m
    })
    setMilestones(merged)
  }

  // Initialize milestones when opening for new project
  useEffect(() => {
    if (!project && milestones.length === 0) {
      setMilestones(buildMilestones(presalesTemplateId, fdeTemplateId))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMilestoneDate = (phaseId: string, date: string) => {
    setMilestones((prev) => prev.map((m) => m.id === phaseId ? { ...m, date } : m))
  }

  const handleToggleComplete = (phaseId: string) => {
    setMilestones((prev) => prev.map((m) => m.id === phaseId ? { ...m, completed: !m.completed } : m))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !client.trim()) return
    onSave({
      name, client, mainAssignee, subAssignee, presalesTemplateId,
      fdeTemplateId, milestones, priority, status, description,
    })
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">
              {project ? "案件編集" : "新規案件登録"}
            </h2>
            {project && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[340px]">{project.name}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Form (scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Basic info */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">案件名 *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: Google Workspace 全社導入支援"
                  required
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">クライアント *</label>
                <Input
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="例: A社（製造業・5,000名）"
                  required
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Main assignee */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">主担当 *</label>
                  <div className="flex gap-1.5">
                    {MEMBERS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMainAssignee(m)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          mainAssignee === m
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Sub assignee */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">副担当</label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSubAssignee("")}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        subAssignee === "" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      なし
                    </button>
                    {MEMBERS.filter((m) => m !== mainAssignee).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSubAssignee(m)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          subAssignee === m ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">優先度</label>
                  <div className="flex gap-1">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          priority === p
                            ? p === "高" ? "border-red-400 bg-red-50 text-red-700"
                              : p === "中" ? "border-amber-400 bg-amber-50 text-amber-700"
                              : "border-green-400 bg-green-50 text-green-700"
                            : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">ステータス</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as typeof status)}
                      className="w-full h-8 pl-3 pr-8 text-sm rounded-lg border border-border bg-background appearance-none text-foreground"
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">案件概要</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="案件の背景・目的・スコープを記載..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Presales milestones */}
            <TemplateSection
              track="presales"
              templateId={presalesTemplateId}
              onTemplateChange={handlePresalesTemplateChange}
              milestones={milestones}
              onMilestoneChange={handleMilestoneDate}
              onToggleComplete={handleToggleComplete}
            />

            {/* FDE milestones */}
            <TemplateSection
              track="fde"
              templateId={fdeTemplateId}
              onTemplateChange={handleFdeTemplateChange}
              milestones={milestones}
              onMilestoneChange={handleMilestoneDate}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4 shrink-0">
          {project && onDelete && (
            <div className="mb-3">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={12} />
                  この案件を削除
                </button>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                  <span className="text-xs text-red-700 flex-1">本当に削除しますか？</span>
                  <button type="button" onClick={onDelete} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-100">削除</button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">キャンセル</button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-9">
              キャンセル
            </Button>
            <Button type="submit" className="flex-1 h-9" onClick={handleSubmit}>
              {project ? "更新" : "登録"}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
