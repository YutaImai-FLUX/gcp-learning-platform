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

/** Custom React Flow node for dungeon rooms */
export const DungeonFlowNode = memo(function DungeonFlowNode({
  data,
}: {
  data: DungeonNodeData
}) {
  const { label, roomType, status, isPlayerHere, accentColor, xpReward, onClick } = data
  const Icon = ROOM_ICONS[roomType] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"

  // Minimal sizing per type
  const isBoss = roomType === "boss"
  const isStudy = roomType === "study"

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />

      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`
          group relative flex items-center gap-2 transition-all duration-200
          ${isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]"}
          ${isBoss ? "px-5 py-3" : isStudy ? "px-3.5 py-2.5" : "px-3 py-2.5"}
          rounded-lg border
          ${isPlayerHere
            ? "border-current shadow-lg"
            : isCleared
              ? "border-border bg-card"
              : "border-border bg-card hover:border-current"
          }
        `}
        style={{
          color: accentColor,
          boxShadow: isPlayerHere ? `0 0 16px ${accentColor}25` : undefined,
        }}
      >
        {/* Player indicator dot */}
        {isPlayerHere && (
          <span
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {/* Cleared check badge */}
        {isCleared && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <Check size={10} color="#fff" strokeWidth={3} />
          </span>
        )}

        {/* Icon */}
        <div
          className={`
            shrink-0 flex items-center justify-center rounded-md
            ${isBoss ? "w-8 h-8" : "w-6 h-6"}
          `}
          style={{
            backgroundColor: isLocked ? "var(--muted)" : isCleared ? accentColor + "15" : accentColor + "15",
          }}
        >
          {isLocked ? (
            <Lock size={isBoss ? 16 : 12} className="text-muted-foreground" />
          ) : (
            <Icon
              size={isBoss ? 16 : 12}
              style={{ color: isCleared ? accentColor : accentColor }}
            />
          )}
        </div>

        {/* Label */}
        <div className="min-w-0 text-left">
          <p
            className={`font-medium leading-tight truncate ${isBoss ? "text-xs" : "text-[11px]"}`}
            style={{ color: isLocked ? "var(--muted-foreground)" : isCleared ? "var(--muted-foreground)" : "var(--foreground)" }}
          >
            {label}
          </p>
          {!isLocked && !isCleared && xpReward > 0 && (
            <p className="text-[9px] text-muted-foreground mt-0.5">+{xpReward} XP</p>
          )}
        </div>
      </button>

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  )
})
