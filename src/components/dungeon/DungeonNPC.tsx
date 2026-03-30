"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DungeonNPC as DungeonNPCType } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { ChevronRight } from "lucide-react"

interface DungeonNPCProps {
  npc: DungeonNPCType
  theme: ThemeConfig
  onClose: () => void
}

export function DungeonNPCDialog({ npc, theme, onClose }: DungeonNPCProps) {
  const [dialogIndex, setDialogIndex] = useState(0)
  const isLast = dialogIndex >= npc.dialogues.length - 1

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-lg rounded-lg border border-border bg-card p-5 mb-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          {/* NPC name */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{theme.icon}</span>
            <span className="font-semibold text-sm" style={{ color: theme.accentColor }}>
              {npc.name}
            </span>
          </div>

          {/* Dialogue */}
          <p className="text-sm leading-relaxed text-foreground mb-4 min-h-[3rem]">
            {npc.dialogues[dialogIndex]}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Page indicator */}
            <div className="flex gap-1">
              {npc.dialogues.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: i === dialogIndex ? theme.accentColor : "var(--border)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (isLast) onClose()
                else setDialogIndex(dialogIndex + 1)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: theme.accentColor }}
            >
              {isLast ? "始める" : "次へ"}
              {!isLast && <ChevronRight size={12} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
