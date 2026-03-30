"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DungeonNPC as DungeonNPCType } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { MessageCircle, ChevronRight } from "lucide-react"

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
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* Dialog box */}
        <motion.div
          className="relative w-full max-w-lg rounded-xl p-5 mb-4"
          style={{
            backgroundColor: theme.tileColor,
            border: `2px solid ${theme.accentColor}`,
            color: theme.textColor,
          }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          {/* NPC name */}
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} style={{ color: theme.accentColor }} />
            <span className="font-bold text-sm" style={{ color: theme.accentColor }}>
              {npc.name}
            </span>
          </div>

          {/* Dialogue text */}
          <p className="text-sm leading-relaxed mb-4 min-h-[3rem]">
            {npc.dialogues[dialogIndex]}
          </p>

          {/* Controls */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (isLast) {
                  onClose()
                } else {
                  setDialogIndex(dialogIndex + 1)
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors"
              style={{
                backgroundColor: theme.accentColor,
                color: "#fff",
              }}
            >
              {isLast ? "閉じる" : "次へ"}
              {!isLast && <ChevronRight size={12} />}
            </button>
          </div>

          {/* Page indicator */}
          <div className="flex gap-1 mt-2 justify-center">
            {npc.dialogues.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: i === dialogIndex ? theme.accentColor : theme.tileBorder,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
