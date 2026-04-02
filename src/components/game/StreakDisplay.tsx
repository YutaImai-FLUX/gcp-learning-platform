"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Flame, Star, Trophy, Crown } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"

interface StreakDisplayProps {
  compact?: boolean
}

const MILESTONES = [
  { days: 7, label: "1週間", icon: Star, color: "#FF9800" },
  { days: 14, label: "2週間", icon: Trophy, color: "#4CAF50" },
  { days: 30, label: "1ヶ月", icon: Crown, color: "#FFD700" },
] as const

function getActiveMilestone(streak: number) {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (streak >= MILESTONES[i].days) return MILESTONES[i]
  }
  return null
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const streaks = useGameStore((s) => s.streaks)
  const { currentStreak, longestStreak } = streaks
  const milestone = getActiveMilestone(currentStreak)

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs">
        <Flame size={12} className={currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"} />
        <span className={currentStreak > 0 ? "font-bold text-orange-500" : "text-muted-foreground"}>
          {currentStreak}
        </span>
        {milestone && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-0.5"
          >
            {milestone.days === 30 ? "👑" : milestone.days === 14 ? "🏆" : "⭐"}
          </motion.span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${
        currentStreak > 0
          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
          : "bg-muted text-muted-foreground"
      }`}>
        <Flame size={20} />
        {/* Pulse animation for active streaks */}
        {currentStreak > 0 && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-orange-500/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{currentStreak}</span>
          <span className="text-xs text-muted-foreground">日連続</span>
        </div>
        <p className="text-[10px] text-muted-foreground">最長: {longestStreak}日</p>
      </div>

      {/* Milestone badge */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ borderColor: milestone.color, backgroundColor: `${milestone.color}15` }}
          >
            <milestone.icon size={12} style={{ color: milestone.color }} />
            <span className="text-[10px] font-bold" style={{ color: milestone.color }}>
              {milestone.label}達成！
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
