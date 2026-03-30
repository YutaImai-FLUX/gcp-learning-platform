"use client"

import { motion } from "framer-motion"
import type { DungeonRoom as DungeonRoomType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock } from "lucide-react"

const ROOM_ICONS: Record<string, React.ElementType> = {
  start: LogIn,
  study: BookOpen,
  quiz: Swords,
  lab: FlaskConical,
  demo: PlayCircle,
  treasure: Gift,
  boss: Crown,
}

interface DungeonRoomProps {
  room: DungeonRoomType
  status: RoomStatus
  theme: ThemeConfig
  isPlayerHere: boolean
  onClick: () => void
  cellSize: number
}

export function DungeonRoomNode({ room, status, theme, isPlayerHere, onClick, cellSize }: DungeonRoomProps) {
  const Icon = ROOM_ICONS[room.type] ?? BookOpen
  const isLocked = status === "locked"
  const isCleared = status === "cleared"
  const isActive = status === "active"
  const size = cellSize * 0.7

  const bgColor = isLocked
    ? theme.roomColors.locked
    : isCleared
      ? theme.roomColors.cleared
      : isActive
        ? theme.roomColors.active
        : theme.roomColors.available

  return (
    <motion.g
      onClick={isLocked ? undefined : onClick}
      style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * room.gridY, type: "spring", stiffness: 200 }}
    >
      {/* Room body */}
      <motion.rect
        x={room.gridX * cellSize + (cellSize - size) / 2}
        y={room.gridY * cellSize + (cellSize - size) / 2}
        width={size}
        height={size}
        rx={room.type === "boss" ? size / 2 : 6}
        fill={bgColor}
        stroke={isPlayerHere ? "#fff" : isActive ? theme.accentColor : "transparent"}
        strokeWidth={isPlayerHere ? 3 : isActive ? 2 : 0}
        style={{ filter: isPlayerHere ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : undefined }}
        whileHover={isLocked ? {} : { scale: 1.1 }}
        whileTap={isLocked ? {} : { scale: 0.95 }}
      />

      {/* Icon */}
      <foreignObject
        x={room.gridX * cellSize + (cellSize - 20) / 2}
        y={room.gridY * cellSize + (cellSize - size) / 2 + size * 0.15}
        width={20}
        height={20}
      >
        {isLocked ? (
          <Lock size={18} color="#888" />
        ) : (
          <Icon size={18} color={isCleared ? "#333" : "#fff"} />
        )}
      </foreignObject>

      {/* Label */}
      <text
        x={room.gridX * cellSize + cellSize / 2}
        y={room.gridY * cellSize + (cellSize - size) / 2 + size * 0.8}
        textAnchor="middle"
        fontSize={9}
        fill={isLocked ? "#666" : isCleared ? "#333" : "#fff"}
        fontWeight={600}
      >
        {room.label.length > 8 ? room.label.slice(0, 7) + "…" : room.label}
      </text>

      {/* Cleared check */}
      {isCleared && (
        <text
          x={room.gridX * cellSize + cellSize / 2 + size / 2 - 6}
          y={room.gridY * cellSize + (cellSize - size) / 2 + 12}
          fontSize={12}
          fill="#333"
        >
          ✓
        </text>
      )}

      {/* Player indicator */}
      {isPlayerHere && (
        <motion.circle
          cx={room.gridX * cellSize + cellSize / 2}
          cy={room.gridY * cellSize + (cellSize - size) / 2 - 8}
          r={4}
          fill="#fff"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
    </motion.g>
  )
}
