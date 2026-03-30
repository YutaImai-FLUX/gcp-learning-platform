"use client"

import { motion } from "framer-motion"
import { Award } from "lucide-react"
import { getAchievementById } from "@/lib/game/achievements"

interface AchievementToastProps {
  achievementId: string
  onComplete: () => void
}

export function AchievementToast({ achievementId, onComplete }: AchievementToastProps) {
  const achievement = getAchievementById(achievementId)
  if (!achievement) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && "opacity" in def && def.opacity === 0) onComplete()
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg shadow-purple-500/25 backdrop-blur-sm max-w-xs"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 shrink-0">
        <Award size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold truncate">{achievement.nameJa}</p>
        <p className="text-[10px] text-white/70 truncate">{achievement.descriptionJa}</p>
      </div>
    </motion.div>
  )
}
