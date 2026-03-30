"use client"

import { Sparkles } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import { xpToNextLevel } from "@/lib/game/xp-config"

interface XPProgressBarProps {
  compact?: boolean
}

export function XPProgressBar({ compact = false }: XPProgressBarProps) {
  const xp = useGameStore((s) => s.xp)
  const level = useGameStore((s) => s.level)
  const { current, required, progress } = xpToNextLevel(xp)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-gcp-yellow">
          <Sparkles size={12} />
          <span>Lv.{level}</span>
        </div>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[40px]">
          <div
            className="h-full bg-gradient-to-r from-gcp-yellow to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gcp-yellow to-amber-500 text-white text-xs font-bold">
            {level}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">レベル {level}</p>
            <p className="text-[10px] text-muted-foreground">{xp.toLocaleString()} XP</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          次のレベルまで <span className="font-medium text-foreground">{(required - current).toLocaleString()}</span> XP
        </p>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gcp-yellow to-amber-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{current.toLocaleString()} / {required.toLocaleString()} XP</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  )
}
