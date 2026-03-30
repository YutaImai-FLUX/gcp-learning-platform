"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sword, Lock, CheckCircle2, ArrowRight, GitBranch,
  TreePine, Cpu, Castle, Flame, Snowflake, Waves, ShieldAlert, Cloud,
} from "lucide-react"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DUNGEON_MAPS } from "@/lib/game/dungeon-config"
import { DUNGEON_THEMES } from "@/lib/game/dungeon-themes"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import type { CertificationId } from "@/lib/types/quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillTree } from "@/components/game/SkillTree"

const CERT_ORDER: CertificationId[] = ["cdl", "ace", "pca", "pde", "pmle", "pcne", "pcse", "pcd"]

const THEME_ICONS: Record<string, React.ElementType> = {
  forest: TreePine,
  tech: Cpu,
  castle: Castle,
  volcano: Flame,
  ice: Snowflake,
  ocean: Waves,
  cave: ShieldAlert,
  sky: Cloud,
  cyber: Cpu,
}

export default function DungeonSelectPage() {
  const level = useGameStore((s) => s.level)
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
            <Sword size={22} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">ダンジョン冒険</h1>
            <p className="text-white/50 text-xs mt-0.5">
              現在レベル: <span className="text-yellow-400 font-bold">{level}</span>
            </p>
          </div>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          各GCP資格がダンジョンに変身！部屋を攻略してクイズバトルに挑み、ボスを倒して資格マスターを目指そう。
        </p>
      </motion.div>

      {/* Dungeon grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          const ThemeIcon = THEME_ICONS[dungeon.theme] ?? Sword

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
                  className="group block rounded-xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
                  style={{ border: `2px solid ${isComplete ? theme.accentColor : theme.tileBorder}` }}
                >
                  {/* Top gradient band */}
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.accentColor}60)` }}
                  />

                  <div
                    className="p-4 sm:p-5"
                    style={{ background: `linear-gradient(135deg, ${theme.tileColor}, ${theme.tileBorder})` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {/* Theme icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: theme.accentColor + "25" }}
                      >
                        <ThemeIcon size={20} style={{ color: theme.accentColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>
                            {dungeon.name}
                          </h3>
                          {isComplete ? (
                            <CheckCircle2 size={18} style={{ color: theme.accentColor }} />
                          ) : (
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.textColor + "60" }} />
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: theme.textColor + "80" }}>
                          {cert.shortName} — {cert.level}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: theme.textColor + "60" }}>
                          {theme.nameJa}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.tileBorder }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPct}%`,
                            background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.accentColor}cc)`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] shrink-0 font-medium" style={{ color: theme.textColor + "80" }}>
                        {clearedRooms}/{totalRooms}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="rounded-xl overflow-hidden opacity-50 cursor-not-allowed"
                  style={{ border: `2px solid #555` }}
                >
                  <div className="h-2 bg-gray-700" />
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        <Lock size={18} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-400">{dungeon.name}</h3>
                        <p className="text-xs text-gray-600">{cert.shortName} — {cert.level}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600">
                      前のダンジョンのボスを倒すとアンロック
                    </p>
                  </div>
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
          <p className="text-xs text-muted-foreground">
            資格をクリックしてダンジョンへ。上位資格は前提資格の攻略後にアンロック。
          </p>
        </CardHeader>
        <CardContent>
          <SkillTree />
        </CardContent>
      </Card>
    </div>
  )
}
