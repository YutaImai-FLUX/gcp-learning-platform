"use client"

import { Flame } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"

interface StreakDisplayProps {
  compact?: boolean
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const streaks = useGameStore((s) => s.streaks)
  const { currentStreak, longestStreak } = streaks

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs">
        <Flame size={12} className={currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"} />
        <span className={currentStreak > 0 ? "font-bold text-orange-500" : "text-muted-foreground"}>
          {currentStreak}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        currentStreak > 0
          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
          : "bg-muted text-muted-foreground"
      }`}>
        <Flame size={20} />
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{currentStreak}</span>
          <span className="text-xs text-muted-foreground">日連続</span>
        </div>
        <p className="text-[10px] text-muted-foreground">最長: {longestStreak}日</p>
      </div>
    </div>
  )
}
