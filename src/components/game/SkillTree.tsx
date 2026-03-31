"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/stores/useGameStore"
import { CERTIFICATIONS } from "@/lib/data/certifications"
import { DUNGEON_MAPS } from "@/lib/game/dungeon-config"
import { Lock, CheckCircle, ArrowRight } from "lucide-react"
import type { CertificationId } from "@/lib/types/quiz"

/** Roadmap tracks — each row in the table */
const TRACKS: {
  name: string
  certIds: CertificationId[]
}[] = [
  { name: "Cloud基礎", certIds: ["cdl", "ace"] },
  { name: "アーキテクチャ", certIds: ["ace", "pca"] },
  { name: "データ", certIds: ["ace", "pde", "pmle"] },
  { name: "開発", certIds: ["ace", "pcd"] },
  { name: "ネットワーク", certIds: ["ace", "pcne"] },
  { name: "セキュリティ", certIds: ["ace", "pcse"] },
]

type CertStatus = "locked" | "available" | "in_progress" | "complete"

export function SkillTree() {
  const router = useRouter()
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const certProgress = useGameStore((s) => s.certProgress)

  const certStatuses = useMemo(() => {
    const statuses: Record<string, CertStatus> = {}
    const certOrder: CertificationId[] = ["cdl", "ace", "pca", "pde", "pcd", "pcne", "pcse", "pmle"]

    for (const certId of certOrder) {
      const bossId = `${certId}-boss`
      if (dungeonProgress[bossId]?.cleared) {
        statuses[certId] = "complete"
        continue
      }
      if (certProgress[certId] || dungeonProgress[`${certId}-start`]?.cleared) {
        statuses[certId] = "in_progress"
        continue
      }
      // Check prerequisites
      const prereqs: Record<string, string[]> = {
        cdl: [],
        ace: ["cdl"],
        pca: ["ace"],
        pde: ["ace"],
        pcd: ["ace"],
        pcne: ["ace"],
        pcse: ["ace"],
        pmle: ["pde"],
      }
      const allReqsMet = (prereqs[certId] ?? []).every(
        (req) => statuses[req] === "complete" || statuses[req] === "in_progress"
      )
      statuses[certId] = allReqsMet ? "available" : "locked"
    }
    return statuses
  }, [dungeonProgress, certProgress])

  const certProgressPct = useMemo(() => {
    const pcts: Record<string, number> = {}
    const certIds: CertificationId[] = ["cdl", "ace", "pca", "pde", "pcd", "pcne", "pcse", "pmle"]
    for (const certId of certIds) {
      const dungeon = DUNGEON_MAPS[certId]
      if (!dungeon) continue
      const cleared = dungeon.rooms.filter((r) => dungeonProgress[r.id]?.cleared).length
      pcts[certId] = Math.round((cleared / dungeon.rooms.length) * 100)
    }
    return pcts
  }, [dungeonProgress])

  return (
    <div className="space-y-1">
      {/* Header row */}
      <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-0 text-xs font-bold">
        <div className="px-3 py-2.5 bg-foreground text-background rounded-tl-lg">
          トラック
        </div>
        <div className="px-4 py-2.5 bg-foreground text-background rounded-tr-lg">
          資格取得順序
        </div>
      </div>

      {/* Track rows */}
      {TRACKS.map((track, trackIdx) => (
        <motion.div
          key={track.name}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: trackIdx * 0.06, duration: 0.3 }}
          className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-0"
        >
          {/* Track name */}
          <div className="px-3 py-4 bg-muted/60 flex items-center border-b border-border">
            <span className="text-sm sm:text-base font-bold text-foreground">
              {track.name}
            </span>
          </div>

          {/* Cert badges */}
          <div className="px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap border-b border-border">
            {track.certIds.map((certId, certIdx) => {
              const cert = CERTIFICATIONS.find((c) => c.id === certId)
              if (!cert) return null
              const status = certStatuses[certId]
              const pct = certProgressPct[certId] ?? 0
              const isLocked = status === "locked"
              const isComplete = status === "complete"
              const isInProgress = status === "in_progress"

              return (
                <div key={certId} className="flex items-center gap-2 sm:gap-3">
                  {/* Arrow between badges */}
                  {certIdx > 0 && (
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground shrink-0"
                      style={{ opacity: isLocked ? 0.3 : 0.6 }}
                    />
                  )}

                  {/* Cert badge */}
                  <motion.button
                    onClick={!isLocked ? () => router.push(`/dungeon/${certId}`) : undefined}
                    disabled={isLocked}
                    whileHover={!isLocked ? { scale: 1.05 } : undefined}
                    whileTap={!isLocked ? { scale: 0.95 } : undefined}
                    className={`
                      relative flex flex-col items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                      transition-shadow duration-200 shrink-0
                      ${isLocked
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer hover:shadow-lg"
                      }
                    `}
                    style={{
                      background: isComplete
                        ? `linear-gradient(135deg, ${cert.color}, ${cert.color}cc)`
                        : isInProgress
                          ? `linear-gradient(135deg, ${cert.color}15, ${cert.color}08)`
                          : isLocked
                            ? "var(--muted)"
                            : "var(--card)",
                      border: `2px solid ${
                        isComplete ? cert.color
                          : isInProgress ? cert.color
                            : "var(--border)"
                      }`,
                      boxShadow: isInProgress
                        ? `0 0 0 3px var(--background), 0 0 0 5px ${cert.color}30`
                        : undefined,
                      minWidth: 80,
                    }}
                  >
                    {/* Level label */}
                    <span
                      className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase"
                      style={{
                        color: isComplete ? "rgba(255,255,255,0.7)"
                          : isLocked ? "var(--muted-foreground)"
                            : cert.color,
                      }}
                    >
                      {cert.level === "Foundational" ? "FOUNDATIONAL"
                        : cert.level === "Associate" ? "ASSOCIATE"
                          : "PROFESSIONAL"}
                    </span>

                    {/* Cert abbreviation */}
                    <span
                      className="text-sm sm:text-base font-black tracking-wide"
                      style={{
                        color: isComplete ? "#fff"
                          : isInProgress ? cert.color
                            : isLocked ? "var(--muted-foreground)"
                              : "var(--foreground)",
                      }}
                    >
                      {cert.shortName}
                    </span>

                    {/* Full name */}
                    <span
                      className="text-[8px] sm:text-[9px] font-medium leading-tight text-center max-w-[90px] sm:max-w-[100px] truncate"
                      style={{
                        color: isComplete ? "rgba(255,255,255,0.8)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {cert.shortName === cert.name
                        ? cert.level
                        : cert.name.replace("Professional ", "").replace("Associate ", "")}
                    </span>

                    {/* Progress bar (in_progress) */}
                    {isInProgress && pct > 0 && (
                      <div className="w-full mt-0.5">
                        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: cert.color + "25" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: cert.color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Status icons */}
                    {isComplete && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle size={14} style={{ color: cert.color }} />
                      </div>
                    )}
                    {isLocked && (
                      <Lock size={10} className="absolute bottom-1 right-1 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              )
            })}

            {/* "上級" divider for tracks with professional certs */}
            {track.certIds.length > 1 && (() => {
              const firstProIdx = track.certIds.findIndex((id) => {
                const c = CERTIFICATIONS.find((cert) => cert.id === id)
                return c?.level === "Professional"
              })
              if (firstProIdx <= 0) return null
              // Already rendered inline — show level label
              return null
            })()}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
