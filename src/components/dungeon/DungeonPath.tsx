"use client"

import { motion } from "framer-motion"
import type { DungeonConnection, DungeonRoom } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"

interface DungeonPathProps {
  connection: DungeonConnection
  rooms: DungeonRoom[]
  theme: ThemeConfig
  isCleared: boolean
  isActive?: boolean
  cellSize: number
}

export function DungeonPath({ connection, rooms, theme, isCleared, isActive, cellSize }: DungeonPathProps) {
  const fromRoom = rooms.find((r) => r.id === connection.from)
  const toRoom = rooms.find((r) => r.id === connection.to)
  if (!fromRoom || !toRoom) return null

  const x1 = fromRoom.gridX * cellSize + cellSize / 2
  const y1 = fromRoom.gridY * cellSize + cellSize / 2
  const x2 = toRoom.gridX * cellSize + cellSize / 2
  const y2 = toRoom.gridY * cellSize + cellSize / 2

  // Curved path: add a slight curve for non-straight connections
  const dx = x2 - x1
  const dy = y2 - y1
  const isHorizontal = Math.abs(dx) > Math.abs(dy)
  const curveOffset = isHorizontal ? dy * 0.3 : dx * 0.3

  const midX = (x1 + x2) / 2 + (isHorizontal ? 0 : curveOffset)
  const midY = (y1 + y2) / 2 + (isHorizontal ? curveOffset : 0)

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
  const pathId = `path-${connection.from}-${connection.to}`

  const strokeColor = isCleared
    ? theme.accentColor
    : isActive
      ? theme.pathColor
      : theme.tileBorder

  const strokeW = isCleared ? 3 : isActive ? 2.5 : 1.5

  return (
    <g>
      {/* Main path */}
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill="none"
        strokeDasharray={isCleared ? undefined : isActive ? "8 4" : "4 6"}
        strokeLinecap="round"
        opacity={isCleared ? 0.8 : isActive ? 0.6 : 0.25}
      />

      {/* Glow effect for cleared paths */}
      {isCleared && (
        <path
          d={pathD}
          stroke={theme.accentColor}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          opacity={0.12}
        />
      )}

      {/* Animated dot flowing along active/cleared paths */}
      {(isCleared || isActive) && (
        <>
          <path id={pathId} d={pathD} fill="none" stroke="none" />
          <motion.circle
            r={isCleared ? 3 : 2}
            fill={isCleared ? theme.accentColor : theme.pathColor}
            opacity={0.8}
          >
            <animateMotion
              dur={isCleared ? "2s" : "3s"}
              repeatCount="indefinite"
              path={pathD}
            />
          </motion.circle>
        </>
      )}

      {/* Direction arrow at midpoint for active paths */}
      {isActive && !isCleared && (
        <circle
          cx={midX}
          cy={midY}
          r={3}
          fill={theme.pathColor}
          opacity={0.5}
        />
      )}
    </g>
  )
}
