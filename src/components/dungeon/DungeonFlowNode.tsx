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
  start: "START", study: "STUDY", quiz: "BATTLE", lab: "LAB",
  demo: "DEMO", treasure: "TREASURE", boss: "BOSS",
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

/** Room type → shape style mapping */
const ROOM_SHAPES: Record<string, {
  width: number
  height: number
  borderRadius: string
  clipPath?: string
}> = {
  start:    { width: 64,  height: 64,  borderRadius: "50%" },
  study:    { width: 180, height: 56,  borderRadius: "14px" },
  quiz:     { width: 72,  height: 72,  borderRadius: "50%", clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" },
  treasure: { width: 56,  height: 56,  borderRadius: "12px" },
  boss:     { width: 88,  height: 88,  borderRadius: "50%", clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
  lab:      { width: 160, height: 52,  borderRadius: "14px" },
  demo:     { width: 160, height: 52,  borderRadius: "14px" },
}

const HANDLE_STYLE = "!bg-transparent !border-0 !w-0 !h-0"

export const DungeonFlowNode = memo(function DungeonFlowNode({
  data,
}: {
  data: DungeonNodeData
}) {
  const { label, roomType, status, isPlayerHere, accentColor, xpReward, onClick } = data
  const Icon = ROOM_ICONS[roomType] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"
  const shape = ROOM_SHAPES[roomType] ?? ROOM_SHAPES.study
  const isCompact = roomType === "start" || roomType === "quiz" || roomType === "treasure" || roomType === "boss"

  return (
    <>
      <Handle type="target" position={Position.Top} className={HANDLE_STYLE} />

      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`
          group relative flex items-center justify-center transition-all duration-300
          ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}
        `}
        style={{
          width: shape.width,
          height: shape.height,
          borderRadius: shape.clipPath ? undefined : shape.borderRadius,
          clipPath: shape.clipPath,
          background: isLocked
            ? "var(--muted)"
            : isCleared
              ? `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`
              : isPlayerHere
                ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                : "var(--card)",
          border: shape.clipPath
            ? "none"
            : `2px solid ${isPlayerHere ? accentColor : isCleared ? accentColor + "40" : isLocked ? "var(--border)" : "var(--border)"}`,
          opacity: isLocked ? 0.3 : 1,
          boxShadow: isPlayerHere
            ? `0 0 24px ${accentColor}30, 0 0 0 3px var(--background), 0 0 0 5px ${accentColor}40`
            : isCleared
              ? `0 2px 8px ${accentColor}10`
              : "0 2px 8px rgba(0,0,0,0.06)",
          color: isPlayerHere ? "#fff" : isLocked ? "var(--muted-foreground)" : "var(--foreground)",
        } as React.CSSProperties}
      >
        {/* Compact nodes: icon-centric (start, quiz, treasure, boss) */}
        {isCompact ? (
          <div className="flex flex-col items-center gap-0.5">
            {isLocked ? (
              <Lock size={roomType === "boss" ? 28 : 20} className="text-muted-foreground" />
            ) : (
              <Icon
                size={roomType === "boss" ? 32 : roomType === "quiz" ? 24 : 20}
                style={{ color: isPlayerHere ? "#fff" : isCleared ? accentColor : accentColor }}
              />
            )}
            {roomType === "boss" && !isLocked && (
              <span
                className="text-[10px] font-black tracking-widest mt-0.5"
                style={{ color: isPlayerHere ? "#fff" : accentColor }}
              >
                BOSS
              </span>
            )}
          </div>
        ) : (
          /* Card nodes: study, lab, demo (horizontal card layout) */
          <div className="flex items-center gap-3 px-3 w-full">
            <div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: isLocked ? "var(--border)" : isPlayerHere ? "rgba(255,255,255,0.2)" : accentColor + "15",
              }}
            >
              {isLocked ? (
                <Lock size={14} className="text-muted-foreground" />
              ) : (
                <Icon size={14} style={{ color: isPlayerHere ? "#fff" : accentColor }} />
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p
                className="text-[9px] font-bold tracking-wider uppercase"
                style={{ color: isPlayerHere ? "rgba(255,255,255,0.7)" : isLocked ? "var(--muted-foreground)" : accentColor }}
              >
                {ROOM_TYPE_LABEL[roomType] ?? roomType}
              </p>
              <p
                className="text-xs font-semibold leading-tight truncate"
                style={{ color: isPlayerHere ? "#fff" : isLocked ? "var(--muted-foreground)" : "var(--foreground)" }}
              >
                {label}
              </p>
            </div>
            {!isLocked && !isCleared && xpReward > 0 && (
              <span
                className="text-[9px] font-medium shrink-0 px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: isPlayerHere ? "rgba(255,255,255,0.2)" : accentColor + "12",
                  color: isPlayerHere ? "#fff" : accentColor,
                }}
              >
                +{xpReward}
              </span>
            )}
          </div>
        )}

        {/* Player pulse ring (compact nodes) */}
        {isPlayerHere && isCompact && (
          <div
            className="absolute inset-0 animate-ping rounded-full"
            style={{
              border: `2px solid ${accentColor}`,
              opacity: 0.3,
              borderRadius: shape.clipPath ? undefined : shape.borderRadius,
              clipPath: shape.clipPath,
            }}
          />
        )}

        {/* Cleared check badge */}
        {isCleared && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Check size={12} color="#fff" strokeWidth={3} />
          </div>
        )}
      </button>

      <Handle type="source" position={Position.Bottom} className={HANDLE_STYLE} />
    </>
  )
})
