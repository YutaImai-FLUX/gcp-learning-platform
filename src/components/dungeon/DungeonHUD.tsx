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

/** MC text shadow */
const TS = "1px 1px 0 rgba(0,0,0,0.7)"

/** MC 3D bevel */
function mcBevel(light: string, dark: string, size = 3): string {
  return `inset ${size}px ${size}px 0 0 ${light}, inset -${size}px -${size}px 0 0 ${dark}`
}

export function DungeonHUD({ dungeon, theme }: DungeonHUDProps) {
  const xp = useGameStore((s) => s.xp)
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  const clearedCount = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
  const totalRooms = dungeon.rooms.length
  const progressPct = Math.round((clearedCount / totalRooms) * 100)

  const quizCleared = dungeon.rooms.filter((r) => (r.type === "quiz" || r.type === "boss") && dungeonProgress[r.id]?.cleared).length
  const totalQuiz = dungeon.rooms.filter((r) => r.type === "quiz" || r.type === "boss").length

  // Generate hearts (each heart = 1 cleared quiz, max 10 display)
  const maxHearts = Math.min(totalQuiz, 10)
  const filledHearts = Math.min(quizCleared, maxHearts)

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundColor: theme.tileColor,
        border: `2px solid ${theme.tileBorder}`,
        boxShadow: mcBevel(theme.bevelLight, theme.bevelDark),
        imageRendering: "pixelated",
      }}
    >
      {/* Top bar — Level badge + Hearts + XP */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Level badge (MC inventory slot style) */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              backgroundColor: "#8B8B8B",
              boxShadow: mcBevel("#C6C6C6", "#555555", 2),
            }}
          >
            <span
              className="text-xs font-black text-white"
              style={{ textShadow: TS }}
            >
              {level}
            </span>
          </div>

          {/* Hearts row */}
          <div className="flex items-center gap-0.5 flex-wrap">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <span
                key={i}
                className="text-xs"
                style={{
                  opacity: i < filledHearts ? 1 : 0.3,
                  filter: i < filledHearts ? "none" : "grayscale(1)",
                }}
              >
                {i < filledHearts ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
        </div>

        {/* XP counter (MC green) */}
        <span
          className="text-xs font-bold"
          style={{ color: "#80FF20", textShadow: "1px 1px 0 #1A3A00" }}
        >
          {xp.toLocaleString()} XP
        </span>
      </div>

      {/* XP Bar (MC experience bar style) */}
      <div className="px-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[9px] font-medium"
            style={{ color: theme.textColor, textShadow: TS, opacity: 0.7 }}
          >
            {theme.biome ?? dungeon.name}
          </span>
          <span
            className="text-[9px] font-bold"
            style={{ color: "#80FF20", textShadow: "1px 1px 0 #1A3A00" }}
          >
            {clearedCount}/{totalRooms} ({progressPct}%)
          </span>
        </div>
        {/* Bar background (dark with bevel) */}
        <div
          className="h-3 relative"
          style={{
            backgroundColor: "#1E1E1E",
            boxShadow: mcBevel("#333", "#0A0A0A", 1),
          }}
        >
          {/* Filled portion (MC lime green) */}
          <div
            className="h-full transition-all duration-700 ease-out relative"
            style={{
              width: `${progressPct}%`,
              backgroundColor: "#80FF20",
              boxShadow: progressPct > 0 ? "inset 0 -2px 0 0 #5CB800" : undefined,
            }}
          >
            {/* Top highlight stripe */}
            {progressPct > 0 && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: "#A0FF40" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
