"use client"

import { motion } from "framer-motion"
import type { DungeonRoom as DungeonRoomType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { Lock, Check } from "lucide-react"

/** MC block emoji for each room type */
const ROOM_BLOCK_EMOJI: Record<string, string> = {
  start: "🔨",     // crafting table
  study: "📖",     // bookshelf
  quiz: "🔥",      // furnace
  treasure: "📦",  // chest
  boss: "🟣",      // ender portal
  lab: "⚗️",       // brewing stand
  demo: "🔭",      // spyglass
}

interface Props {
  room: DungeonRoomType
  status: RoomStatus
  theme: ThemeConfig
  isPlayerHere: boolean
  onClick: () => void
  delay: number
}

/** Minecraft 3D bevel box-shadow: light top-left, dark bottom-right */
function mcBevel(light: string, dark: string, size = 3): string {
  return `inset ${size}px ${size}px 0 0 ${light}, inset -${size}px -${size}px 0 0 ${dark}`
}

/** Minecraft-style text shadow (1px bottom-right) */
const MC_TEXT_SHADOW = "1px 1px 0 rgba(0,0,0,0.7)"

export function DungeonRoomCard({ room, status, theme, isPlayerHere, onClick, delay }: Props) {
  const isLocked = status === "locked"
  const isCleared = status === "cleared"

  const bg = isLocked ? theme.roomColors.locked : isCleared ? theme.roomColors.cleared : theme.roomColors.available
  const labelColor = isLocked ? "#555" : isCleared ? theme.textColor : "#fff"

  const shared = {
    onClick: isLocked ? undefined : onClick,
    disabled: isLocked,
  }

  const motionProps = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: isLocked ? 0.45 : 1 },
    transition: { delay, type: "spring" as const, stiffness: 200 },
    whileHover: isLocked ? {} : { scale: 1.05, y: -2 },
    whileTap: isLocked ? {} : { scale: 0.95 },
  }

  // ── Player marker (steve head bouncing) ──
  const playerMarker = isPlayerHere && (
    <motion.div
      className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    >
      <div className="text-sm" style={{ textShadow: MC_TEXT_SHADOW }}>⛏️</div>
    </motion.div>
  )

  // ── Cleared badge (checkmark on emerald block) ──
  const clearedBadge = isCleared && (
    <div
      className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center z-10"
      style={{
        backgroundColor: theme.accentColor,
        boxShadow: mcBevel(theme.bevelLight, theme.bevelDark, 1),
        imageRendering: "pixelated",
      }}
    >
      <Check size={12} color="#fff" strokeWidth={3} />
    </div>
  )

  // ── Lock icon ──
  const lockIcon = isLocked && <Lock size={16} color="#555" />

  // ── MC block style: shared across all types ──
  const blockStyle: React.CSSProperties = {
    backgroundColor: bg,
    boxShadow: isPlayerHere
      ? `${mcBevel(theme.bevelLight, theme.bevelDark)}, 0 0 16px ${theme.accentColor}50`
      : mcBevel(theme.bevelLight, theme.bevelDark),
    border: isPlayerHere ? `2px solid ${theme.accentColor}` : `2px solid ${theme.tileBorder}`,
    imageRendering: "pixelated",
  }

  // ── START: Crafting Table block ──
  if (room.type === "start") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative w-16 h-16 flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        style={blockStyle}
      >
        {playerMarker}
        {clearedBadge}
        {lockIcon ?? (
          <span className="text-xl" style={{ imageRendering: "pixelated" }}>
            {ROOM_BLOCK_EMOJI.start}
          </span>
        )}
        <span
          className="text-[8px] font-bold mt-0.5"
          style={{ color: labelColor, textShadow: MC_TEXT_SHADOW }}
        >
          {room.label}
        </span>
      </motion.button>
    )
  }

  // ── STUDY: Bookshelf block (horizontal card) ──
  if (room.type === "study") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        style={{
          ...blockStyle,
          width: 164, height: 52,
        }}
      >
        {playerMarker}
        {clearedBadge}
        {/* Left accent strip (like book spines) */}
        <div
          className="w-1.5 h-full shrink-0"
          style={{ backgroundColor: theme.accentColor, imageRendering: "pixelated" }}
        />
        <div className="flex items-center gap-2 px-1 min-w-0">
          {lockIcon ?? (
            <span className="text-base shrink-0" style={{ imageRendering: "pixelated" }}>
              {ROOM_BLOCK_EMOJI.study}
            </span>
          )}
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold leading-tight truncate"
              style={{ color: labelColor, textShadow: MC_TEXT_SHADOW }}
            >
              {room.label}
            </p>
            <p
              className="text-[8px] mt-0.5 font-medium"
              style={{ color: theme.accentColor, textShadow: MC_TEXT_SHADOW }}
            >
              STUDY
            </p>
          </div>
        </div>
        {!isLocked && !isCleared && room.xpReward > 0 && (
          <span
            className="text-[8px] font-bold pr-2 shrink-0"
            style={{ color: "#80FF20", textShadow: MC_TEXT_SHADOW }}
          >
            +{room.xpReward}XP
          </span>
        )}
      </motion.button>
    )
  }

  // ── QUIZ: Furnace block ──
  if (room.type === "quiz") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative w-[72px] h-[72px] flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        style={blockStyle}
      >
        {playerMarker}
        {clearedBadge}
        {lockIcon ?? (
          <span className="text-xl" style={{ imageRendering: "pixelated" }}>
            {ROOM_BLOCK_EMOJI.quiz}
          </span>
        )}
        <span
          className="text-[9px] font-bold mt-0.5"
          style={{ color: labelColor, textShadow: MC_TEXT_SHADOW }}
        >
          {room.label}
        </span>
      </motion.button>
    )
  }

  // ── TREASURE: Chest block ──
  if (room.type === "treasure") {
    return (
      <motion.button
        {...shared}
        {...motionProps}
        className="relative w-16 h-14 flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        style={{
          ...blockStyle,
          // Gold latch highlight
          borderTopColor: isPlayerHere ? theme.accentColor : "#FFAA00",
        }}
      >
        {playerMarker}
        {clearedBadge}
        {lockIcon ?? (
          <span className="text-xl" style={{ imageRendering: "pixelated" }}>
            {ROOM_BLOCK_EMOJI.treasure}
          </span>
        )}
        <span
          className="text-[8px] font-bold mt-0.5"
          style={{ color: "#FFAA00", textShadow: MC_TEXT_SHADOW }}
        >
          {room.label}
        </span>
      </motion.button>
    )
  }

  // ── BOSS: Ender Portal / Boss block ──
  if (room.type === "boss") {
    return (
      <div className="relative">
        {playerMarker}
        {clearedBadge}
        {/* Ender particle glow */}
        {!isLocked && (
          <motion.div
            className="absolute -inset-2"
            style={{
              border: `2px solid ${theme.accentColor}`,
              boxShadow: `0 0 12px ${theme.accentColor}40`,
              opacity: 0.4,
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        )}
        <motion.button
          {...shared}
          {...motionProps}
          className="relative w-[88px] h-[88px] flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          style={{
            ...blockStyle,
            border: `3px solid ${isPlayerHere ? theme.accentColor : theme.tileBorder}`,
            boxShadow: isPlayerHere
              ? `${mcBevel(theme.bevelLight, theme.bevelDark, 4)}, 0 0 24px ${theme.accentColor}60`
              : mcBevel(theme.bevelLight, theme.bevelDark, 4),
          }}
        >
          {lockIcon ?? (
            <span className="text-2xl" style={{ imageRendering: "pixelated" }}>
              {ROOM_BLOCK_EMOJI.boss}
            </span>
          )}
          <span
            className="text-[10px] font-black mt-1 tracking-widest"
            style={{ color: "#FF55FF", textShadow: "1px 1px 0 #AA00AA" }}
          >
            BOSS
          </span>
        </motion.button>
      </div>
    )
  }

  // ── DEFAULT (lab, demo): Standard block ──
  return (
    <motion.button
      {...shared}
      {...motionProps}
      className="relative w-16 h-16 flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      style={blockStyle}
    >
      {playerMarker}
      {clearedBadge}
      {lockIcon ?? (
        <span className="text-base" style={{ imageRendering: "pixelated" }}>
          {ROOM_BLOCK_EMOJI[room.type] ?? "🧱"}
        </span>
      )}
      <span
        className="text-[9px] font-bold mt-0.5"
        style={{ color: labelColor, textShadow: MC_TEXT_SHADOW }}
      >
        {room.label}
      </span>
    </motion.button>
  )
}
