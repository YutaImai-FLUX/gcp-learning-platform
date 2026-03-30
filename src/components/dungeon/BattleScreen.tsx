"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { BattleState } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import type { CertificationId } from "@/lib/types/quiz"
import { Swords, Zap, Crown, Shield, Sparkles } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  domain: string
}

interface BattleScreenProps {
  certId: CertificationId
  roomLabel: string
  questions: QuizQuestion[]
  theme: ThemeConfig
  isBoss: boolean
  onComplete: (result: BattleState) => void
}

const MAX_PLAYER_HP = 100
const MAX_ENEMY_HP = 100
const DAMAGE_PER_CORRECT = 25
const DAMAGE_PER_WRONG = 20

export function BattleScreen({ roomLabel, questions, theme, isBoss, onComplete }: BattleScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playerHP, setPlayerHP] = useState(MAX_PLAYER_HP)
  const [enemyHP, setEnemyHP] = useState(isBoss ? 150 : MAX_ENEMY_HP)
  const maxEnemyHP = isBoss ? 150 : MAX_ENEMY_HP
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [shakeEnemy, setShakeEnemy] = useState(false)
  const [shakePlayer, setShakePlayer] = useState(false)
  const [showDamage, setShowDamage] = useState<{ type: "correct" | "wrong"; value: number } | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  const currentQuestion = questions[currentIndex]

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selectedOption !== null) return

    setSelectedOption(optionIndex)
    const isCorrect = optionIndex === currentQuestion.correctIndex
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex

    if (isCorrect) {
      const newEnemyHP = Math.max(0, enemyHP - DAMAGE_PER_CORRECT)
      setEnemyHP(newEnemyHP)
      setShakeEnemy(true)
      setShowDamage({ type: "correct", value: DAMAGE_PER_CORRECT })
      setXpEarned((prev) => prev + (isBoss ? 15 : 10))
      setTimeout(() => setShakeEnemy(false), 400)
    } else {
      const newPlayerHP = Math.max(0, playerHP - DAMAGE_PER_WRONG)
      setPlayerHP(newPlayerHP)
      setShakePlayer(true)
      setShowDamage({ type: "wrong", value: DAMAGE_PER_WRONG })
      setTimeout(() => setShakePlayer(false), 400)
    }

    setTimeout(() => setShowDamage(null), 800)
    setAnswers(newAnswers)

    // Delay before next question or end
    setTimeout(() => {
      const nextIndex = currentIndex + 1
      const isVictory = isCorrect && enemyHP - DAMAGE_PER_CORRECT <= 0
      const isDefeat = !isCorrect && playerHP - DAMAGE_PER_WRONG <= 0
      const isLastQuestion = nextIndex >= questions.length

      if (isVictory || isDefeat || isLastQuestion) {
        const result: BattleState = {
          active: false,
          roomId: "",
          questionIds: questions.map((q) => q.id),
          currentIndex: nextIndex,
          playerHP: isCorrect ? playerHP : Math.max(0, playerHP - DAMAGE_PER_WRONG),
          enemyHP: isCorrect ? Math.max(0, enemyHP - DAMAGE_PER_CORRECT) : enemyHP,
          maxPlayerHP: MAX_PLAYER_HP,
          maxEnemyHP: maxEnemyHP,
          answers: newAnswers,
          result: isDefeat ? "defeat" : "victory",
          xpEarned: xpEarned + (isCorrect ? (isBoss ? 15 : 10) : 0),
        }
        setShowResult(true)
        setTimeout(() => onComplete(result), 1500)
      } else {
        setCurrentIndex(nextIndex)
        setSelectedOption(null)
      }
    }, 1200)
  }, [selectedOption, currentQuestion, currentIndex, answers, enemyHP, playerHP, questions, isBoss, xpEarned, maxEnemyHP, onComplete])

  if (!currentQuestion) return null

  const playerHPPct = (playerHP / MAX_PLAYER_HP) * 100
  const enemyHPPct = (enemyHP / maxEnemyHP) * 100

  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ border: `2px solid ${theme.accentColor}` }}
    >
      {/* Battle header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ backgroundColor: theme.accentColor + "20" }}
      >
        <div className="flex items-center gap-2">
          {isBoss ? (
            <Crown size={18} style={{ color: theme.accentColor }} />
          ) : (
            <Swords size={18} style={{ color: theme.accentColor }} />
          )}
          <span className="text-sm font-bold" style={{ color: theme.textColor }}>
            {isBoss ? "ボス戦" : "バトル"}: {roomLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.accentColor + "30", color: theme.textColor }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5" style={{ backgroundColor: theme.tileColor }}>
        {/* HP Bars - Pokemon style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Player */}
          <motion.div
            className="rounded-lg p-3"
            style={{ backgroundColor: theme.tileBorder + "40" }}
            animate={shakePlayer ? { x: [-6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield size={12} className="text-blue-400" />
                </div>
                <span className="text-xs font-bold" style={{ color: theme.textColor }}>あなた</span>
              </div>
              <span className="text-xs font-mono" style={{ color: theme.textColor + "80" }}>
                {playerHP}/{MAX_PLAYER_HP}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: playerHPPct > 50
                    ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                    : playerHPPct > 25
                      ? "linear-gradient(90deg, #ff9800, #ffc107)"
                      : "linear-gradient(90deg, #ef5350, #f44336)",
                }}
                animate={{ width: `${playerHPPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Damage popup */}
            <AnimatePresence>
              {showDamage?.type === "wrong" && (
                <motion.span
                  className="block text-center text-red-400 font-bold text-sm mt-1"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -4 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  -{showDamage.value} HP
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enemy */}
          <motion.div
            className="rounded-lg p-3"
            style={{ backgroundColor: theme.tileBorder + "40" }}
            animate={shakeEnemy ? { x: [-6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentColor + "30" }}>
                  {isBoss ? <Crown size={12} style={{ color: theme.accentColor }} /> : <Zap size={12} style={{ color: theme.accentColor }} />}
                </div>
                <span className="text-xs font-bold" style={{ color: theme.textColor }}>
                  {isBoss ? "ボス" : "モンスター"}
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: theme.textColor + "80" }}>
                {enemyHP}/{maxEnemyHP}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.accentColor}cc)` }}
                animate={{ width: `${enemyHPPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Damage popup */}
            <AnimatePresence>
              {showDamage?.type === "correct" && (
                <motion.span
                  className="block text-center font-bold text-sm mt-1"
                  style={{ color: theme.accentColor }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -4 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  -{showDamage.value} HP
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Domain tag */}
            <div className="mb-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: theme.accentColor + "20", color: theme.accentColor }}
              >
                {currentQuestion.domain}
              </span>
            </div>

            <p className="text-sm font-medium mb-4 leading-relaxed" style={{ color: theme.textColor }}>
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="grid gap-2">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrect = i === currentQuestion.correctIndex
                const showFeedback = selectedOption !== null

                let optionBg = theme.tileBorder
                let optionBorder = "transparent"
                if (showFeedback) {
                  if (isCorrect) {
                    optionBg = "#2e7d3240"
                    optionBorder = "#4caf50"
                  } else if (isSelected && !isCorrect) {
                    optionBg = "#c6282840"
                    optionBorder = "#ef5350"
                  }
                }

                return (
                  <motion.button
                    key={i}
                    className="text-left p-3 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: optionBg,
                      color: theme.textColor,
                      border: `1.5px solid ${optionBorder}`,
                    }}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedOption !== null}
                    whileHover={selectedOption === null ? { scale: 1.01, x: 4 } : {}}
                    whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="w-5 h-5 rounded shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={{
                          backgroundColor: showFeedback && isCorrect ? "#4caf50" : showFeedback && isSelected ? "#ef5350" : theme.accentColor + "30",
                          color: showFeedback && (isCorrect || isSelected) ? "#fff" : theme.accentColor,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation after answering */}
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg text-xs flex items-start gap-2"
                style={{ backgroundColor: theme.tileBorder + "60", color: theme.textColor + "cc" }}
              >
                <Sparkles size={14} className="shrink-0 mt-0.5" style={{ color: theme.accentColor }} />
                <span className="leading-relaxed">{currentQuestion.explanation}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Victory / Defeat flash */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backgroundColor: enemyHP <= 0 ? "rgba(46,125,50,0.92)" : "rgba(198,40,40,0.92)",
            }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-3xl mb-2">
                {enemyHP <= 0 ? "⚔️" : "💀"}
              </div>
              <span className="text-2xl font-bold text-white">
                {enemyHP <= 0 ? "勝利！" : "敗北..."}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
