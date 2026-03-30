"use client"

import { motion } from "framer-motion"
import type { DungeonRoom as DungeonRoomType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { BookOpen, Swords, FlaskConical, PlayCircle, Gift, Crown, LogIn, Lock, CheckCircle } from "lucide-react"

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
  study: "学習",
  quiz: "バトル",
  lab: "ラボ",
  demo: "デモ",
  treasure: "宝箱",
  boss: "ボス",
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
  const isAvailable = status === "available"
  const isBoss = room.type === "boss"

  const nodeW = cellSize * 0.82
  const nodeH = cellSize * 0.62
  const cx = room.gridX * cellSize + cellSize / 2
  const cy = room.gridY * cellSize + cellSize / 2
  const rx = cx - nodeW / 2
  const ry = cy - nodeH / 2

  // Colors per status
  const bgColor = isLocked
    ? theme.roomColors.locked
    : isCleared
      ? theme.roomColors.cleared
      : theme.roomColors.available

  const borderColor = isPlayerHere
    ? "#fff"
    : isAvailable
      ? theme.accentColor
      : isCleared
        ? theme.accentColor + "80"
        : "transparent"

  const iconColor = isLocked ? "#888" : isCleared ? "#333" : "#fff"
  const textColor = isLocked ? "#666" : isCleared ? "#333" : "#fff"
  const typeBadgeColor = isLocked ? "#555" : isCleared ? "#44444480" : theme.accentColor + "50"

  // Glow filter ID unique to this room
  const glowId = `glow-${room.id}`

  return (
    <motion.g
      onClick={isLocked ? undefined : onClick}
      style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isLocked ? 0.6 : 1 }}
      transition={{ delay: 0.05 * room.gridY + 0.02 * room.gridX, type: "spring", stiffness: 180 }}
    >
      {/* Glow filter for player / boss */}
      {(isPlayerHere || (isBoss && !isLocked)) && (
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isBoss ? 6 : 4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Outer glow ring for player position */}
      {isPlayerHere && (
        <motion.rect
          x={rx - 4}
          y={ry - 4}
          width={nodeW + 8}
          height={nodeH + 8}
          rx={isBoss ? nodeH / 2 + 4 : 12}
          fill="none"
          stroke="#fff"
          strokeWidth={2}
          opacity={0.5}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      )}

      {/* Room body */}
      <motion.rect
        x={rx}
        y={ry}
        width={nodeW}
        height={nodeH}
        rx={isBoss ? nodeH / 2 : 10}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={isPlayerHere ? 2.5 : isAvailable ? 1.5 : 0}
        filter={isPlayerHere || (isBoss && !isLocked) ? `url(#${glowId})` : undefined}
        whileHover={isLocked ? {} : { scale: 1.06, y: ry - 2 }}
        whileTap={isLocked ? {} : { scale: 0.97 }}
      />

      {/* Type badge (top-left) */}
      <rect
        x={rx + 4}
        y={ry + 4}
        width={28}
        height={14}
        rx={7}
        fill={typeBadgeColor}
      />
      <text
        x={rx + 18}
        y={ry + 13}
        textAnchor="middle"
        fontSize={7}
        fill={textColor}
        fontWeight={600}
        opacity={0.9}
      >
        {ROOM_TYPE_LABELS[room.type] ?? ""}
      </text>

      {/* Icon */}
      <foreignObject
        x={cx - 11}
        y={ry + 14}
        width={22}
        height={22}
      >
        {isLocked ? (
          <Lock size={18} color="#888" />
        ) : (
          <Icon size={18} color={iconColor} />
        )}
      </foreignObject>

      {/* Label - full text, multi-line if needed */}
      <text
        x={cx}
        y={ry + nodeH - 8}
        textAnchor="middle"
        fontSize={room.label.length > 12 ? 8 : 9}
        fill={textColor}
        fontWeight={600}
      >
        {room.label.length > 16 ? room.label.slice(0, 15) + "…" : room.label}
      </text>

      {/* XP reward badge (bottom-right) */}
      {!isLocked && room.xpReward > 0 && !isCleared && (
        <>
          <rect
            x={rx + nodeW - 30}
            y={ry + nodeH - 14}
            width={26}
            height={12}
            rx={6}
            fill={theme.accentColor + "40"}
          />
          <text
            x={rx + nodeW - 17}
            y={ry + nodeH - 5}
            textAnchor="middle"
            fontSize={7}
            fill={theme.accentColor}
            fontWeight={700}
          >
            +{room.xpReward}
          </text>
        </>
      )}

      {/* Cleared check */}
      {isCleared && (
        <foreignObject
          x={rx + nodeW - 18}
          y={ry + 2}
          width={16}
          height={16}
        >
          <CheckCircle size={14} color="#2e7d32" />
        </foreignObject>
      )}

      {/* Player indicator - bouncing arrow */}
      {isPlayerHere && (
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <polygon
            points={`${cx - 5},${ry - 10} ${cx + 5},${ry - 10} ${cx},${ry - 4}`}
            fill="#fff"
          />
        </motion.g>
      )}
    </motion.g>
  )
}
