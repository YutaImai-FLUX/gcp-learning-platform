import type { CertificationId } from "./quiz"

export type DungeonTheme = "forest" | "tech" | "castle" | "volcano" | "ice" | "ocean" | "cave" | "sky" | "cyber"
export type RoomType = "start" | "study" | "quiz" | "lab" | "demo" | "treasure" | "boss"
export type RoomStatus = "locked" | "available" | "active" | "cleared"
export type DungeonDifficulty = "normal" | "hard" | "expert"
export type BattleRank = "S" | "A" | "B" | "C"

export interface DifficultyConfig {
  label: string
  description: string
  playerHP: number
  enemyHP: number
  bossHP: number
  damagePerCorrect: number
  damagePerWrong: number
  xpMultiplier: number
  quizCountMultiplier: number
}

export interface DungeonNPC {
  name: string
  dialogues: string[]
}

export type PathSide = "left" | "center" | "right"

export interface DungeonRoom {
  id: string
  label: string
  domainName?: string
  type: RoomType
  gridX: number
  gridY: number
  pathIndex: number
  pathSide: PathSide
  moduleIds?: string[]
  labIds?: string[]
  demoId?: string
  quizDomain?: string
  quizCount?: number
  unlockRequires?: string[] // room IDs that must be cleared
  npc?: DungeonNPC
  xpReward: number
}

export interface DungeonConnection {
  from: string
  to: string
}

export interface DungeonMap {
  certId: CertificationId
  name: string
  theme: DungeonTheme
  description: string
  rooms: DungeonRoom[]
  connections: DungeonConnection[]
  bossRoomId: string
}

export interface BattleState {
  active: boolean
  roomId: string
  questionIds: string[]
  currentIndex: number
  playerHP: number
  enemyHP: number
  maxPlayerHP: number
  maxEnemyHP: number
  answers: (number | null)[]
  result: "pending" | "victory" | "defeat"
  xpEarned: number
}
