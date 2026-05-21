"use client"

import { useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { Project, Milestone } from "@/lib/types/project"
import { REVIEWER_COLORS } from "@/lib/nttd-templates"
import { cn } from "@/lib/utils"

interface OverlapAlert {
  date: string
  reviewer: string
  projects: string[]
}

interface Props {
  projects: Project[]
  overlaps: OverlapAlert[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
}

const PROJECT_COLORS = [
  "#2563eb", // blue
  "#7c3aed", // violet
  "#059669", // emerald
  "#d97706", // amber
  "#db2777", // pink
  "#0891b2", // cyan
]

const TRACK_SHAPES = {
  presales: "circle",
  fde: "diamond",
} as const

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function toMs(dateStr: string): number {
  return new Date(dateStr).getTime()
}

function msToX(ms: number, startMs: number, pxPerDay: number): number {
  return ((ms - startMs) / 86_400_000) * pxPerDay
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipState {
  x: number
  y: number
  milestone: Milestone
  projectName: string
}

function Tooltip({ tooltip }: { tooltip: TooltipState }) {
  const reviewer = tooltip.milestone.reviewer
  const reviewerStyle = reviewer ? REVIEWER_COLORS[reviewer] : null
  const days = tooltip.milestone.date
    ? Math.ceil((new Date(tooltip.milestone.date).getTime() - Date.now()) / 86_400_000)
    : null

  return (
    <div
      className="fixed z-50 bg-white/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-3 text-xs pointer-events-none min-w-[180px] max-w-[240px]"
      style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
    >
      <div className="font-semibold text-foreground mb-1 truncate">{tooltip.milestone.label}</div>
      <div className="text-muted-foreground mb-1.5 truncate">{tooltip.projectName}</div>
      {reviewerStyle && reviewer && (
        <span className={cn("inline-flex px-1.5 py-0.5 rounded font-medium mb-1.5", reviewerStyle.bg, reviewerStyle.text)}>
          {reviewer}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">{tooltip.milestone.date}</span>
        {days !== null && (
          <span className={cn("font-semibold", days < 0 ? "text-red-500" : days <= 7 ? "text-orange-500" : "text-muted-foreground")}>
            {days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "今日" : `残${days}日`}
          </span>
        )}
      </div>
      {tooltip.milestone.completed && (
        <div className="mt-1 text-green-600 font-medium">✓ 完了</div>
      )}
    </div>
  )
}

// ─── SVG Milestone marker ─────────────────────────────────────────────────────

function MilestoneMarker({
  cx, cy, milestone, color, isSelected, onHover, onLeave,
}: {
  cx: number
  cy: number
  milestone: Milestone
  color: string
  isSelected: boolean
  onHover: (e: React.MouseEvent) => void
  onLeave: () => void
}) {
  const reviewerDot = milestone.reviewer ? REVIEWER_COLORS[milestone.reviewer]?.dot : null
  const fill = milestone.completed
    ? (reviewerDot ?? color)
    : milestone.date
    ? "white"
    : "transparent"
  const stroke = milestone.completed
    ? (reviewerDot ?? color)
    : reviewerDot ?? color

  const size = milestone.isReview ? 7 : 5
  const strokeW = milestone.isReview ? 2 : 1.5

  if (milestone.track === "fde") {
    // Diamond shape
    const d = size
    return (
      <g
        onMouseMove={onHover}
        onMouseLeave={onLeave}
        style={{ cursor: "pointer" }}
        opacity={!milestone.date ? 0.25 : 1}
      >
        <polygon
          points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeW}
          className="transition-all"
        />
        {isSelected && (
          <circle cx={cx} cy={cy} r={d + 4} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />
        )}
      </g>
    )
  }

  return (
    <g
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
      opacity={!milestone.date ? 0.25 : 1}
    >
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeW}
        className="transition-all"
      />
      {milestone.completed && (
        <path
          d={`M${cx - size * 0.45},${cy} L${cx - size * 0.1},${cy + size * 0.35} L${cx + size * 0.5},${cy - size * 0.35}`}
          fill="none"
          stroke={reviewerDot ?? color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {isSelected && (
        <circle cx={cx} cy={cy} r={size + 4} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />
      )}
    </g>
  )
}

// ─── Main Gantt ───────────────────────────────────────────────────────────────

const ROW_H = 52
const HEADER_H = 42
const LEFT_W = 140
const PX_PER_DAY = 28

export function MilestoneGantt({ projects, overlaps, selectedProjectId, onSelectProject }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const { startDate, totalDays, overlapDates } = useMemo(() => {
    const today = new Date()
    const allDates = projects.flatMap((p) => p.milestones.map((m) => m.date).filter(Boolean))
    const maxDate = allDates.length > 0
      ? new Date(Math.max(...allDates.map((d) => new Date(d).getTime())))
      : new Date(today.getTime() + 30 * 86_400_000)

    const start = new Date(today)
    start.setDate(start.getDate() - 5)

    maxDate.setDate(maxDate.getDate() + 10)
    const days = Math.max(30, Math.ceil((maxDate.getTime() - start.getTime()) / 86_400_000))

    const overlapSet = new Set(overlaps.map((o) => o.date))
    return { startDate: start, totalDays: days, overlapDates: overlapSet }
  }, [projects, overlaps])

  const startMs = startDate.getTime()
  const svgW = LEFT_W + totalDays * PX_PER_DAY
  const svgH = HEADER_H + projects.length * ROW_H + 12

  const todayX = LEFT_W + msToX(Date.now(), startMs, PX_PER_DAY)

  // Generate date axis labels
  const dateLabels = useMemo(() => {
    const labels: { x: number; label: string; isToday: boolean; isOverlap: boolean }[] = []
    for (let i = 0; i <= totalDays; i += 2) {
      const d = new Date(startMs + i * 86_400_000)
      const dateStr = d.toISOString().split("T")[0]
      const isToday = d.toDateString() === new Date().toDateString()
      const isOverlap = overlapDates.has(dateStr)
      const label = `${d.getMonth() + 1}/${d.getDate()}`
      labels.push({ x: LEFT_W + i * PX_PER_DAY, label, isToday, isOverlap })
    }
    return labels
  }, [startMs, totalDays, overlapDates])

  if (projects.length === 0) {
    return (
      <Card className="border-border flex-1 flex items-center justify-center">
        <div className="text-center space-y-2 p-8">
          <div className="text-muted-foreground text-sm">進行中の案件がありません</div>
          <div className="text-xs text-muted-foreground/60">「新規案件」から案件を登録してください</div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border flex-1 overflow-hidden flex flex-col">
      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-border shrink-0 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground">凡例</span>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <svg width={10} height={10}><circle cx={5} cy={5} r={4} fill="white" stroke="#0284c7" strokeWidth={1.5} /></svg>
          プリセールス
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <svg width={10} height={10}><polygon points="5,1 9,5 5,9 1,5" fill="white" stroke="#059669" strokeWidth={1.5} /></svg>
          FDE
        </div>
        {Object.entries(REVIEWER_COLORS).map(([r, c]) => (
          <div key={r} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <svg width={10} height={10}><circle cx={5} cy={5} r={4} fill={c.dot} /></svg>
            {r}
          </div>
        ))}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <svg width={14} height={10}><line x1={0} y1={5} x2={14} y2={5} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3,2" /></svg>
          今日
        </div>
        {overlapDates.size > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-orange-600">
            <svg width={10} height={10}><rect x={1} y={1} width={8} height={8} fill="#fed7aa" rx={2} /></svg>
            重複
          </div>
        )}
      </div>

      {/* Scrollable gantt */}
      <div ref={containerRef} className="flex-1 overflow-auto">
        <svg
          width={svgW}
          height={svgH}
          className="block"
          style={{ minWidth: svgW }}
        >
          {/* Background */}
          <rect width={svgW} height={svgH} fill="transparent" />

          {/* Overlap background bands */}
          {overlaps.map((ov) => {
            const ms = new Date(ov.date).getTime()
            const x = LEFT_W + msToX(ms, startMs, PX_PER_DAY) - PX_PER_DAY / 2
            return (
              <rect
                key={`${ov.date}-${ov.reviewer}`}
                x={x} y={0} width={PX_PER_DAY} height={svgH}
                fill="#fed7aa" opacity={0.3}
              />
            )
          })}

          {/* Row backgrounds + horizontal lines */}
          {projects.map((_, i) => (
            <g key={i}>
              <rect
                x={0} y={HEADER_H + i * ROW_H}
                width={svgW} height={ROW_H}
                fill={i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)"}
              />
              <line
                x1={LEFT_W} y1={HEADER_H + (i + 1) * ROW_H}
                x2={svgW} y2={HEADER_H + (i + 1) * ROW_H}
                stroke="rgba(0,0,0,0.06)" strokeWidth={1}
              />
            </g>
          ))}

          {/* Date axis lines */}
          {dateLabels.map((dl) => (
            <line
              key={dl.x}
              x1={dl.x} y1={HEADER_H}
              x2={dl.x} y2={svgH}
              stroke={dl.isOverlap ? "#fb923c" : "rgba(0,0,0,0.06)"}
              strokeWidth={dl.isOverlap ? 1.5 : 1}
              strokeDasharray={dl.isOverlap ? "4,3" : undefined}
            />
          ))}

          {/* Header */}
          <rect x={0} y={0} width={svgW} height={HEADER_H} fill="white" />
          <line x1={0} y1={HEADER_H} x2={svgW} y2={HEADER_H} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />

          {/* Date labels */}
          {dateLabels.map((dl) => (
            <text
              key={`label-${dl.x}`}
              x={dl.x}
              y={HEADER_H - 10}
              textAnchor="middle"
              fontSize={10}
              fill={dl.isToday ? "#ef4444" : dl.isOverlap ? "#ea580c" : "#94a3b8"}
              fontWeight={dl.isToday || dl.isOverlap ? "600" : "400"}
            >
              {dl.label}
            </text>
          ))}

          {/* Overlap icons in header */}
          {overlaps.map((ov) => {
            const ms = new Date(ov.date).getTime()
            const x = LEFT_W + msToX(ms, startMs, PX_PER_DAY)
            return (
              <text key={`ov-${ov.date}`} x={x} y={12} textAnchor="middle" fontSize={8} fill="#ea580c">
                ⚠
              </text>
            )
          })}

          {/* Project labels column */}
          <rect x={0} y={0} width={LEFT_W} height={svgH} fill="white" />
          <line x1={LEFT_W} y1={0} x2={LEFT_W} y2={svgH} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />

          {projects.map((p, i) => {
            const cy = HEADER_H + i * ROW_H + ROW_H / 2
            const isSelected = p.id === selectedProjectId
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length]
            return (
              <g key={`label-${p.id}`}>
                {/* Left accent */}
                <rect
                  x={0} y={HEADER_H + i * ROW_H + 8}
                  width={3} height={ROW_H - 16}
                  fill={color} rx={1.5}
                  opacity={isSelected ? 1 : 0.4}
                />
                {/* Clickable label */}
                <rect
                  x={4} y={HEADER_H + i * ROW_H}
                  width={LEFT_W - 4} height={ROW_H}
                  fill={isSelected ? `${color}10` : "transparent"}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectProject(p.id)}
                />
                <text
                  x={12} y={cy - 5}
                  fontSize={11}
                  fontWeight={isSelected ? "700" : "500"}
                  fill={isSelected ? color : "#374151"}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectProject(p.id)}
                >
                  {p.name.length > 10 ? p.name.slice(0, 10) + "…" : p.name}
                </text>
                <text x={12} y={cy + 8} fontSize={9} fill="#94a3b8">
                  {p.mainAssignee}{p.subAssignee ? `・${p.subAssignee}` : ""}
                </text>
              </g>
            )
          })}

          {/* Milestone tracks per project */}
          {projects.map((p, i) => {
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length]
            const isSelected = p.id === selectedProjectId

            // Only show milestones with dates
            const datedMs = p.milestones.filter((m) => m.date)
            if (datedMs.length === 0) return null

            // Sort by date for line drawing
            const sorted = [...datedMs].sort((a, b) => a.date.localeCompare(b.date))

            const psMs = sorted.filter((m) => m.track === "presales")
            const fdeMs = sorted.filter((m) => m.track === "fde")

            const rowY = HEADER_H + i * ROW_H
            const psY = rowY + ROW_H * 0.35
            const fdeY = rowY + ROW_H * 0.68

            const renderTrack = (list: Milestone[], ty: number) => {
              if (list.length === 0) return null
              const points = list.map((m) => {
                const x = LEFT_W + msToX(toMs(m.date), startMs, PX_PER_DAY)
                return { x, m }
              })

              return (
                <g key={`track-${ty}`}>
                  {/* Connecting line */}
                  {points.length > 1 && (
                    <polyline
                      points={points.map((pt) => `${pt.x},${ty}`).join(" ")}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? undefined : "4,3"}
                      opacity={isSelected ? 0.7 : 0.35}
                    />
                  )}
                  {/* Markers */}
                  {points.map(({ x, m }) => (
                    <MilestoneMarker
                      key={m.id}
                      cx={x}
                      cy={ty}
                      milestone={m}
                      color={color}
                      isSelected={isSelected}
                      onHover={(e) => setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        milestone: m,
                        projectName: p.name,
                      })}
                      onLeave={() => setTooltip(null)}
                    />
                  ))}
                </g>
              )
            }

            return (
              <g key={`milestones-${p.id}`}>
                {renderTrack(psMs, psY)}
                {renderTrack(fdeMs, fdeY)}
              </g>
            )
          })}

          {/* Today line (on top) */}
          <line
            x1={todayX} y1={HEADER_H}
            x2={todayX} y2={svgH}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="4,3"
            opacity={0.7}
          />
          <polygon
            points={`${todayX - 5},${HEADER_H} ${todayX + 5},${HEADER_H} ${todayX},${HEADER_H + 7}`}
            fill="#ef4444"
          />
        </svg>
      </div>

      {tooltip && <Tooltip tooltip={tooltip} />}
    </Card>
  )
}
