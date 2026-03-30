"use client"

import { useMemo, useState } from "react"
import type { DungeonMap as DungeonMapType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonRoomNode } from "./DungeonRoom"
import { DungeonPath } from "./DungeonPath"
import { DungeonNPCDialog } from "./DungeonNPC"
import type { CertificationId } from "@/lib/types/quiz"

interface DungeonMapProps {
  dungeon: DungeonMapType
  theme: ThemeConfig
  onRoomSelect: (roomId: string) => void
}

const CELL_SIZE = 130

export function DungeonMapView({ dungeon, theme, onRoomSelect }: DungeonMapProps) {
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const [showNPC, setShowNPC] = useState<string | null>(null)

  const roomStatuses = useMemo(() => {
    const statuses: Record<string, RoomStatus> = {}

    for (const room of dungeon.rooms) {
      if (dungeonProgress[room.id]?.cleared) {
        statuses[room.id] = "cleared"
      } else if (room.type === "start") {
        statuses[room.id] = "available"
      } else if (room.unlockRequires) {
        const allReqCleared = room.unlockRequires.every(
          (reqId) => dungeonProgress[reqId]?.cleared
        )
        statuses[room.id] = allReqCleared ? "available" : "locked"
      } else {
        statuses[room.id] = "available"
      }
    }

    return statuses
  }, [dungeon.rooms, dungeonProgress])

  // Find the "current" room: first available non-cleared room
  const currentRoomId = useMemo(() => {
    const available = dungeon.rooms.find(
      (r) => roomStatuses[r.id] === "available"
    )
    return available?.id ?? dungeon.rooms[0]?.id
  }, [dungeon.rooms, roomStatuses])

  const maxX = Math.max(...dungeon.rooms.map((r) => r.gridX)) + 1
  const maxY = Math.max(...dungeon.rooms.map((r) => r.gridY)) + 1
  const svgWidth = maxX * CELL_SIZE + 40
  const svgHeight = maxY * CELL_SIZE + 40
  const PAD = 20

  const npcRoom = showNPC
    ? dungeon.rooms.find((r) => r.id === showNPC)
    : null

  const handleRoomClick = (roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return

    // Show NPC dialog for start rooms
    if (room.type === "start" && room.npc && !dungeonProgress[roomId]?.cleared) {
      setShowNPC(roomId)
      return
    }

    onRoomSelect(roomId)
  }

  // Grid pattern ID
  const gridPatternId = `grid-${dungeon.certId}`
  const bgPatternId = `bg-${dungeon.certId}`

  return (
    <div className="relative">
      <div className="overflow-auto rounded-xl">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
        >
          <defs>
            {/* Subtle grid pattern */}
            <pattern id={gridPatternId} width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
              <rect width={CELL_SIZE} height={CELL_SIZE} fill="none" stroke={theme.tileBorder} strokeWidth={0.5} opacity={0.2} />
            </pattern>
            {/* Radial gradient background */}
            <radialGradient id={bgPatternId} cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor={theme.accentColor} stopOpacity={0.08} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width={svgWidth} height={svgHeight} fill={theme.tileColor} rx={12} />
          <rect width={svgWidth} height={svgHeight} fill={`url(#${bgPatternId})`} rx={12} />
          <rect width={svgWidth} height={svgHeight} fill={`url(#${gridPatternId})`} />

          {/* Decorative border */}
          <rect
            x={2}
            y={2}
            width={svgWidth - 4}
            height={svgHeight - 4}
            fill="none"
            stroke={theme.accentColor}
            strokeWidth={1.5}
            rx={12}
            opacity={0.3}
          />

          <g transform={`translate(${PAD}, ${PAD})`}>
            {/* Paths */}
            {dungeon.connections.map((conn) => {
              const fromCleared = dungeonProgress[conn.from]?.cleared ?? false
              const toAvailable = roomStatuses[conn.to] === "available" || roomStatuses[conn.to] === "cleared"
              return (
                <DungeonPath
                  key={`${conn.from}-${conn.to}`}
                  connection={conn}
                  rooms={dungeon.rooms}
                  theme={theme}
                  isCleared={fromCleared}
                  isActive={toAvailable && !fromCleared}
                  cellSize={CELL_SIZE}
                />
              )
            })}

            {/* Rooms */}
            {dungeon.rooms.map((room) => (
              <DungeonRoomNode
                key={room.id}
                room={room}
                status={roomStatuses[room.id] ?? "locked"}
                theme={theme}
                isPlayerHere={room.id === currentRoomId}
                onClick={() => handleRoomClick(room.id)}
                cellSize={CELL_SIZE}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* NPC Dialog overlay */}
      {npcRoom?.npc && showNPC && (
        <DungeonNPCDialog
          npc={npcRoom.npc}
          theme={theme}
          onClose={() => {
            setShowNPC(null)
            // Auto-clear start room
            useGameStore.getState().clearDungeonRoom(
              dungeon.certId as CertificationId,
              npcRoom.id
            )
          }}
        />
      )}
    </div>
  )
}
