"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import type { RoomStatus } from "@/lib/types/dungeon"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock, Check } from "lucide-react"

const ROOM_ICONS: Record<string, React.ElementType> = {
  start: LogIn, study: BookOpen, quiz: Swords, lab: FlaskConical,
  demo: PlayCircle, treasure: Gift, boss: Crown,
}

const ROOM_TYPE_LABEL: Record<string, string> = {
  start: "開始", study: "学習", quiz: "バトル", lab: "実習",
  demo: "デモ", treasure: "宝箱", boss: "ボス",
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
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />

      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`
          group relative transition-all duration-200
          ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.03] active:scale-[0.97]"}
          rounded-2xl border-2 overflow-hidden
          ${isPlayerHere
            ? "shadow-xl"
            : isCleared
              ? "bg-card shadow-sm"
              : "bg-card shadow-sm hover:shadow-lg"
          }
        `}
        style={{
          width: isBoss ? 200 : 180,
          borderColor: isPlayerHere ? accentColor : isCleared ? accentColor + "40" : "var(--border)",
          opacity: isLocked ? 0.35 : 1,
          boxShadow: isPlayerHere
            ? `0 0 0 3px var(--background), 0 0 0 5px ${accentColor}40, 0 8px 24px ${accentColor}15`
            : undefined,
        } as React.CSSProperties}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{
            backgroundColor: isLocked ? "var(--muted)" : isCleared ? accentColor + "60" : accentColor,
          }}
        />

        <div className="px-4 py-3 flex items-center gap-3">
          {/* Icon circle */}
          <div
            className={`shrink-0 flex items-center justify-center rounded-xl ${isBoss ? "w-12 h-12" : "w-10 h-10"}`}
            style={{
              backgroundColor: isLocked ? "var(--muted)" : isCleared ? accentColor + "12" : accentColor + "15",
            }}
          >
            {isLocked ? (
              <Lock size={isBoss ? 22 : 18} className="text-muted-foreground" />
            ) : (
              <Icon
                size={isBoss ? 22 : 18}
                style={{ color: accentColor }}
              />
            )}
          </div>

          {/* Text content */}
          <div className="min-w-0 flex-1 text-left">
            {/* Type label */}
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: isLocked ? "var(--muted-foreground)" : accentColor }}
            >
              {ROOM_TYPE_LABEL[roomType] ?? roomType}
            </p>
            {/* Room name */}
            <p
              className={`font-bold leading-tight truncate ${isBoss ? "text-sm" : "text-xs"}`}
              style={{ color: isLocked ? "var(--muted-foreground)" : "var(--foreground)" }}
            >
              {label}
            </p>
            {/* XP reward */}
            {!isLocked && !isCleared && xpReward > 0 && (
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">+{xpReward} XP</p>
            )}
          </div>
        </div>

        {/* Player indicator pulse bar */}
        {isPlayerHere && (
          <div
            className="h-0.5 w-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {/* Cleared badge */}
        {isCleared && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Check size={14} color="#fff" strokeWidth={3} />
          </div>
        )}
      </button>

      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  )
})
