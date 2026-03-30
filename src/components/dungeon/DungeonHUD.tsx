"use client"

import { Heart, Star, Trophy } from "lucide-react"
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
    <div
      className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg text-xs"
      style={{ backgroundColor: theme.tileColor, color: theme.textColor, border: `1px solid ${theme.tileBorder}` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Heart size={14} style={{ color: theme.accentColor }} />
          <span className="font-bold">Lv.{level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} style={{ color: theme.accentColor }} />
          <span>{xp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Trophy size={14} style={{ color: theme.accentColor }} />
        <span>{clearedCount}/{totalRooms} 部屋</span>
        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: theme.accentColor }}
          />
        </div>
        <span className="text-[10px] opacity-70">{progressPct}%</span>
      </div>
    </div>
  )
}
