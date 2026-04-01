"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layers, ArrowRight } from "lucide-react"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { FLASH_CARDS } from "@/lib/data/flashcards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
}

export default function FlashCardsPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger.item}>
        <h1 className="font-display heading-display text-2xl md:text-3xl mb-1.5 flex items-center gap-3">
          <Layers size={28} className="text-primary" />
          フラッシュカード
        </h1>
        <p className="text-sm text-muted-foreground">
          スワイプして用語を覚えよう。右 = 知ってる、左 = 復習
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((cert) => {
          const cardCount = FLASH_CARDS.filter((c) => c.certId === cert.id).length
          if (cardCount === 0) return null

          return (
            <motion.div key={cert.id} variants={stagger.item}>
              <Link href={`/flashcards/${cert.id}`}>
                <Card className="border-border hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                  <div className="flex">
                    {/* Color bar */}
                    <div
                      className="w-1.5 shrink-0"
                      style={{ backgroundColor: cert.color }}
                    />
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                              style={{ backgroundColor: cert.color }}
                            >
                              {cert.shortName.slice(0, 2)}
                            </div>
                            <span className="font-display font-bold">{cert.shortName}</span>
                          </span>
                          <ArrowRight size={14} className="text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">{cert.name}</p>
                        <p className="font-display text-sm font-bold mt-1.5" style={{ color: cert.color }}>
                          {cardCount} <span className="text-xs font-normal text-muted-foreground">カード</span>
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
