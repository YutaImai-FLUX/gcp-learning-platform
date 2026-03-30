"use client"

import { useGameStore } from "@/lib/stores/useGameStore"
import type { CertificationId } from "@/lib/types/quiz"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import type { DungeonMap } from "@/lib/types/dungeon"

interface DungeonHUDProps {
  certId: CertificationId
  dungeon: DungeonMap
  theme: ThemeConfig
}

export function DungeonHUD({ dungeon, theme }: DungeonHUDProps) {
  const xp = useGameStore((s) => s.xp)
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  const clearedCount = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
  const totalRooms = dungeon.rooms.length
  const progressPct = Math.round((clearedCount / totalRooms) * 100)

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg border border-border bg-card">
      {/* Level */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: theme.accentColor }}
        >
          {level}
        </span>
        <span className="text-xs text-muted-foreground">Lv.{level}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">
            {clearedCount}/{totalRooms} rooms
          </span>
          <span className="text-[10px] font-medium" style={{ color: theme.accentColor }}>
            {progressPct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              backgroundColor: theme.accentColor,
            }}
          />
        </div>
      </div>

      {/* XP */}
      <span className="text-xs font-medium text-muted-foreground shrink-0">
        {xp.toLocaleString()} XP
      </span>
    </div>
  )
}
