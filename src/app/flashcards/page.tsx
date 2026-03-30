"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layers, ArrowRight } from "lucide-react"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { FLASH_CARDS } from "@/lib/data/flashcards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FlashCardsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Layers size={24} className="text-gcp-blue" />
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
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href={`/flashcards/${cert.id}`}>
                <Card className="border-border hover:border-gcp-blue/40 hover:shadow-sm transition-all cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: cert.color }}
                        >
                          {cert.shortName.slice(0, 2)}
                        </div>
                        {cert.shortName}
                      </span>
                      <ArrowRight size={14} className="text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{cert.name}</p>
                    <p className="text-xs text-gcp-blue mt-1 font-medium">{cardCount} カード</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
