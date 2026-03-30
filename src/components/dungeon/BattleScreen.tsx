"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { BattleState } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import type { CertificationId } from "@/lib/types/quiz"
import { Swords, Heart, Zap } from "lucide-react"

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
      setXpEarned((prev) => prev + (isBoss ? 15 : 10))
      setTimeout(() => setShakeEnemy(false), 400)
    } else {
      const newPlayerHP = Math.max(0, playerHP - DAMAGE_PER_WRONG)
      setPlayerHP(newPlayerHP)
      setShakePlayer(true)
      setTimeout(() => setShakePlayer(false), 400)
    }

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
      className="rounded-xl p-6 space-y-6"
      style={{ backgroundColor: theme.tileColor, border: `2px solid ${theme.accentColor}` }}
    >
      {/* Battle header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={18} style={{ color: theme.accentColor }} />
          <span className="text-sm font-bold" style={{ color: theme.textColor }}>
            {isBoss ? "⚔ ボス戦" : "バトル"}: {roomLabel}
          </span>
        </div>
        <span className="text-xs" style={{ color: theme.textColor + "99" }}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* HP Bars */}
      <div className="grid grid-cols-2 gap-6">
        {/* Player */}
        <motion.div animate={shakePlayer ? { x: [-4, 4, -4, 0] } : {}} transition={{ duration: 0.3 }}>
          <div className="flex items-center gap-2 mb-1">
            <Heart size={14} className="text-red-400" />
            <span className="text-xs font-bold" style={{ color: theme.textColor }}>あなた</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: playerHPPct > 30 ? "#4caf50" : "#ef5350" }}
              animate={{ width: `${playerHPPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px]" style={{ color: theme.textColor + "80" }}>
            {playerHP}/{MAX_PLAYER_HP}
          </span>
        </motion.div>

        {/* Enemy */}
        <motion.div animate={shakeEnemy ? { x: [-4, 4, -4, 0] } : {}} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: theme.textColor }}>
              {isBoss ? "ボス" : "モンスター"}
            </span>
            <Zap size={14} style={{ color: theme.accentColor }} />
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.accentColor }}
              animate={{ width: `${enemyHPPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-right">
            <span className="text-[10px]" style={{ color: theme.textColor + "80" }}>
              {enemyHP}/{maxEnemyHP}
            </span>
          </div>
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
              if (showFeedback) {
                if (isCorrect) optionBg = "#2e7d32"
                else if (isSelected && !isCorrect) optionBg = "#c62828"
              }

              return (
                <motion.button
                  key={i}
                  className="text-left p-3 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: optionBg,
                    color: theme.textColor,
                    border: `1px solid ${showFeedback && isCorrect ? "#4caf50" : "transparent"}`,
                  }}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                  whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                >
                  <span className="mr-2 font-bold" style={{ color: theme.accentColor }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation after answering */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg text-xs"
              style={{ backgroundColor: theme.tileBorder, color: theme.textColor + "cc" }}
            >
              {currentQuestion.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Victory / Defeat flash */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backgroundColor: enemyHP <= 0 ? "rgba(46,125,50,0.9)" : "rgba(198,40,40,0.9)",
            }}
          >
            <span className="text-2xl font-bold text-white">
              {enemyHP <= 0 ? "⚔ 勝利！" : "💀 敗北..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
