"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRecommendedCerts } from "@/lib/game/xp-config"

interface LevelUpModalProps {
  level: number
  show: boolean
  onClose: () => void
}

export function LevelUpModal({ level, show, onClose }: LevelUpModalProps) {
  const recommendation = getRecommendedCerts(level)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm rounded-2xl bg-gradient-to-br from-gcp-blue via-blue-600 to-indigo-700 p-8 text-center text-white shadow-2xl"
          >
            {/* Decorative stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                transition={{ delay: 0.2 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              >
                <Star size={12 + Math.random() * 8} className="text-yellow-300" fill="currentColor" />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-yellow-300/50">
                <span className="text-3xl font-bold">{level}</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-2 text-2xl font-bold"
            >
              レベルアップ！
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-1 text-sm text-white/80"
            >
              レベル {level} に到達しました
            </motion.p>

            {recommendation.labelJa && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mb-6 text-xs text-yellow-200"
              >
                {recommendation.labelJa}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={onClose}
                className="bg-white text-gcp-blue hover:bg-white/90 font-bold"
              >
                続ける <ArrowRight size={14} className="ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
