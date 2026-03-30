"use client"

import { useMemo } from "react"
import { useGameStore } from "@/lib/stores/useGameStore"

const CELL_SIZE = 11
const CELL_GAP = 2
const WEEKS = 26
const DAYS = 7

const COLORS = [
  "rgb(235 237 240)", // 0 activity
  "rgb(155 233 168)", // low
  "rgb(64 196 99)",   // medium
  "rgb(48 161 78)",   // high
  "rgb(33 110 57)",   // very high
]

const DARK_COLORS = [
  "rgb(45 48 52)",
  "rgb(14 68 41)",
  "rgb(0 109 50)",
  "rgb(38 166 65)",
  "rgb(57 211 83)",
]

function getColor(xp: number, isDark: boolean): string {
  const palette = isDark ? DARK_COLORS : COLORS
  if (xp === 0) return palette[0]
  if (xp < 20) return palette[1]
  if (xp < 50) return palette[2]
  if (xp < 100) return palette[3]
  return palette[4]
}

export function ActivityHeatmap() {
  const activityLog = useGameStore((s) => s.activityLog)

  const { cells, months } = useMemo(() => {
    const activityMap = new Map(activityLog.map((e) => [e.date, e.xpEarned]))
    const today = new Date()
    const totalDays = WEEKS * DAYS
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - totalDays + 1)

    // Align to start of week (Sunday)
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    const cellData: { date: string; xp: number; col: number; row: number }[] = []
    const monthLabels: { label: string; col: number }[] = []
    let lastMonth = -1

    for (let i = 0; i < WEEKS * DAYS + dayOfWeek; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().slice(0, 10)
      const col = Math.floor(i / DAYS)
      const row = i % DAYS

      cellData.push({
        date: dateStr,
        xp: activityMap.get(dateStr) ?? 0,
        col,
        row,
      })

      if (d.getMonth() !== lastMonth && row === 0) {
        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        monthLabels.push({ label: monthNames[d.getMonth()], col })
        lastMonth = d.getMonth()
      }
    }

    return { cells: cellData, months: monthLabels }
  }, [activityLog])

  const width = WEEKS * (CELL_SIZE + CELL_GAP) + 20
  const height = DAYS * (CELL_SIZE + CELL_GAP) + 20

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="block">
        {/* Month labels */}
        {months.map((m, i) => (
          <text
            key={i}
            x={m.col * (CELL_SIZE + CELL_GAP)}
            y={8}
            className="fill-muted-foreground text-[9px]"
          >
            {m.label}
          </text>
        ))}
        {/* Cells */}
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.col * (CELL_SIZE + CELL_GAP)}
            y={cell.row * (CELL_SIZE + CELL_GAP) + 14}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={2}
            className="transition-colors"
            fill={getColor(cell.xp, false)}
          >
            <title>{cell.date}: {cell.xp} XP</title>
          </rect>
        ))}
      </svg>
    </div>
  )
}
