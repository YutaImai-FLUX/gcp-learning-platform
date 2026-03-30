"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DungeonNPC as DungeonNPCType } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"

interface DungeonNPCProps {
  npc: DungeonNPCType
  theme: ThemeConfig
  onClose: () => void
}

const TS = "1px 1px 0 rgba(0,0,0,0.7)"

function mcBevel(light: string, dark: string, size = 3): string {
  return `inset ${size}px ${size}px 0 0 ${light}, inset -${size}px -${size}px 0 0 ${dark}`
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
        {/* Backdrop (dark like MC pause screen) */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />

        {/* MC-style dialog box */}
        <motion.div
          className="relative w-full max-w-lg p-5 mb-4"
          style={{
            backgroundColor: theme.tileColor,
            border: `2px solid ${theme.tileBorder}`,
            boxShadow: mcBevel(theme.bevelLight, theme.bevelDark, 4),
            imageRendering: "pixelated",
          }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          {/* NPC name (MC yellow title) */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🧙</span>
            <span
              className="font-bold text-sm"
              style={{ color: "#FFFF55", textShadow: "1px 1px 0 #555500" }}
            >
              {npc.name}
            </span>
          </div>

          {/* Dialogue text (MC white with shadow) */}
          <p
            className="text-sm leading-relaxed mb-4 min-h-[3rem]"
            style={{ color: "#FFFFFF", textShadow: TS }}
          >
            {npc.dialogues[dialogIndex]}
          </p>

          {/* MC-style button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (isLast) {
                  onClose()
                } else {
                  setDialogIndex(dialogIndex + 1)
                }
              }}
              className="px-4 py-1.5 text-xs font-bold transition-all hover:brightness-110 active:brightness-90"
              style={{
                backgroundColor: "#8B8B8B",
                color: "#FFFFFF",
                textShadow: TS,
                boxShadow: mcBevel("#C6C6C6", "#555555", 2),
                border: "1px solid #555",
              }}
            >
              {isLast ? "閉じる" : "次へ  >>"}
            </button>
          </div>

          {/* Page dots */}
          <div className="flex gap-1.5 mt-3 justify-center">
            {npc.dialogues.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2"
                style={{
                  backgroundColor: i === dialogIndex ? "#80FF20" : theme.tileBorder,
                  boxShadow: i === dialogIndex ? "0 0 4px #80FF20" : undefined,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
