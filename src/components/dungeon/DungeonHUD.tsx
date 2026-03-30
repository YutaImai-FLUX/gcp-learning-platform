"use client"

import { Star, Trophy, Shield } from "lucide-react"
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

  // Count room types cleared
  const quizCleared = dungeon.rooms.filter((r) => (r.type === "quiz" || r.type === "boss") && dungeonProgress[r.id]?.cleared).length
  const totalQuiz = dungeon.rooms.filter((r) => r.type === "quiz" || r.type === "boss").length

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${theme.tileBorder}` }}
    >
      {/* Top bar - Level & XP */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: theme.tileColor, color: theme.textColor }}
      >
        <div className="flex items-center gap-4">
          {/* Level badge */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: theme.accentColor }}
            >
              {level}
            </div>
            <div className="text-xs">
              <div className="font-bold" style={{ color: theme.textColor }}>Lv.{level}</div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1">
            <Star size={13} style={{ color: theme.accentColor }} />
            <span className="text-xs font-medium">{xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Battle stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <Shield size={12} style={{ color: theme.accentColor }} />
            <span>{quizCleared}/{totalQuiz} 戦闘</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="px-4 py-2 flex items-center gap-3"
        style={{ backgroundColor: theme.tileColor + "80" }}
      >
        <Trophy size={13} style={{ color: theme.accentColor }} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium" style={{ color: theme.textColor + "99" }}>
              ダンジョン進行度
            </span>
            <span className="text-[10px] font-bold" style={{ color: theme.accentColor }}>
              {clearedCount}/{totalRooms} 部屋 ({progressPct}%)
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.accentColor}cc)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
