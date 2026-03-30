"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Layers, RotateCcw, Trophy } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"
import { getFlashCardsByCert } from "@/lib/data/flashcards"
import { getCertById } from "@/lib/data/certifications"
import { FlashCardComponent } from "@/components/flashcards/FlashCard"
import { useGameStore } from "@/lib/stores/useGameStore"

export default function FlashCardSessionPage() {
  const { cert: certId } = useParams<{ cert: string }>()
  const cert = getCertById(certId)
  const allCards = useMemo(() => getFlashCardsByCert(certId as CertificationId), [certId])

  const [deck, setDeck] = useState(() => [...allCards].sort(() => Math.random() - 0.5))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [known, setKnown] = useState(0)
  const [review, setReview] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = deck[currentIdx]

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setKnown((prev) => prev + 1)
    } else {
      setReview((prev) => prev + 1)
    }

    if (currentIdx + 1 >= deck.length) {
      setIsComplete(true)
      // Award XP for completing flashcard deck
      useGameStore.getState().addXP(15, "flashcards")
    } else {
      setCurrentIdx((prev) => prev + 1)
    }
  }

  const handleRestart = () => {
    setDeck([...allCards].sort(() => Math.random() - 0.5))
    setCurrentIdx(0)
    setKnown(0)
    setReview(0)
    setIsComplete(false)
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
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Layers size={18} style={{ color: cert.color }} />
            {cert.shortName} フラッシュカード
          </h1>
          <p className="text-xs text-muted-foreground">{allCards.length} カード</p>
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
          <p className="text-xs text-gcp-blue font-medium">+15 XP 獲得！</p>
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
