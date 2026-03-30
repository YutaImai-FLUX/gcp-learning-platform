"use client"

import { useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookOpen, FlaskConical, PlayCircle, Gift, Map } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"
import type { BattleState } from "@/lib/types/dungeon"
import { getDungeonMap } from "@/lib/game/dungeon-config"
import { DUNGEON_THEMES } from "@/lib/game/dungeon-themes"
import { QUIZ_QUESTIONS } from "@/lib/data/quiz-questions"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonMapView } from "@/components/dungeon/DungeonMap"
import { DungeonHUD } from "@/components/dungeon/DungeonHUD"
import { BattleScreen } from "@/components/dungeon/BattleScreen"
import { BattleResult } from "@/components/dungeon/BattleResult"

type Phase = "map" | "battle" | "result"

const ROOM_TYPE_INFO: Record<string, { icon: React.ElementType; description: string }> = {
  study: { icon: BookOpen, description: "学習モジュールを読んで知識を深めよう" },
  lab: { icon: FlaskConical, description: "ハンズオンラボで実践しよう" },
  demo: { icon: PlayCircle, description: "インタラクティブデモを体験しよう" },
  treasure: { icon: Gift, description: "コンセプトカードを獲得！" },
}

export default function DungeonCertPage() {
  const params = useParams()
  const certId = params.cert as CertificationId
  const dungeon = useMemo(() => getDungeonMap(certId), [certId])
  const theme = DUNGEON_THEMES[dungeon.theme]

  const [phase, setPhase] = useState<Phase>("map")
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [battleResult, setBattleResult] = useState<BattleState | null>(null)

  const activeRoom = activeRoomId ? dungeon.rooms.find((r) => r.id === activeRoomId) : null

  // Get questions for a quiz/boss room
  const battleQuestions = useMemo(() => {
    if (!activeRoom || (activeRoom.type !== "quiz" && activeRoom.type !== "boss")) return []

    let filtered = QUIZ_QUESTIONS.filter((q) => q.certId === certId)

    if (activeRoom.type === "quiz" && activeRoom.quizDomain && activeRoom.quizDomain !== "all") {
      filtered = filtered.filter((q) => q.domain === activeRoom.quizDomain)
    }

    // Shuffle and take count
    const count = activeRoom.quizCount ?? 5
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      domain: q.domain,
    }))
  }, [activeRoom, certId])

  const handleRoomSelect = useCallback((roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return

    setActiveRoomId(roomId)

    if (room.type === "quiz" || room.type === "boss") {
      setPhase("battle")
    } else if (room.type === "start") {
      // Start rooms auto-clear via NPC dialog in DungeonMap
    } else {
      // Study/lab/demo/treasure rooms: auto-clear and award XP
      const store = useGameStore.getState()
      if (!store.dungeonProgress[roomId]?.cleared) {
        store.clearDungeonRoom(certId, roomId)
        store.addXP(room.xpReward, "dungeon")
      }
    }
  }, [dungeon.rooms, certId])

  const handleBattleComplete = useCallback((result: BattleState) => {
    setBattleResult(result)
    setPhase("result")

    if (result.result === "victory" && activeRoomId) {
      const store = useGameStore.getState()
      store.clearDungeonRoom(certId, activeRoomId, result.xpEarned)
      store.addXP(result.xpEarned, "dungeon-battle")
    }
  }, [activeRoomId, certId])

  const handleBackToMap = useCallback(() => {
    setPhase("map")
    setActiveRoomId(null)
    setBattleResult(null)
  }, [])

  const handleRetry = useCallback(() => {
    setPhase("battle")
    setBattleResult(null)
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/dungeon"
          className="p-2 hover:bg-muted transition-colors"
          style={{ imageRendering: "pixelated" }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0" style={{ imageRendering: "pixelated" }}>
            {theme.ambientEmoji[0]}
          </span>
          <div className="min-w-0">
            <h1
              className="text-base sm:text-lg font-bold truncate"
              style={{ color: theme.accentColor, textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}
            >
              {dungeon.name}
            </h1>
            <p
              className="text-[10px] text-muted-foreground truncate"
              style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}
            >
              {theme.biome} - {theme.nameJa}
            </p>
          </div>
        </div>

        {/* Back to map button when in battle */}
        {phase !== "map" && (
          <button
            onClick={handleBackToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            style={{ boxShadow: "inset 2px 2px 0 0 #C6C6C6, inset -2px -2px 0 0 #555555", backgroundColor: "#8B8B8B", color: "#fff", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}
          >
            <Map size={14} />
            マップ
          </button>
        )}
      </motion.div>

      {/* HUD */}
      <DungeonHUD certId={certId} dungeon={dungeon} theme={theme} />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`bg-gradient-to-b ${theme.bgGradient} p-3 sm:p-4`}
              style={{ border: `2px solid ${theme.tileBorder}`, boxShadow: `inset 3px 3px 0 0 ${theme.bevelLight}, inset -3px -3px 0 0 ${theme.bevelDark}` }}
          >
            <DungeonMapView
              dungeon={dungeon}
              theme={theme}
              onRoomSelect={handleRoomSelect}
            />
          </motion.div>
        )}

        {phase === "battle" && activeRoom && battleQuestions.length > 0 && (
          <motion.div
            key="battle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-gradient-to-b ${theme.bgGradient} p-3 sm:p-4`}
              style={{ border: `2px solid ${theme.tileBorder}`, boxShadow: `inset 3px 3px 0 0 ${theme.bevelLight}, inset -3px -3px 0 0 ${theme.bevelDark}` }}
          >
            <BattleScreen
              certId={certId}
              roomLabel={activeRoom.label}
              questions={battleQuestions}
              theme={theme}
              isBoss={activeRoom.type === "boss"}
              onComplete={handleBattleComplete}
            />
          </motion.div>
        )}

        {phase === "result" && battleResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-gradient-to-b ${theme.bgGradient} p-3 sm:p-4`}
              style={{ border: `2px solid ${theme.tileBorder}`, boxShadow: `inset 3px 3px 0 0 ${theme.bevelLight}, inset -3px -3px 0 0 ${theme.bevelDark}` }}
          >
            <BattleResult
              battle={battleResult}
              theme={theme}
              onContinue={handleBackToMap}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room info panel */}
      {phase === "map" && activeRoom && activeRoom.type !== "quiz" && activeRoom.type !== "boss" && activeRoom.type !== "start" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden"
          style={{
            border: `2px solid ${theme.tileBorder}`,
            boxShadow: `inset 3px 3px 0 0 ${theme.bevelLight}, inset -3px -3px 0 0 ${theme.bevelDark}`,
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: theme.tileColor, color: theme.textColor }}
          >
            {(() => {
              const info = ROOM_TYPE_INFO[activeRoom.type]
              const RoomIcon = info?.icon ?? BookOpen
              return (
                <>
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "#8B8B8B",
                      boxShadow: "inset 2px 2px 0 0 #C6C6C6, inset -2px -2px 0 0 #555555",
                    }}
                  >
                    <RoomIcon size={16} style={{ color: theme.accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}>{activeRoom.label}</p>
                    <p className="text-xs opacity-70" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>{info?.description}</p>
                  </div>
                  {activeRoom.xpReward > 0 && (
                    <span
                      className="text-xs font-bold px-2 py-1 shrink-0"
                      style={{ color: "#80FF20", textShadow: "1px 1px 0 #1A3A00" }}
                    >
                      +{activeRoom.xpReward} XP
                    </span>
                  )}
                </>
              )
            })()}
          </div>
        </motion.div>
      )}
    </div>
  )
}
