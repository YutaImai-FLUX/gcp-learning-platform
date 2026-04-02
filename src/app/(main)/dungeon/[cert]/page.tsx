"use client"

import { useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookOpen, FlaskConical, PlayCircle, Gift, Map, Flame, Sparkles } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"
import type { BattleState, DungeonDifficulty } from "@/lib/types/dungeon"
import { getDungeonMap, DIFFICULTY_CONFIGS, BOSS_NAMES } from "@/lib/game/dungeon-config"
import { suggestDifficulty } from "@/lib/game/adaptive-difficulty"
import { DUNGEON_THEMES } from "@/lib/game/dungeon-themes"
import { QUIZ_QUESTIONS, shuffleOptions } from "@/lib/data/quiz-questions"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonMapView } from "@/components/dungeon/DungeonMap"
import { DungeonHUD } from "@/components/dungeon/DungeonHUD"
import { BattleScreen } from "@/components/dungeon/BattleScreen"
import { BattleResult } from "@/components/dungeon/BattleResult"
import { WeakDomainAlert } from "@/components/learn/WeakDomainAlert"

type Phase = "map" | "battle" | "result"

const DIFFICULTY_OPTIONS: { key: DungeonDifficulty; color: string; icon: string }[] = [
  { key: "normal", color: "#4CAF50", icon: "⚔️" },
  { key: "hard", color: "#FF9800", icon: "🔥" },
  { key: "expert", color: "#F44336", icon: "💀" },
]

// Map adaptive difficulty ("easy"|"medium"|"hard") to dungeon difficulty
const ADAPTIVE_TO_DUNGEON: Record<string, DungeonDifficulty> = {
  easy: "normal",
  medium: "hard",
  hard: "expert",
}

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

  const quizHistory = useGameStore((s) => s.quizHistory)
  const suggestedLevel = useMemo(() => {
    const certHistory = quizHistory.filter((h) => h.certId === certId)
    if (certHistory.length < 5) return null
    const suggested = suggestDifficulty(certHistory)
    return ADAPTIVE_TO_DUNGEON[suggested] ?? "normal"
  }, [quizHistory, certId])

  const [phase, setPhase] = useState<Phase>("map")
  const [difficulty, setDifficulty] = useState<DungeonDifficulty>("normal")
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [battleResult, setBattleResult] = useState<BattleState | null>(null)

  const activeRoom = activeRoomId ? dungeon.rooms.find((r) => r.id === activeRoomId) : null

  const battleQuestions = useMemo(() => {
    if (!activeRoom || (activeRoom.type !== "quiz" && activeRoom.type !== "boss")) return []

    let filtered = QUIZ_QUESTIONS.filter((q) => q.certId === certId)

    if (activeRoom.type === "quiz" && activeRoom.quizDomain && activeRoom.quizDomain !== "all") {
      filtered = filtered.filter((q) => q.domain === activeRoom.quizDomain)
    }

    const baseCount = activeRoom.quizCount ?? 5
    const count = Math.round(baseCount * difficultyConfig.quizCountMultiplier)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    const selected = shuffleOptions(shuffled.slice(0, count))
    return selected.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      domain: q.domain,
    }))
  }, [activeRoom, certId, difficultyConfig.quizCountMultiplier])

  const handleRoomSelect = useCallback((roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return

    setActiveRoomId(roomId)

    if (room.type === "quiz" || room.type === "boss") {
      setPhase("battle")
    } else if (room.type === "start") {
      // Start rooms auto-clear via NPC dialog
    } else {
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
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg shrink-0">{theme.icon}</span>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate">
              {dungeon.name}
            </h1>
            <p className="text-[10px] text-muted-foreground truncate">
              {theme.name}
            </p>
          </div>
        </div>

        {phase !== "map" && (
          <button
            onClick={handleBackToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted transition-colors"
          >
            <Map size={14} />
            マップ
          </button>
        )}
      </motion.div>

      {/* Difficulty selector */}
      {phase === "map" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Flame size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">難易度:</span>
          {DIFFICULTY_OPTIONS.map((opt) => {
            const cfg = DIFFICULTY_CONFIGS[opt.key]
            const isActive = difficulty === opt.key
            const isSuggested = suggestedLevel === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setDifficulty(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? "text-white border-transparent"
                    : "bg-background text-muted-foreground border-border hover:border-current"
                }`}
                style={isActive ? { backgroundColor: opt.color, borderColor: opt.color } : undefined}
                title={cfg.description}
              >
                <span>{opt.icon}</span>
                {cfg.label}
                {isSuggested && !isActive && (
                  <Sparkles size={10} className="text-amber-500" />
                )}
              </button>
            )
          })}
          {suggestedLevel && suggestedLevel !== difficulty && (
            <button
              onClick={() => setDifficulty(suggestedLevel)}
              className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Sparkles size={10} />
              推奨: {DIFFICULTY_CONFIGS[suggestedLevel].label}
            </button>
          )}
        </motion.div>
      )}

      {/* Weak domain alert */}
      {phase === "map" && <WeakDomainAlert certId={certId} />}

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
          >
            <BattleScreen
              certId={certId}
              roomLabel={activeRoom.label}
              questions={battleQuestions}
              theme={theme}
              isBoss={activeRoom.type === "boss"}
              enemyName={activeRoom.type === "boss" ? BOSS_NAMES[certId] : "モンスター"}
              difficulty={difficultyConfig}
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
          className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3"
        >
          {(() => {
            const info = ROOM_TYPE_INFO[activeRoom.type]
            const RoomIcon = info?.icon ?? BookOpen
            return (
              <>
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: theme.accentMuted }}
                >
                  <RoomIcon size={16} style={{ color: theme.accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activeRoom.label}</p>
                  <p className="text-xs text-muted-foreground">{info?.description}</p>
                </div>
                {activeRoom.xpReward > 0 && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-md shrink-0"
                    style={{ backgroundColor: theme.accentMuted, color: theme.accentColor }}
                  >
                    +{activeRoom.xpReward} XP
                  </span>
                )}
              </>
            )
          })()}
        </motion.div>
      )}
    </div>
  )
}
