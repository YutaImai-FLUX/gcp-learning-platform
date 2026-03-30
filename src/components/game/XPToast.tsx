"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface XPToastProps {
  xp: number
  onComplete: () => void
}

export function XPToast({ xp, onComplete }: XPToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && "opacity" in def && def.opacity === 0) onComplete()
      }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gcp-yellow/90 to-amber-500/90 text-white shadow-lg shadow-amber-500/25 backdrop-blur-sm"
    >
      <Sparkles size={16} className="shrink-0" />
      <span className="text-sm font-bold">+{xp} XP</span>
    </motion.div>
  )
}
