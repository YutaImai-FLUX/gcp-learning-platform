"use client"

import type { DungeonConnection, DungeonRoom } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"

interface DungeonPathProps {
  connection: DungeonConnection
  rooms: DungeonRoom[]
  theme: ThemeConfig
  isCleared: boolean
  cellSize: number
}

export function DungeonPath({ connection, rooms, theme, isCleared, cellSize }: DungeonPathProps) {
  const fromRoom = rooms.find((r) => r.id === connection.from)
  const toRoom = rooms.find((r) => r.id === connection.to)
  if (!fromRoom || !toRoom) return null

  const x1 = fromRoom.gridX * cellSize + cellSize / 2
  const y1 = fromRoom.gridY * cellSize + cellSize / 2
  const x2 = toRoom.gridX * cellSize + cellSize / 2
  const y2 = toRoom.gridY * cellSize + cellSize / 2

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isCleared ? theme.pathColor : theme.tileBorder}
      strokeWidth={isCleared ? 3 : 2}
      strokeDasharray={isCleared ? undefined : "6 4"}
      strokeLinecap="round"
      opacity={isCleared ? 0.9 : 0.4}
    />
  )
}
