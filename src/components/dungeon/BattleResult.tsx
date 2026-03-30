"use client"

import { motion } from "framer-motion"
import type { BattleState } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { Trophy, RotateCcw, Star, ArrowRight, Swords, Heart } from "lucide-react"

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
      className="rounded-lg border border-border overflow-hidden bg-card"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Result banner */}
      <div
        className="py-6 text-center"
        style={{
          background: isVictory
            ? `linear-gradient(135deg, ${theme.accentMuted}, transparent)`
            : "linear-gradient(135deg, rgba(239,83,80,0.1), transparent)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-3"
        >
          {isVictory ? (
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: theme.accentMuted }}>
              <Trophy size={32} style={{ color: theme.accentColor }} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-red-500/10">
              <RotateCcw size={32} className="text-red-400" />
            </div>
          )}
        </motion.div>

        <h2 className="text-xl font-bold">
          {isVictory ? "勝利！" : "敗北..."}
        </h2>
        <p className="text-sm mt-1 text-muted-foreground">
          {isVictory
            ? "見事にモンスターを倒した！次の部屋へ進もう。"
            : "残念...もう一度挑戦してみよう！"}
        </p>
      </div>

      {/* Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Swords size={12} style={{ color: theme.accentColor }} />
            </div>
            <div className="text-lg font-bold">{correctCount}/{totalCount}</div>
            <div className="text-[10px] text-muted-foreground">正答数</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={12} style={{ color: theme.accentColor }} />
            </div>
            <div className="text-lg font-bold" style={{ color: theme.accentColor }}>
              +{battle.xpEarned}
            </div>
            <div className="text-[10px] text-muted-foreground">獲得XP</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart size={12} className="text-red-400" />
            </div>
            <div className="text-lg font-bold">{battle.playerHP}/{battle.maxPlayerHP}</div>
            <div className="text-[10px] text-muted-foreground">残りHP</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-5 flex gap-3 justify-center">
        {isVictory ? (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: theme.accentColor }}
          >
            マップに戻る <ArrowRight size={14} />
          </button>
        ) : (
          <>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: theme.accentColor }}
            >
              <RotateCcw size={14} /> 再挑戦
            </button>
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              マップに戻る
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
