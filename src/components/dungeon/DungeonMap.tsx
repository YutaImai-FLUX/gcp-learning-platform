"use client"

import { useMemo, useState, useCallback, useEffect, useRef } from "react"
import type { DungeonMap as DungeonMapType, RoomStatus, PathSide } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonRoomNode, ROOM_SHAPES } from "./DungeonRoomNode"
import { DungeonNPCDialog } from "./DungeonNPC"
import type { CertificationId } from "@/lib/types/quiz"

interface DungeonMapProps {
  dungeon: DungeonMapType
  theme: ThemeConfig
  onRoomSelect: (roomId: string) => void
}

/** Layout constants */
const ROW_H = 120
const TOP_PAD = 40
const CONTAINER_W = 448

const SIDE_PCT: Record<PathSide, number> = {
  left: 0.22,
  center: 0.50,
  right: 0.78,
}

function getRoomCenter(pathSide: PathSide, pathIndex: number, roomType: string): { cx: number; cy: number } {
  const shape = ROOM_SHAPES[roomType] ?? ROOM_SHAPES.study
  return {
    cx: CONTAINER_W * SIDE_PCT[pathSide],
    cy: pathIndex * ROW_H + TOP_PAD + shape.height / 2,
  }
}

function getRoomPosition(pathSide: PathSide, pathIndex: number, roomType: string): { left: number; top: number } {
  const center = getRoomCenter(pathSide, pathIndex, roomType)
  const shape = ROOM_SHAPES[roomType] ?? ROOM_SHAPES.study
  return {
    left: center.cx - shape.width / 2,
    top: center.cy - shape.height / 2,
  }
}

function generateEdgePath(from: { cx: number; cy: number }, to: { cx: number; cy: number }): string {
  const cpOffset = Math.abs(to.cy - from.cy) * 0.4
  return `M ${from.cx} ${from.cy} C ${from.cx} ${from.cy + cpOffset}, ${to.cx} ${to.cy - cpOffset}, ${to.cx} ${to.cy}`
}

/** Inline SVG edge component */
function DungeonEdgePath({
  path,
  isCleared,
  isActive,
  accentColor,
}: {
  path: string
  isCleared: boolean
  isActive: boolean
  accentColor: string
}) {
  const strokeColor = isCleared ? accentColor : isActive ? accentColor + "60" : "var(--border)"
  const strokeWidth = isCleared ? 2.5 : isActive ? 2 : 1.5
  const opacity = isCleared ? 0.7 : isActive ? 0.5 : 0.2

  return (
    <g>
      {isCleared && (
        <path
          d={path}
          stroke={accentColor}
          strokeWidth={8}
          fill="none"
          opacity={0.08}
          strokeLinecap="round"
        />
      )}
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        strokeDasharray={isCleared ? undefined : isActive ? "8 4" : "3 6"}
        strokeLinecap="round"
      />
      {isActive && !isCleared && (
        <circle r={2.5} fill={accentColor} opacity={0.6}>
          <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {isCleared && (
        <circle r={1.5} fill={accentColor} opacity={0.4}>
          <animateMotion dur="4s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </g>
  )
}

export function DungeonMapView({ dungeon, theme, onRoomSelect }: DungeonMapProps) {
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const [showNPC, setShowNPC] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const handleRoomClick = useCallback((roomId: string) => {
    const room = dungeon.rooms.find((r) => r.id === roomId)
    if (!room) return
    if (room.type === "start" && room.npc && !dungeonProgress[roomId]?.cleared) {
      setShowNPC(roomId)
      return
    }
    onRoomSelect(roomId)
  }, [dungeon.rooms, dungeonProgress, onRoomSelect])

  const canvasHeight = useMemo(() => {
    const maxIdx = Math.max(...dungeon.rooms.map((r) => r.pathIndex))
    return (maxIdx + 1) * ROW_H + TOP_PAD * 2
  }, [dungeon.rooms])

  /** Precompute edge data */
  const edgeData = useMemo(() => {
    return dungeon.connections.map((conn) => {
      const fromRoom = dungeon.rooms.find((r) => r.id === conn.from)
      const toRoom = dungeon.rooms.find((r) => r.id === conn.to)
      if (!fromRoom || !toRoom) return null

      const fromCenter = getRoomCenter(fromRoom.pathSide, fromRoom.pathIndex, fromRoom.type)
      const toCenter = getRoomCenter(toRoom.pathSide, toRoom.pathIndex, toRoom.type)
      const path = generateEdgePath(fromCenter, toCenter)

      const fromCleared = dungeonProgress[conn.from]?.cleared ?? false
      const toAvail = roomStatuses[conn.to] === "available" || roomStatuses[conn.to] === "cleared"

      return {
        id: `${conn.from}-${conn.to}`,
        path,
        isCleared: fromCleared,
        isActive: toAvail && !fromCleared,
      }
    }).filter(Boolean)
  }, [dungeon.connections, dungeon.rooms, dungeonProgress, roomStatuses])

  /** Auto-scroll to current active room */
  useEffect(() => {
    if (!scrollRef.current || !currentRoomId) return
    const currentRoom = dungeon.rooms.find((r) => r.id === currentRoomId)
    if (!currentRoom) return
    const scrollY = currentRoom.pathIndex * ROW_H - 120
    scrollRef.current.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" })
  }, [currentRoomId, dungeon.rooms])

  const npcRoom = showNPC ? dungeon.rooms.find((r) => r.id === showNPC) : null

  return (
    <div className="relative max-w-md mx-auto">
      <div
        ref={scrollRef}
        className="rounded-xl border border-border overflow-hidden overflow-y-auto scrollbar-thin"
        style={{
          maxHeight: Math.min(canvasHeight + 4, 560),
          background: `
            radial-gradient(circle at 20% 30%, ${theme.accentColor}06 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${theme.accentColor}04 0%, transparent 50%),
            var(--card)
          `,
        }}
      >
        {/* Canvas */}
        <div className="relative" style={{ height: canvasHeight, width: CONTAINER_W, maxWidth: "100%" }}>
          {/* SVG path layer */}
          <svg
            width={CONTAINER_W}
            height={canvasHeight}
            className="absolute inset-0 pointer-events-none"
            style={{ maxWidth: "100%" }}
          >
            {edgeData.map((edge) =>
              edge ? (
                <DungeonEdgePath
                  key={edge.id}
                  path={edge.path}
                  isCleared={edge.isCleared}
                  isActive={edge.isActive}
                  accentColor={theme.accentColor}
                />
              ) : null
            )}
          </svg>

          {/* Room nodes */}
          {dungeon.rooms.map((room, idx) => {
            const pos = getRoomPosition(room.pathSide, room.pathIndex, room.type)
            return (
              <DungeonRoomNode
                key={room.id}
                roomType={room.type}
                label={room.label}
                status={roomStatuses[room.id] ?? "locked"}
                isPlayerHere={room.id === currentRoomId}
                accentColor={theme.accentColor}
                xpReward={room.xpReward}
                onClick={() => handleRoomClick(room.id)}
                style={{ left: pos.left, top: pos.top }}
                index={idx}
              />
            )
          })}
        </div>
      </div>

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
