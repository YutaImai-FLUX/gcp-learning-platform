"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { useGameStore } from "@/lib/stores/useGameStore"
import type { GameNotification } from "@/lib/stores/types"
import { XPToast } from "./XPToast"
import { LevelUpModal } from "./LevelUpModal"
import { AchievementToast } from "./AchievementToast"
import { StreakToast } from "./StreakToast"

const TOAST_DURATION_MS = 2500

export function GameNotifications() {
  const notifications = useGameStore((s) => s.notifications)
  const dismissNotification = useGameStore((s) => s.dismissNotification)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
  const [visibleToasts, setVisibleToasts] = useState<GameNotification[]>([])

  // Process notifications into toasts and modals
  useEffect(() => {
    if (notifications.length === 0) return

    const toasts: GameNotification[] = []
    for (const n of notifications) {
      if (n.type === "level_up") {
        setLevelUpLevel(n.payload.level ?? null)
        dismissNotification(n.id)
      } else {
        toasts.push(n)
        dismissNotification(n.id)
      }
    }

    if (toasts.length > 0) {
      setVisibleToasts((prev) => [...prev, ...toasts])
    }
  }, [notifications, dismissNotification])

  // Auto-dismiss toasts
  useEffect(() => {
    if (visibleToasts.length === 0) return
    const timer = setTimeout(() => {
      setVisibleToasts((prev) => prev.slice(1))
    }, TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [visibleToasts])

  const handleToastComplete = useCallback((id: string) => {
    setVisibleToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <>
      {/* Toast stack - fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {visibleToasts.slice(0, 3).map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              {toast.type === "xp" && (
                <XPToast xp={toast.payload.xp ?? 0} onComplete={() => handleToastComplete(toast.id)} />
              )}
              {toast.type === "achievement" && toast.payload.achievementId && (
                <AchievementToast
                  achievementId={toast.payload.achievementId}
                  onComplete={() => handleToastComplete(toast.id)}
                />
              )}
              {toast.type === "streak" && (
                <StreakToast days={toast.payload.streakDays ?? 0} onComplete={() => handleToastComplete(toast.id)} />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Level up modal */}
      <LevelUpModal
        level={levelUpLevel ?? 1}
        show={levelUpLevel !== null}
        onClose={() => setLevelUpLevel(null)}
      />
    </>
  )
}
