"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sword, Lock, CheckCircle2, ArrowRight, GitBranch } from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DUNGEON_MAPS } from "@/lib/game/dungeon-config"
import { DUNGEON_THEMES } from "@/lib/game/dungeon-themes"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import type { CertificationId } from "@/lib/types/quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillTree } from "@/components/game/SkillTree"

const CERT_ORDER: CertificationId[] = ["cdl", "ace", "pca", "pde", "pmle", "pcne", "pcse", "pcd"]

export default function DungeonSelectPage() {
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sword size={28} className="text-yellow-400" />
          <h1 className="text-2xl font-bold">ダンジョン冒険</h1>
        </div>
        <p className="text-white/70 text-sm mb-2">
          各資格がダンジョンに変身！部屋を攻略してクイズバトルに勝ち、ボスを倒して資格マスターを目指そう。
        </p>
        <p className="text-white/50 text-xs">
          現在レベル: <span className="text-yellow-400 font-bold">{level}</span>
        </p>
      </motion.div>

      {/* Dungeon grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERT_ORDER.map((certId, idx) => {
          const dungeon = DUNGEON_MAPS[certId]
          const theme = DUNGEON_THEMES[dungeon.theme]
          const cert = CERTIFICATIONS.find((c) => c.id === certId)
          if (!cert) return null

          const clearedRooms = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
          const totalRooms = dungeon.rooms.length
          const progressPct = Math.round((clearedRooms / totalRooms) * 100)
          const isComplete = clearedRooms === totalRooms

          // Unlock: CDL always unlocked, others need previous dungeon boss cleared
          const prevCertId = idx > 0 ? CERT_ORDER[idx - 1] : null
          const prevBossId = prevCertId ? `${prevCertId}-boss` : null
          const isUnlocked = idx === 0 || (prevBossId ? dungeonProgress[prevBossId]?.cleared : false)

          return (
            <motion.div
              key={certId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {isUnlocked ? (
                <Link
                  href={`/dungeon/${certId}`}
                  className="block rounded-xl p-5 transition-all hover:scale-[1.01] hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.tileColor}, ${theme.tileBorder})`,
                    border: `2px solid ${isComplete ? theme.accentColor : theme.tileBorder}`,
                  }}
                >
                  <DungeonCard
                    cert={cert}
                    dungeon={dungeon}
                    theme={theme}
                    clearedRooms={clearedRooms}
                    totalRooms={totalRooms}
                    progressPct={progressPct}
                    isComplete={isComplete}
                  />
                </Link>
              ) : (
                <div
                  className="block rounded-xl p-5 opacity-50 cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, #333, #444)`,
                    border: `2px solid #555`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={20} className="text-gray-400" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-300">{dungeon.name}</h3>
                      <p className="text-xs text-gray-500">{cert.shortName} — {cert.level}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    前のダンジョンのボスを倒すとアンロック
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Skill Tree */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GitBranch size={14} className="text-gcp-blue" />
            資格スキルツリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillTree />
        </CardContent>
      </Card>
    </div>
  )
}

function DungeonCard({
  cert,
  dungeon,
  theme,
  clearedRooms,
  totalRooms,
  progressPct,
  isComplete,
}: {
  cert: { shortName: string; level: string; description: string }
  dungeon: { name: string }
  theme: { accentColor: string; textColor: string; tileBorder: string; nameJa: string }
  clearedRooms: number
  totalRooms: number
  progressPct: number
  isComplete: boolean
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>
            {dungeon.name}
          </h3>
          <p className="text-xs" style={{ color: theme.textColor + "80" }}>
            {cert.shortName} — {cert.level}
          </p>
        </div>
        {isComplete ? (
          <CheckCircle2 size={20} style={{ color: theme.accentColor }} />
        ) : (
          <ArrowRight size={18} style={{ color: theme.textColor + "60" }} />
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: theme.accentColor }}
          />
        </div>
        <span className="text-[10px] shrink-0" style={{ color: theme.textColor + "80" }}>
          {clearedRooms}/{totalRooms}
        </span>
      </div>
    </>
  )
}
