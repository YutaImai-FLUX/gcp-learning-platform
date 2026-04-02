"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import type { FlashCard as FlashCardType } from "@/lib/data/flashcards"
import { RotateCcw, Check, X } from "lucide-react"

interface FlashCardProps {
  card: FlashCardType
  onSwipe: (direction: "left" | "right") => void
}

export function FlashCardComponent({ card, onSwipe }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Keyboard shortcuts: ←/1 = review, →/2 = know, Space = flip
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "1") {
      onSwipe("left")
    } else if (e.key === "ArrowRight" || e.key === "2") {
      onSwipe("right")
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      setIsFlipped((prev) => !prev)
    }
  }, [onSwipe])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const leftOpacity = useTransform(x, [-100, 0], [1, 0])
  const rightOpacity = useTransform(x, [0, 100], [0, 1])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 80) {
      onSwipe("right")
    } else if (info.offset.x < -80) {
      onSwipe("left")
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      {/* Swipe indicators */}
      <motion.div
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
        style={{ opacity: leftOpacity }}
      >
        <X size={20} className="text-white" />
      </motion.div>
      <motion.div
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
        style={{ opacity: rightOpacity }}
      >
        <Check size={20} className="text-white" />
      </motion.div>

      <motion.div
        className="cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="relative w-full min-h-[280px]"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-border bg-card p-6 shadow-lg"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Front: Term */}
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-[10px] text-muted-foreground mb-3">{card.domain}</p>
              <h3 className="text-lg font-bold text-foreground leading-relaxed">{card.term}</h3>
              <p className="text-xs text-muted-foreground mt-4">タップして裏面を見る</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-border bg-card p-5 shadow-lg overflow-y-auto"
            animate={{ rotateY: isFlipped ? 0 : -180 }}
            transition={{ duration: 0.4 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Back: Definition + details */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">{card.term}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.definition}</p>

              {card.useCases.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-foreground mb-1">ユースケース:</p>
                  <ul className="space-y-0.5">
                    {card.useCases.slice(0, 3).map((uc, i) => (
                      <li key={i} className="text-[10px] text-muted-foreground">• {uc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {card.examRelevance && (
                <div className="rounded-lg bg-gcp-blue-light/50 dark:bg-gcp-blue/10 p-2">
                  <p className="text-[10px] text-gcp-blue font-medium">試験: {card.examRelevance}</p>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground text-center mt-2">
                ← 復習 | 知ってる → &#x2003; <span className="hidden sm:inline opacity-50">Space:めくる</span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Manual buttons */}
      <div className="flex justify-center gap-6 mt-4">
        <button
          onClick={() => onSwipe("left")}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <RotateCcw size={12} /> 復習
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
        >
          めくる
        </button>
        <button
          onClick={() => onSwipe("right")}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          <Check size={12} /> 知ってる
        </button>
      </div>
    </div>
  )
}
