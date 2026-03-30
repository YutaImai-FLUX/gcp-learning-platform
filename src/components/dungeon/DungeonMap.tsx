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

const CELL_SIZE = 80

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
  const svgWidth = maxX * CELL_SIZE
  const svgHeight = maxY * CELL_SIZE

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

  return (
    <div className="relative">
      <div className="overflow-auto rounded-lg p-4" style={{ backgroundColor: theme.tileColor + "40" }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
        >
          {/* Paths */}
          {dungeon.connections.map((conn) => {
            const isCleared = dungeonProgress[conn.from]?.cleared ?? false
            return (
              <DungeonPath
                key={`${conn.from}-${conn.to}`}
                connection={conn}
                rooms={dungeon.rooms}
                theme={theme}
                isCleared={isCleared}
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
