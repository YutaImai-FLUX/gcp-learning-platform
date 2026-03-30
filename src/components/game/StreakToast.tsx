"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface StreakToastProps {
  days: number
  onComplete: () => void
}

export function StreakToast({ days, onComplete }: StreakToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && "opacity" in def && def.opacity === 0) onComplete()
      }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white shadow-lg shadow-orange-500/25 backdrop-blur-sm"
    >
      <Flame size={16} className="shrink-0 text-yellow-200" />
      <span className="text-sm font-bold">{days}日連続学習！</span>
    </motion.div>
  )
}
