"use client"

import { useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Sword } from "lucide-react"
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
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <Sword size={20} style={{ color: theme.accentColor }} />
          <h1 className="text-lg font-bold" style={{ color: theme.accentColor }}>
            {dungeon.name}
          </h1>
        </div>
      </motion.div>

      {/* HUD */}
      <DungeonHUD certId={certId} dungeon={dungeon} theme={theme} />

      {/* Main content */}
      {phase === "map" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl bg-gradient-to-b ${theme.bgGradient} p-4`}
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl bg-gradient-to-b ${theme.bgGradient} p-4`}
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl bg-gradient-to-b ${theme.bgGradient} p-4`}
        >
          <BattleResult
            battle={battleResult}
            theme={theme}
            onContinue={handleBackToMap}
            onRetry={handleRetry}
          />
        </motion.div>
      )}

      {/* Room info panel */}
      {phase === "map" && activeRoom && activeRoom.type !== "quiz" && activeRoom.type !== "boss" && activeRoom.type !== "start" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 text-sm"
          style={{ backgroundColor: theme.tileColor, color: theme.textColor, border: `1px solid ${theme.tileBorder}` }}
        >
          <p className="font-bold mb-1">{activeRoom.label}</p>
          <p className="text-xs opacity-70">
            {activeRoom.type === "study" && "学習モジュールを読んで知識を深めよう"}
            {activeRoom.type === "lab" && "ハンズオンラボで実践しよう"}
            {activeRoom.type === "demo" && "インタラクティブデモを体験しよう"}
            {activeRoom.type === "treasure" && "コンセプトカードを獲得！"}
          </p>
          {activeRoom.xpReward > 0 && (
            <p className="text-xs mt-1" style={{ color: theme.accentColor }}>
              +{activeRoom.xpReward} XP
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
