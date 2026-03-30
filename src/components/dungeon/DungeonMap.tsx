"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import type { DungeonMap as DungeonMapType, RoomStatus, PathSide } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonRoomCard } from "./DungeonRoom"
import { DungeonPathLine } from "./DungeonPath"
import { DungeonNPCDialog } from "./DungeonNPC"
import type { CertificationId } from "@/lib/types/quiz"

interface DungeonMapProps {
  dungeon: DungeonMapType
  theme: ThemeConfig
  onRoomSelect: (roomId: string) => void
}

const ROW_H = 90
const MAP_W = 400

/** Convert pathSide to pixel X center coordinate */
function sideToX(side: PathSide, roomType: string): number {
  // Study rooms are wider (164px), so offset center differently
  if (roomType === "study") {
    return side === "left" ? 100 : side === "right" ? 300 : 200
  }
  return side === "left" ? 80 : side === "right" ? 320 : 200
}

/** Convert pathIndex to pixel Y center coordinate */
function indexToY(pathIndex: number): number {
  return 48 + pathIndex * ROW_H
}

export function DungeonMapView({ dungeon, theme, onRoomSelect }: DungeonMapProps) {
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const [showNPC, setShowNPC] = useState<string | null>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  const roomStatuses = useMemo(() => {
    const statuses: Record<string, RoomStatus> = {}
    for (const room of dungeon.rooms) {
      if (dungeonProgress[room.id]?.cleared) {
        statuses[room.id] = "cleared"
      } else if (room.type === "start") {
        statuses[room.id] = "available"
      } else if (room.unlockRequires) {
        const allReqCleared = room.unlockRequires.every((reqId) => dungeonProgress[reqId]?.cleared)
        statuses[room.id] = allReqCleared ? "available" : "locked"
      } else {
        statuses[room.id] = "available"
      }
    }
    return statuses
  }, [dungeon.rooms, dungeonProgress])

  const currentRoomId = useMemo(() => {
    return dungeon.rooms.find((r) => roomStatuses[r.id] === "available")?.id ?? dungeon.rooms[0]?.id
  }, [dungeon.rooms, roomStatuses])

  // Auto-scroll to current room
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentRoomId])

  const npcRoom = showNPC ? dungeon.rooms.find((r) => r.id === showNPC) : null
  const maxIndex = Math.max(...dungeon.rooms.map((r) => r.pathIndex))
  const totalH = indexToY(maxIndex) + 60

  const handleRoomClick = (roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return
    if (room.type === "start" && room.npc && !dungeonProgress[roomId]?.cleared) {
      setShowNPC(roomId)
      return
    }
    onRoomSelect(roomId)
  }

  return (
    <div className="relative">
      <div
        className="relative mx-auto overflow-visible rounded-2xl"
        style={{
          maxWidth: MAP_W,
          minHeight: totalH,
          backgroundColor: theme.tileColor,
          border: `1px solid ${theme.tileBorder}`,
          backgroundImage: theme.bgPattern,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Ambient emoji decoration */}
        {theme.ambientEmoji.map((emoji, i) => (
          <div
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              fontSize: 16,
              opacity: 0.12,
              left: `${15 + i * 30}%`,
              top: `${20 + i * 25}%`,
            }}
          >
            {emoji}
          </div>
        ))}

        {/* SVG paths layer */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: totalH }}
          viewBox={`0 0 ${MAP_W} ${totalH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {dungeon.connections.map((conn) => {
            const fromRoom = dungeon.rooms.find((r) => r.id === conn.from)
            const toRoom = dungeon.rooms.find((r) => r.id === conn.to)
            if (!fromRoom || !toRoom) return null

            const fromCleared = dungeonProgress[conn.from]?.cleared ?? false
            const toAvail = roomStatuses[conn.to] === "available" || roomStatuses[conn.to] === "cleared"

            return (
              <DungeonPathLine
                key={`${conn.from}-${conn.to}`}
                x1={sideToX(fromRoom.pathSide, fromRoom.type)}
                y1={indexToY(fromRoom.pathIndex)}
                x2={sideToX(toRoom.pathSide, toRoom.type)}
                y2={indexToY(toRoom.pathIndex)}
                theme={theme}
                isCleared={fromCleared}
                isActive={toAvail && !fromCleared}
              />
            )
          })}
        </svg>

        {/* Room nodes layer */}
        <div className="relative" style={{ height: totalH }}>
          {dungeon.rooms.map((room) => {
            const cx = sideToX(room.pathSide, room.type)
            const cy = indexToY(room.pathIndex)
            const isActive = room.id === currentRoomId

            // Determine offset from center based on room type dimensions
            const halfW = room.type === "study" ? 82 : room.type === "boss" ? 44 : room.type === "quiz" ? 36 : 32
            const halfH = room.type === "study" ? 26 : room.type === "boss" ? 44 : room.type === "quiz" ? 36 : 32

            return (
              <div
                key={room.id}
                ref={isActive ? activeRef : undefined}
                className="absolute"
                style={{
                  left: cx - halfW,
                  top: cy - halfH,
                }}
              >
                <DungeonRoomCard
                  room={room}
                  status={roomStatuses[room.id] ?? "locked"}
                  theme={theme}
                  isPlayerHere={isActive}
                  onClick={() => handleRoomClick(room.id)}
                  delay={room.pathIndex * 0.06}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* NPC Dialog */}
      {npcRoom?.npc && showNPC && (
        <DungeonNPCDialog
          npc={npcRoom.npc}
          theme={theme}
          onClose={() => {
            setShowNPC(null)
            useGameStore.getState().clearDungeonRoom(dungeon.certId as CertificationId, npcRoom.id)
          }}
        />
      )}
    </div>
  )
}
