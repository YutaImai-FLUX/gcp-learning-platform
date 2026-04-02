"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Layers, RotateCcw, Trophy, Clock } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"
import { getFlashCardsByCert } from "@/lib/data/flashcards"
import { getCertById } from "@/lib/data/certifications"
import { FlashCardComponent } from "@/components/flashcards/FlashCard"
import { useGameStore } from "@/lib/stores/useGameStore"
import { sm2Update, createSRCard, isDueForReview } from "@/lib/game/spaced-repetition"
import { todayString } from "@/lib/game/xp-utils"

const BASE_XP = 10
const MAX_XP_BONUS = 20

export default function FlashCardSessionPage() {
  const { cert: certId } = useParams<{ cert: string }>()
  const cert = getCertById(certId)
  const allCards = useMemo(() => getFlashCardsByCert(certId as CertificationId), [certId])
  const srCards = useGameStore((s) => s.srCards)

  // Sort: due cards first, then new cards, then future cards
  const deck = useMemo(() => {
    const today = todayString()
    const sorted = [...allCards].sort((a, b) => {
      const srA = srCards[a.id]
      const srB = srCards[b.id]
      const dueA = srA ? isDueForReview(srA, today) : true // new cards are "due"
      const dueB = srB ? isDueForReview(srB, today) : true
      if (dueA && !dueB) return -1
      if (!dueA && dueB) return 1
      // Among due cards, prioritize lower ease factor (harder cards)
      const easeA = srA?.easeFactor ?? 2.5
      const easeB = srB?.easeFactor ?? 2.5
      return easeA - easeB
    })
    return sorted
  }, [allCards, srCards])

  const dueCount = useMemo(() => {
    const today = todayString()
    return allCards.filter((c) => {
      const sr = srCards[c.id]
      return !sr || isDueForReview(sr, today)
    }).length
  }, [allCards, srCards])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [known, setKnown] = useState(0)
  const [review, setReview] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)

  const currentCard = deck[currentIdx]

  const handleSwipe = (direction: "left" | "right") => {
    const today = todayString()
    const store = useGameStore.getState()
    const cardId = currentCard.id
    const existing = store.srCards[cardId]
    const card = existing ?? createSRCard(cardId, today)

    // SM-2 quality: right (known) = 5, left (review needed) = 1
    const quality = direction === "right" ? 5 : 1
    const updated = sm2Update(card, quality, today)
    store.updateSRCard(updated)

    if (direction === "right") {
      setKnown((prev) => prev + 1)
    } else {
      setReview((prev) => prev + 1)
    }

    if (currentIdx + 1 >= deck.length) {
      // XP scales with accuracy: base + bonus * (known / total)
      const finalKnown = known + (direction === "right" ? 1 : 0)
      const ratio = deck.length > 0 ? finalKnown / deck.length : 0
      const xp = Math.round(BASE_XP + MAX_XP_BONUS * ratio)
      setEarnedXP(xp)
      setIsComplete(true)
      store.addXP(xp, "flashcards")
    } else {
      setCurrentIdx((prev) => prev + 1)
    }
  }

  const handleRestart = () => {
    const today = todayString()
    const currentSrCards = useGameStore.getState().srCards
    // Re-sort with updated SR state
    const reSorted = [...allCards].sort((a, b) => {
      const srA = currentSrCards[a.id]
      const srB = currentSrCards[b.id]
      const dueA = srA ? isDueForReview(srA, today) : true
      const dueB = srB ? isDueForReview(srB, today) : true
      if (dueA && !dueB) return -1
      if (!dueA && dueB) return 1
      return (srA?.easeFactor ?? 2.5) - (srB?.easeFactor ?? 2.5)
    })
    // Only show due cards on restart
    const dueOnly = reSorted.filter((c) => {
      const sr = currentSrCards[c.id]
      return !sr || isDueForReview(sr, today)
    })
    // If no due cards, show all shuffled
    if (dueOnly.length === 0) {
      // No action needed - deck stays as reSorted
    }
    setCurrentIdx(0)
    setKnown(0)
    setReview(0)
    setIsComplete(false)
    setEarnedXP(0)
  }

  if (!cert) {
    return <p className="text-muted-foreground p-8">資格が見つかりません</p>
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/flashcards" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Layers size={18} style={{ color: cert.color }} />
            {cert.shortName} フラッシュカード
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {allCards.length} カード
            {dueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Clock size={11} />
                {dueCount}枚が復習期限
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Progress */}
      {!isComplete && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentIdx + 1} / {deck.length}</span>
            <span className="flex items-center gap-3">
              <span className="text-green-600">✓ {known}</span>
              <span className="text-red-500">✗ {review}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIdx) / deck.length) * 100}%`,
                backgroundColor: cert.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      {!isComplete && currentCard && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <FlashCardComponent card={currentCard} onSwipe={handleSwipe} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-border p-8 text-center space-y-4"
        >
          <Trophy size={40} className="mx-auto" style={{ color: cert.color }} />
          <h2 className="text-lg font-bold">セッション完了！</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
              <div className="text-xl font-bold text-green-600">{known}</div>
              <div className="text-xs text-muted-foreground">知ってる</div>
            </div>
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
              <div className="text-xl font-bold text-red-500">{review}</div>
              <div className="text-xs text-muted-foreground">復習</div>
            </div>
          </div>
          <p className="text-xs text-gcp-blue font-medium">+{earnedXP} XP 獲得！</p>
          <p className="text-[10px] text-muted-foreground">
            間隔反復により次回の復習スケジュールが更新されました
          </p>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: cert.color }}
          >
            <RotateCcw size={14} /> もう一度
          </button>
        </motion.div>
      )}
    </div>
  )
}
