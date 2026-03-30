"use client"

import { motion } from "framer-motion"
import type { BattleState } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { Trophy, RotateCcw, Star, ArrowRight } from "lucide-react"

interface BattleResultProps {
  battle: BattleState
  theme: ThemeConfig
  onContinue: () => void
  onRetry: () => void
}

export function BattleResult({ battle, theme, onContinue, onRetry }: BattleResultProps) {
  const isVictory = battle.result === "victory"
  const correctCount = battle.answers.filter((a, i) => a === i).length
  const totalCount = battle.questionIds.length

  return (
    <motion.div
      className="rounded-xl p-8 text-center space-y-5"
      style={{ backgroundColor: theme.tileColor, border: `2px solid ${theme.accentColor}`, color: theme.textColor }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {isVictory ? (
          <Trophy size={48} className="mx-auto" style={{ color: theme.accentColor }} />
        ) : (
          <RotateCcw size={48} className="mx-auto text-red-400" />
        )}
      </motion.div>

      {/* Title */}
      <h2 className="text-xl font-bold">
        {isVictory ? "勝利！" : "敗北..."}
      </h2>

      <p className="text-sm opacity-80">
        {isVictory
          ? "見事にモンスターを倒した！次の部屋へ進もう。"
          : "残念...もう一度挑戦してみよう！"}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-3">
        <div>
          <div className="text-lg font-bold">{correctCount}/{totalCount}</div>
          <div className="text-[10px] opacity-60">正答数</div>
        </div>
        <div>
          <div className="text-lg font-bold flex items-center justify-center gap-1">
            <Star size={14} style={{ color: theme.accentColor }} />
            {battle.xpEarned}
          </div>
          <div className="text-[10px] opacity-60">獲得XP</div>
        </div>
        <div>
          <div className="text-lg font-bold">{battle.playerHP}/{battle.maxPlayerHP}</div>
          <div className="text-[10px] opacity-60">残りHP</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        {isVictory ? (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: theme.accentColor }}
          >
            マップに戻る <ArrowRight size={14} />
          </button>
        ) : (
          <>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
              style={{ backgroundColor: theme.accentColor, color: "#fff" }}
            >
              <RotateCcw size={14} /> 再挑戦
            </button>
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: theme.tileBorder, color: theme.textColor }}
            >
              マップに戻る
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
