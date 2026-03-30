"use client"

import { motion } from "framer-motion"
import type { DungeonRoom as DungeonRoomType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock, CheckCircle2 } from "lucide-react"

const ROOM_ICONS: Record<string, React.ElementType> = {
  start: LogIn,
  study: BookOpen,
  quiz: Swords,
  lab: FlaskConical,
  demo: PlayCircle,
  treasure: Gift,
  boss: Crown,
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  start: "入口",
  study: "📖 学習",
  quiz: "⚔ バトル",
  lab: "🧪 ラボ",
  demo: "▶ デモ",
  treasure: "🎁 宝箱",
  boss: "👑 ボス戦",
}

interface DungeonRoomCardProps {
  room: DungeonRoomType
  status: RoomStatus
  theme: ThemeConfig
  isPlayerHere: boolean
  onClick: () => void
}

export function DungeonRoomCard({ room, status, theme, isPlayerHere, onClick }: DungeonRoomCardProps) {
  const Icon = ROOM_ICONS[room.type] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"
  const isBoss = room.type === "boss"

  return (
    <motion.button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`
        relative w-full rounded-xl p-3 text-left transition-all
        ${isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${isPlayerHere ? "ring-2 ring-white ring-offset-2 ring-offset-transparent" : ""}
      `}
      style={{
        backgroundColor: isLocked
          ? theme.roomColors.locked
          : isCleared
            ? theme.roomColors.cleared
            : theme.roomColors.available,
        border: `2px solid ${
          isPlayerHere
            ? "#fff"
            : isCleared
              ? theme.accentColor + "60"
              : isLocked
                ? "transparent"
                : theme.accentColor
        }`,
        boxShadow: isPlayerHere
          ? `0 0 16px ${theme.accentColor}60`
          : isBoss && !isLocked
            ? `0 0 12px ${theme.accentColor}40`
            : undefined,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isLocked ? {} : { scale: 1.03, y: -2 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
    >
      {/* Player indicator */}
      {isPlayerHere && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
      )}

      {/* Cleared badge */}
      {isCleared && (
        <div className="absolute -top-1.5 -right-1.5">
          <CheckCircle2 size={18} className="text-white" style={{ filter: `drop-shadow(0 0 2px ${theme.accentColor})` }} fill={theme.accentColor} />
        </div>
      )}

      {/* Top row: type + XP */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: isLocked ? "#ffffff10" : isCleared ? theme.accentColor + "30" : "#ffffff20",
            color: isLocked ? "#888" : isCleared ? theme.accentColor : "#fff",
          }}
        >
          {ROOM_TYPE_LABELS[room.type] ?? room.type}
        </span>
        {!isLocked && room.xpReward > 0 && !isCleared && (
          <span
            className="text-[10px] font-bold"
            style={{ color: theme.accentColor }}
          >
            +{room.xpReward} XP
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="flex justify-center my-2">
        {isLocked ? (
          <Lock size={24} color="#666" />
        ) : (
          <Icon
            size={isBoss ? 28 : 22}
            color={isCleared ? theme.accentColor : "#fff"}
          />
        )}
      </div>

      {/* Label */}
      <p
        className={`text-center font-bold leading-tight ${isBoss ? "text-xs" : "text-[11px]"}`}
        style={{ color: isLocked ? "#666" : isCleared ? theme.textColor : "#fff" }}
      >
        {room.label}
      </p>
    </motion.button>
  )
}
