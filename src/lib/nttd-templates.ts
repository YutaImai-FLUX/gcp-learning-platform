export interface PhaseDefinition {
  id: string
  label: string
  track: "presales" | "fde"
  isReview: boolean
  reviewer?: string
  suggestedDaysFromPrev: number // hint for auto-fill
}

export interface PhaseTemplate {
  id: string
  name: string
  shortName: string
  track: "presales" | "fde"
  phases: PhaseDefinition[]
}

// ─── Presales Templates ───────────────────────────────────────────────────────

export const PRESALES_TEMPLATES: PhaseTemplate[] = [
  {
    id: "ps-standard",
    name: "標準プリセールス",
    shortName: "標準 (7フェーズ)",
    track: "presales",
    phases: [
      { id: "ps-hearing",       label: "初期ヒアリング",              track: "presales", isReview: false, suggestedDaysFromPrev: 0 },
      { id: "ps-draft",         label: "提案書作成",                  track: "presales", isReview: false, suggestedDaysFromPrev: 7 },
      { id: "ps-kojima",        label: "小島Dir レビュー",            track: "presales", isReview: true,  reviewer: "小島Dir",       suggestedDaysFromPrev: 5 },
      { id: "ps-nishizawa",     label: "西澤さん レビュー",           track: "presales", isReview: true,  reviewer: "西澤さん",       suggestedDaysFromPrev: 5 },
      { id: "ps-cr",            label: "CR レビュー",                 track: "presales", isReview: true,  reviewer: "CR",             suggestedDaysFromPrev: 3 },
      { id: "ps-pre-proposal",  label: "プレ提案（クライアント）",     track: "presales", isReview: true,  reviewer: "クライアント",   suggestedDaysFromPrev: 7 },
      { id: "ps-final-proposal",label: "本提案（クライアント）",       track: "presales", isReview: true,  reviewer: "クライアント",   suggestedDaysFromPrev: 14 },
    ],
  },
  {
    id: "ps-fast",
    name: "スピードプリセールス",
    shortName: "スピード (5フェーズ)",
    track: "presales",
    phases: [
      { id: "ps-hearing",         label: "初期ヒアリング",            track: "presales", isReview: false, suggestedDaysFromPrev: 0 },
      { id: "ps-draft",           label: "提案書作成",                track: "presales", isReview: false, suggestedDaysFromPrev: 5 },
      { id: "ps-kojima-nishizawa",label: "小島Dir + 西澤さん 合同",   track: "presales", isReview: true,  reviewer: "小島Dir",       suggestedDaysFromPrev: 4 },
      { id: "ps-cr",              label: "CR レビュー",               track: "presales", isReview: true,  reviewer: "CR",             suggestedDaysFromPrev: 3 },
      { id: "ps-final-proposal",  label: "本提案（クライアント）",     track: "presales", isReview: true,  reviewer: "クライアント",   suggestedDaysFromPrev: 7 },
    ],
  },
  {
    id: "ps-light",
    name: "軽量プリセールス",
    shortName: "軽量 (3フェーズ)",
    track: "presales",
    phases: [
      { id: "ps-hearing",       label: "ヒアリング",                  track: "presales", isReview: false, suggestedDaysFromPrev: 0 },
      { id: "ps-draft",         label: "提案書作成",                  track: "presales", isReview: false, suggestedDaysFromPrev: 7 },
      { id: "ps-final-proposal",label: "提案実施",                    track: "presales", isReview: true,  reviewer: "クライアント",   suggestedDaysFromPrev: 7 },
    ],
  },
]

// ─── FDE Templates ─────────────────────────────────────────────────────────────

export const FDE_TEMPLATES: PhaseTemplate[] = [
  {
    id: "fde-standard",
    name: "標準FDE",
    shortName: "標準 (5フェーズ)",
    track: "fde",
    phases: [
      { id: "fde-requirements",  label: "要件定義",                   track: "fde", isReview: false, suggestedDaysFromPrev: 0 },
      { id: "fde-arch",          label: "アーキテクチャ設計",          track: "fde", isReview: false, suggestedDaysFromPrev: 7 },
      { id: "fde-poc",           label: "PoC 実施",                    track: "fde", isReview: false, suggestedDaysFromPrev: 7 },
      { id: "fde-report",        label: "結果報告書作成",               track: "fde", isReview: false, suggestedDaysFromPrev: 5 },
      { id: "fde-integrate",     label: "提案書反映完了",               track: "fde", isReview: true,  reviewer: "小島Dir",       suggestedDaysFromPrev: 3 },
    ],
  },
  {
    id: "fde-light",
    name: "軽量FDE",
    shortName: "軽量 (3フェーズ)",
    track: "fde",
    phases: [
      { id: "fde-research",      label: "技術調査",                    track: "fde", isReview: false, suggestedDaysFromPrev: 0 },
      { id: "fde-poc",           label: "PoC / 検証",                  track: "fde", isReview: false, suggestedDaysFromPrev: 7 },
      { id: "fde-report",        label: "結果報告",                    track: "fde", isReview: false, suggestedDaysFromPrev: 5 },
    ],
  },
]

export const NO_FDE_TEMPLATE: PhaseTemplate = {
  id: "",
  name: "FDE なし",
  shortName: "なし",
  track: "fde",
  phases: [],
}

export const ALL_FDE_TEMPLATES = [NO_FDE_TEMPLATE, ...FDE_TEMPLATES]

// ─── Lookup helpers ────────────────────────────────────────────────────────────

export function getPresalesTemplate(id: string): PhaseTemplate {
  return PRESALES_TEMPLATES.find((t) => t.id === id) ?? PRESALES_TEMPLATES[0]
}

export function getFdeTemplate(id: string): PhaseTemplate {
  if (!id) return NO_FDE_TEMPLATE
  return FDE_TEMPLATES.find((t) => t.id === id) ?? NO_FDE_TEMPLATE
}

// Build initial milestone list from templates
export function buildMilestones(
  presalesTemplateId: string,
  fdeTemplateId: string
) {
  const ps = getPresalesTemplate(presalesTemplateId)
  const fde = getFdeTemplate(fdeTemplateId)

  return [...ps.phases, ...fde.phases].map((phase) => ({
    id: phase.id,
    label: phase.label,
    track: phase.track,
    date: "",
    completed: false,
    isReview: phase.isReview,
    reviewer: phase.reviewer,
  }))
}

// Reviewer color mapping
export const REVIEWER_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "小島Dir":      { bg: "bg-amber-100",   text: "text-amber-800",   dot: "#f59e0b" },
  "西澤さん":     { bg: "bg-orange-100",  text: "text-orange-800",  dot: "#ea580c" },
  "CR":           { bg: "bg-violet-100",  text: "text-violet-800",  dot: "#7c3aed" },
  "クライアント": { bg: "bg-blue-100",    text: "text-blue-800",    dot: "#2563eb" },
}

export const TRACK_COLORS = {
  presales: { bg: "bg-sky-50",      badge: "bg-sky-100 text-sky-700",      dot: "#0284c7" },
  fde:      { bg: "bg-emerald-50",  badge: "bg-emerald-100 text-emerald-700", dot: "#059669" },
}
