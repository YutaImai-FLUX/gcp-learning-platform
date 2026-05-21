export const MEMBERS = ["金山", "今井", "秋武"] as const
export type Member = (typeof MEMBERS)[number]

export const PRIORITIES = ["高", "中", "低"] as const
export type Priority = (typeof PRIORITIES)[number]

export const PROJECT_STATUSES = ["active", "won", "lost", "hold"] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "進行中",
  won: "受注済み",
  lost: "失注",
  hold: "保留中",
}

export interface Milestone {
  id: string       // template phase ID (unique per project)
  label: string
  track: "presales" | "fde"
  date: string     // YYYY-MM-DD or "" if not yet set
  completed: boolean
  isReview: boolean
  reviewer?: string // "小島Dir" | "西澤さん" | "CR" | "クライアント"
}

export interface Project {
  id: string
  name: string
  client: string
  mainAssignee: Member
  subAssignee: Member | ""
  presalesTemplateId: string
  fdeTemplateId: string        // "" = FDEなし
  milestones: Milestone[]
  priority: Priority
  status: ProjectStatus
  description: string
  createdAt: string
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function getNextMilestone(project: Project): Milestone | null {
  return (
    project.milestones
      .filter((m) => !m.completed && m.date)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  )
}

export function getProjectProgress(project: Project): number {
  const total = project.milestones.length
  if (total === 0) return 0
  const filled = project.milestones.filter((m) => m.date).length
  return Math.round((filled / total) * 100)
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 999
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}
