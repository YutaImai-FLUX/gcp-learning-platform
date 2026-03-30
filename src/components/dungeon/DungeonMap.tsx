"use client"

import { useMemo, useState } from "react"
import type { DungeonMap as DungeonMapType, RoomStatus } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonRoomCard } from "./DungeonRoom"
import { DungeonNPCDialog } from "./DungeonNPC"
import type { CertificationId } from "@/lib/types/quiz"

interface DungeonMapProps {
  dungeon: DungeonMapType
  theme: ThemeConfig
  onRoomSelect: (roomId: string) => void
}

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

  const npcRoom = showNPC
    ? dungeon.rooms.find((r) => r.id === showNPC)
    : null

  const handleRoomClick = (roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return

    if (room.type === "start" && room.npc && !dungeonProgress[roomId]?.cleared) {
      setShowNPC(roomId)
      return
    }

    onRoomSelect(roomId)
  }

  // Group rooms by row (gridY)
  const maxY = Math.max(...dungeon.rooms.map((r) => r.gridY))
  const maxX = Math.max(...dungeon.rooms.map((r) => r.gridX))
  const cols = maxX + 1

  // Build rows
  const rows: { y: number; rooms: typeof dungeon.rooms }[] = []
  for (let y = 0; y <= maxY; y++) {
    const rowRooms = dungeon.rooms.filter((r) => r.gridY === y)
    if (rowRooms.length > 0) {
      rows.push({ y, rooms: rowRooms })
    }
  }

  return (
    <div className="relative">
      <div
        className="rounded-xl p-4 sm:p-6"
        style={{ backgroundColor: theme.tileColor, border: `1px solid ${theme.tileBorder}` }}
      >
        {/* Map grid */}
        <div className="space-y-3">
          {rows.map(({ y, rooms: rowRooms }) => {
            // Check if this row has a connector from previous row
            const hasConnectorAbove = y > 0

            return (
              <div key={y}>
                {/* Vertical connector */}
                {hasConnectorAbove && (
                  <div className="flex justify-center mb-3">
                    <div
                      className="w-0.5 h-6"
                      style={{ backgroundColor: theme.pathColor, opacity: 0.5 }}
                    />
                  </div>
                )}

                {/* Room row */}
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                  {Array.from({ length: cols }, (_, x) => {
                    const room = rowRooms.find((r) => r.gridX === x)
                    if (!room) {
                      return <div key={x} />
                    }
                    return (
                      <DungeonRoomCard
                        key={room.id}
                        room={room}
                        status={roomStatuses[room.id] ?? "locked"}
                        theme={theme}
                        isPlayerHere={room.id === currentRoomId}
                        onClick={() => handleRoomClick(room.id)}
                      />
                    )
                  })}
                </div>

                {/* Horizontal connector between study and quiz in same row */}
                {rowRooms.length > 1 && (
                  <div className="flex items-center justify-center mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: theme.pathColor, opacity: 0.6 }}>
                      学習 → バトル
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* NPC Dialog overlay */}
      {npcRoom?.npc && showNPC && (
        <DungeonNPCDialog
          npc={npcRoom.npc}
          theme={theme}
          onClose={() => {
            setShowNPC(null)
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
