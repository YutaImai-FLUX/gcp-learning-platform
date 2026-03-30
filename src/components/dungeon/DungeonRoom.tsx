"use client"

import { motion } from "framer-motion"
import type { DungeonRoom as DungeonRoomType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock, Check } from "lucide-react"

const ROOM_ICONS: Record<string, React.ElementType> = {
  start: LogIn, study: BookOpen, quiz: Swords, lab: FlaskConical,
  demo: PlayCircle, treasure: Gift, boss: Crown,
}

interface Props {
  room: DungeonRoomType
  status: RoomStatus
  theme: ThemeConfig
  isPlayerHere: boolean
  onClick: () => void
  delay: number
}

export function DungeonRoomCard({ room, status, theme, isPlayerHere, onClick, delay }: Props) {
  const Icon = ROOM_ICONS[room.type] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"
  const bg = isLocked ? theme.roomColors.locked : isCleared ? theme.roomColors.cleared : theme.roomColors.available
  const iconColor = isLocked ? "#666" : isCleared ? theme.accentColor : "#fff"
  const labelColor = isLocked ? "#555" : isCleared ? theme.textColor : "#fff"

  const shared = {
    onClick: isLocked ? undefined : onClick,
    disabled: isLocked,
    style: { backgroundColor: bg } as React.CSSProperties,
  }

  const motionProps = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: isLocked ? 0.45 : 1 },
    transition: { delay, type: "spring" as const, stiffness: 200 },
    whileHover: isLocked ? {} : { scale: 1.06, y: -2 },
    whileTap: isLocked ? {} : { scale: 0.95 },
  }

  // Common elements
  const playerMarker = isPlayerHere && (
    <motion.div
      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
    >
      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
    </motion.div>
  )

  const clearedBadge = isCleared && (
    <div
      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
      style={{ backgroundColor: theme.accentColor }}
    >
      <Check size={12} color="#fff" strokeWidth={3} />
    </div>
  )

  const lockIcon = isLocked && (
    <Lock size={16} color="#555" />
  )

  // ── START: Circle ──
  if (room.type === "start") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        style={{
          ...shared.style,
          border: `2px solid ${isPlayerHere ? "#fff" : theme.accentColor}`,
          boxShadow: isPlayerHere ? `0 0 20px ${theme.accentColor}60` : undefined,
        }}
      >
        {playerMarker}
        {clearedBadge}
        {lockIcon ?? <Icon size={20} color={iconColor} />}
        <span className="text-[9px] font-bold mt-0.5" style={{ color: labelColor }}>{room.label}</span>
      </motion.button>
    )
  }

  // ── STUDY: Horizontal card with left accent bar ──
  if (room.type === "study") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative flex items-center gap-2.5 rounded-xl overflow-hidden cursor-pointer disabled:cursor-not-allowed"
        style={{
          ...shared.style,
          border: `1.5px solid ${isPlayerHere ? "#fff" : isCleared ? theme.accentColor + "40" : theme.accentColor + "80"}`,
          boxShadow: isPlayerHere ? `0 0 16px ${theme.accentColor}50` : undefined,
          width: 164, height: 52,
        }}
      >
        {playerMarker}
        {clearedBadge}
        {/* Accent bar */}
        <div className="w-1 h-full shrink-0" style={{ backgroundColor: theme.accentColor }} />
        <div className="flex items-center gap-2 px-1 min-w-0">
          {lockIcon ?? <Icon size={16} color={iconColor} className="shrink-0" />}
          <div className="min-w-0">
            <p className="text-[10px] font-bold leading-tight truncate" style={{ color: labelColor }}>
              {room.label}
            </p>
            <p className="text-[8px] mt-0.5" style={{ color: theme.accentColor, opacity: 0.7 }}>
              📖 学習
            </p>
          </div>
        </div>
        {!isLocked && !isCleared && room.xpReward > 0 && (
          <span className="text-[8px] font-bold pr-2 shrink-0" style={{ color: theme.accentColor }}>
            +{room.xpReward}
          </span>
        )}
      </motion.button>
    )
  }

  // ── QUIZ: Hexagon ──
  if (room.type === "quiz") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative w-[72px] h-[72px] flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        style={{
          ...shared.style,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          boxShadow: isPlayerHere ? `0 0 20px ${theme.accentColor}60` : undefined,
        }}
      >
        {playerMarker}
        {/* Checkmark needs to sit outside clip-path, use pseudo approach */}
        {lockIcon ?? <Icon size={20} color={iconColor} />}
        <span className="text-[9px] font-bold mt-0.5" style={{ color: labelColor }}>
          {room.label}
        </span>
      </motion.button>
    )
  }

  // ── TREASURE: Diamond (rotated square) ──
  if (room.type === "treasure") {
    return (
      <div className="relative w-14 h-14">
        {playerMarker}
        {clearedBadge}
        <motion.button
          {...shared}
          {...motionProps}
          className="w-full h-full rounded-lg rotate-45 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          style={{
            ...shared.style,
            border: `1.5px solid ${isPlayerHere ? "#fff" : theme.accentColor + "60"}`,
            boxShadow: isPlayerHere ? `0 0 16px ${theme.accentColor}50` : undefined,
          }}
        >
          <div className="-rotate-45 flex flex-col items-center">
            {lockIcon ?? <Icon size={18} color={iconColor} />}
          </div>
        </motion.button>
      </div>
    )
  }

  // ── BOSS: Octagon ──
  if (room.type === "boss") {
    return (
      <div className="relative">
        {playerMarker}
        {clearedBadge}
        {/* Outer glow ring */}
        {!isLocked && (
          <motion.div
            className="absolute -inset-2 rounded-2xl"
            style={{ border: `2px solid ${theme.accentColor}`, opacity: 0.3 }}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        )}
        <motion.button
          {...shared}
          {...motionProps}
          className="relative w-[88px] h-[88px] flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          style={{
            ...shared.style,
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            boxShadow: isPlayerHere ? `0 0 24px ${theme.accentColor}60` : undefined,
          }}
        >
          {lockIcon ?? <Crown size={26} color={iconColor} />}
          <span className="text-[10px] font-black mt-1 tracking-wider" style={{ color: labelColor }}>
            {room.label}
          </span>
        </motion.button>
      </div>
    )
  }

  // ── DEFAULT (lab, demo): Rounded square ──
  return (
    <motion.button
      {...shared}
      {...motionProps}
      className="relative w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      style={{
        ...shared.style,
        border: `1.5px solid ${isPlayerHere ? "#fff" : theme.accentColor + "60"}`,
        boxShadow: isPlayerHere ? `0 0 16px ${theme.accentColor}50` : undefined,
      }}
    >
      {playerMarker}
      {clearedBadge}
      {lockIcon ?? <Icon size={18} color={iconColor} />}
      <span className="text-[9px] font-bold mt-0.5" style={{ color: labelColor }}>{room.label}</span>
    </motion.button>
  )
}
