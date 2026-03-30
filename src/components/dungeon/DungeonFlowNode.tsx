"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import type { RoomStatus } from "@/lib/types/dungeon"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock, Check } from "lucide-react"

const ROOM_ICONS: Record<string, React.ElementType> = {
  start: LogIn, study: BookOpen, quiz: Swords, lab: FlaskConical,
  demo: PlayCircle, treasure: Gift, boss: Crown,
}

interface DungeonNodeData {
  label: string
  roomType: string
  status: RoomStatus
  isPlayerHere: boolean
  accentColor: string
  xpReward: number
  onClick: () => void
}

/** Custom React Flow node for dungeon rooms — horizontal (LTR) layout */
export const DungeonFlowNode = memo(function DungeonFlowNode({
  data,
}: {
  data: DungeonNodeData
}) {
  const { label, roomType, status, isPlayerHere, accentColor, xpReward, onClick } = data
  const Icon = ROOM_ICONS[roomType] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"
  const isBoss = roomType === "boss"

  return (
    <>
      {/* Left handle (incoming) */}
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />

      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`
          group relative flex items-center gap-3 transition-all duration-200
          ${isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}
          ${isBoss ? "px-5 py-3.5" : "px-4 py-3"}
          rounded-xl border
          ${isPlayerHere
            ? "border-current shadow-lg ring-2 ring-current/20"
            : isCleared
              ? "border-border bg-card"
              : "border-border bg-card hover:border-current hover:shadow-md"
          }
        `}
        style={{
          color: accentColor,
          boxShadow: isPlayerHere ? `0 0 20px ${accentColor}20` : undefined,
          minWidth: isBoss ? 160 : 140,
        }}
      >
        {/* Player indicator */}
        {isPlayerHere && (
          <span
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {/* Cleared check badge */}
        {isCleared && (
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <Check size={12} color="#fff" strokeWidth={3} />
          </span>
        )}

        {/* Icon */}
        <div
          className={`shrink-0 flex items-center justify-center rounded-lg ${isBoss ? "w-10 h-10" : "w-8 h-8"}`}
          style={{
            backgroundColor: isLocked ? "var(--muted)" : accentColor + "15",
          }}
        >
          {isLocked ? (
            <Lock size={isBoss ? 18 : 16} className="text-muted-foreground" />
          ) : (
            <Icon size={isBoss ? 18 : 16} style={{ color: accentColor }} />
          )}
        </div>

        {/* Label */}
        <div className="min-w-0 text-left">
          <p
            className={`font-semibold leading-tight ${isBoss ? "text-sm" : "text-xs"}`}
            style={{ color: isLocked ? "var(--muted-foreground)" : isCleared ? "var(--muted-foreground)" : "var(--foreground)" }}
          >
            {label}
          </p>
          {!isLocked && !isCleared && xpReward > 0 && (
            <p className="text-[10px] text-muted-foreground mt-0.5">+{xpReward} XP</p>
          )}
          {isBoss && !isLocked && (
            <p className="text-[10px] font-medium mt-0.5" style={{ color: accentColor }}>BOSS</p>
          )}
        </div>
      </button>

      {/* Right handle (outgoing) */}
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  )
})
