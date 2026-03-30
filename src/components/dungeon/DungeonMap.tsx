"use client"

import { useMemo, useState, useCallback } from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type Viewport,
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

/**
 * Layout constants — horizontal LTR flow.
 * Tighter spacing so nodes appear larger at default zoom.
 */
const COL_W = 200
const ROW_Y: Record<PathSide, number> = { left: 0, center: 90, right: 180 }
const NODE_W = 180 // approximate node width for viewport centering

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

  // Build nodes
  const nodes: Node[] = useMemo(() => {
    return dungeon.rooms.map((room) => ({
      id: room.id,
      type: "dungeon",
      position: {
        x: room.pathIndex * COL_W,
        y: ROW_Y[room.pathSide],
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

  // Build edges
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

  // Center viewport on the current active room at zoom=1
  const defaultViewport: Viewport = useMemo(() => {
    const activeRoom = dungeon.rooms.find((r) => r.id === currentRoomId)
    if (!activeRoom) return { x: 0, y: 0, zoom: 1 }
    const nodeX = activeRoom.pathIndex * COL_W
    const nodeY = ROW_Y[activeRoom.pathSide]
    // Center the active room in the container (assume ~700px wide, 420px tall container)
    return {
      x: -nodeX + 260 - NODE_W / 2,
      y: -nodeY + 170,
      zoom: 1,
    }
  }, [dungeon.rooms, currentRoomId])

  const npcRoom = showNPC ? dungeon.rooms.find((r) => r.id === showNPC) : null

  return (
    <div className="relative">
      <div
        className="rounded-xl border border-border overflow-hidden bg-card/50"
        style={{ height: 420 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultViewport={defaultViewport}
          panOnDrag
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={2}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="var(--border)"
          />
        </ReactFlow>
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-1.5 opacity-60">
        ドラッグでスクロール・スクロールでズーム
      </p>

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
