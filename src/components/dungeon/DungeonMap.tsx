"use client"

import { useMemo, useState, useCallback, useEffect, useRef } from "react"
import {
  ReactFlow,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { DungeonMap as DungeonMapType, RoomStatus, PathSide } from "@/lib/types/dungeon"
import type { ThemeConfig } from "@/lib/game/dungeon-themes"
import { useGameStore } from "@/lib/stores/useGameStore"
import { DungeonFlowNode } from "./DungeonFlowNode"
import { DungeonFlowEdge } from "./DungeonFlowEdge"
import { DungeonNPCDialog } from "./DungeonNPC"
import type { CertificationId } from "@/lib/types/quiz"

interface DungeonMapProps {
  dungeon: DungeonMapType
  theme: ThemeConfig
  onRoomSelect: (roomId: string) => void
}

const NODE_TYPES = { dungeon: DungeonFlowNode }
const EDGE_TYPES = { dungeon: DungeonFlowEdge }

/** Vertical winding path layout constants */
const ROW_H = 120
const MAP_W = 420
const X_LEFT = 40
const X_CENTER = MAP_W / 2 - 90
const X_RIGHT = MAP_W - 220

const SIDE_X: Record<PathSide, number> = {
  left: X_LEFT,
  center: X_CENTER,
  right: X_RIGHT,
}

export function DungeonMapView({ dungeon, theme, onRoomSelect }: DungeonMapProps) {
  const dungeonProgress = useGameStore((s) => s.dungeonProgress)
  const [showNPC, setShowNPC] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  /** Calculate total map height based on room count */
  const mapHeight = useMemo(() => {
    const maxIdx = Math.max(...dungeon.rooms.map((r) => r.pathIndex))
    return (maxIdx + 1) * ROW_H + 80
  }, [dungeon.rooms])

  const nodes: Node[] = useMemo(() => {
    return dungeon.rooms.map((room) => ({
      id: room.id,
      type: "dungeon",
      position: {
        x: SIDE_X[room.pathSide],
        y: room.pathIndex * ROW_H + 20,
      },
      data: {
        label: room.label,
        roomType: room.type,
        status: roomStatuses[room.id] ?? "locked",
        isPlayerHere: room.id === currentRoomId,
        accentColor: theme.accentColor,
        xpReward: room.xpReward,
        onClick: () => handleRoomClick(room.id),
      },
      draggable: false,
      selectable: false,
      connectable: false,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }))
  }, [dungeon.rooms, roomStatuses, currentRoomId, theme.accentColor, handleRoomClick])

  const edges: Edge[] = useMemo(() => {
    return dungeon.connections.map((conn) => {
      const fromCleared = dungeonProgress[conn.from]?.cleared ?? false
      const toAvail = roomStatuses[conn.to] === "available" || roomStatuses[conn.to] === "cleared"
      return {
        id: `${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        type: "dungeon",
        data: {
          isCleared: fromCleared,
          isActive: toAvail && !fromCleared,
          accentColor: theme.accentColor,
        },
      }
    })
  }, [dungeon.connections, dungeonProgress, roomStatuses, theme.accentColor])

  /** Auto-scroll to current active room */
  useEffect(() => {
    if (!containerRef.current || !currentRoomId) return
    const currentRoom = dungeon.rooms.find((r) => r.id === currentRoomId)
    if (!currentRoom) return
    const scrollY = currentRoom.pathIndex * ROW_H - 120
    containerRef.current.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" })
  }, [currentRoomId, dungeon.rooms])

  const npcRoom = showNPC ? dungeon.rooms.find((r) => r.id === showNPC) : null

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="rounded-xl border border-border overflow-hidden bg-card/30 overflow-y-auto scrollbar-thin"
        style={{
          height: Math.min(mapHeight, 560),
          background: `
            radial-gradient(circle at 20% 30%, ${theme.accentColor}06 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${theme.accentColor}04 0%, transparent 50%),
            var(--card)
          `,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          panOnDrag
          panOnScroll
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={1}
          maxZoom={1}
          style={{ width: MAP_W, height: mapHeight }}
        />
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
