"use client"

import { useMemo, useState, useCallback } from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
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

const COL_X = { left: 0, center: 160, right: 320 }
const ROW_H = 100

/** Convert pathSide to flow X position */
function sideToX(side: PathSide): number {
  return COL_X[side]
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

  // Build React Flow nodes
  const nodes: Node[] = useMemo(() => {
    return dungeon.rooms.map((room) => ({
      id: room.id,
      type: "dungeon",
      position: {
        x: sideToX(room.pathSide),
        y: room.pathIndex * ROW_H,
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
    }))
  }, [dungeon.rooms, roomStatuses, currentRoomId, theme.accentColor, handleRoomClick])

  // Build React Flow edges
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

  // Calculate viewport to fit all nodes
  const maxIndex = Math.max(...dungeon.rooms.map((r) => r.pathIndex))
  const mapHeight = (maxIndex + 1) * ROW_H + 40

  const npcRoom = showNPC ? dungeon.rooms.find((r) => r.id === showNPC) : null

  return (
    <div className="relative">
      <div
        className="rounded-lg border border-border overflow-hidden bg-card"
        style={{ height: Math.min(mapHeight, 600) }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--border)"
          />
        </ReactFlow>
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
