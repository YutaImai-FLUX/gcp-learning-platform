import type { DungeonMap, DungeonRoom, DungeonConnection, DungeonTheme } from "@/lib/types/dungeon"
import type { CertificationId } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"

const CERT_THEME_MAP: Record<CertificationId, DungeonTheme> = {
  cdl: "forest",
  ace: "tech",
  pca: "castle",
  pde: "volcano",
  pmle: "ice",
  pcne: "ocean",
  pcse: "cave",
  pcd: "sky",
}

const CERT_DUNGEON_NAMES: Record<CertificationId, string> = {
  cdl: "はじまりの森 〜Cloud基礎〜",
  ace: "テックラボ 〜インフラ工場〜",
  pca: "設計城砦 〜アーキテクト〜",
  pde: "データ火山 〜パイプライン〜",
  pmle: "氷結研究所 〜ML精密〜",
  pcne: "深海ケーブル 〜ネットワーク〜",
  pcse: "暗号洞窟 〜セキュリティ〜",
  pcd: "天空都市 〜デベロッパー〜",
}

const NPC_DIALOGUES: Record<CertificationId, string[]> = {
  cdl: [
    "ようこそ、冒険者よ！ここは Google Cloud の基礎を学ぶ森だ。",
    "まずはクラウドの概念を理解することから始めよう。",
    "各部屋で学習を進め、ボスを倒して資格の知識を手に入れるのだ！",
  ],
  ace: [
    "テックラボへようこそ。ここではGCPインフラの実践スキルを磨く。",
    "gcloudコマンドを使いこなし、リソースを管理する力を身につけよ。",
    "最後のボス戦では全ドメインの知識が試される！",
  ],
  pca: [
    "城砦の門をくぐったか。ここはアーキテクト達の修練場だ。",
    "ケーススタディを読み解き、最適な設計を導き出せ。",
    "DR戦略、コスト最適化、セキュリティ...全てを統合する力が必要だ。",
  ],
  pde: [
    "データの溶岩が流れるこの火山で、パイプラインの設計を学べ。",
    "BigQuery、Dataflow、Pub/Sub...データの流れを制御する力を身につけよ。",
    "ボスはデータ全ドメインの複合問題を出してくるぞ！",
  ],
  pmle: [
    "氷結研究所へようこそ。ここではMLの精密な知識を冷静に学ぶ。",
    "Vertex AI、特徴量エンジニアリング、MLOps...全てを習得せよ。",
    "モデルの訓練・デプロイ・監視の全プロセスを理解するのだ。",
  ],
  pcne: [
    "深海へようこそ。ネットワークの海底ケーブルの世界だ。",
    "VPC、ロードバランシング、ハイブリッド接続の全てを理解せよ。",
    "パケットの流れを制御する力が、この海の鍵となる。",
  ],
  pcse: [
    "暗号洞窟へ足を踏み入れたか。ここはセキュリティの聖域だ。",
    "IAM、暗号化、脅威検出...多層防御の全てを学べ。",
    "ゼロトラストの原則を理解し、守りの力を完成させよ。",
  ],
  pcd: [
    "天空都市へようこそ、デベロッパーよ。",
    "Cloud Native開発、CI/CD、マイクロサービスの極意を学べ。",
    "12-Factor Appの原則を武器に、スケーラブルなアプリを構築するのだ。",
  ],
}

/** Shorten long domain names for display in dungeon rooms */
function shortenDomainName(name: string): string {
  return name
    .replace(/Google Cloud\s*(による|の)\s*/g, "")
    .replace(/インフラストラクチャの/g, "インフラ")
    .replace(/アプリケーションの近代化/g, "アプリ近代化")
    .replace(/データ価値の最大化/g, "データ活用")
    .replace(/モダナイズ/g, "近代化")
}

function generateDungeonRooms(certId: CertificationId): DungeonRoom[] {
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return []

  const rooms: DungeonRoom[] = []

  // Start room — always row 0
  rooms.push({
    id: `${certId}-start`,
    label: "入口",
    type: "start",
    gridX: 1,
    gridY: 0,
    xpReward: 0,
    npc: {
      name: "案内人",
      dialogues: NPC_DIALOGUES[certId],
    },
  })

  // Generate rooms per domain — compact: 2 rows per domain (study + quiz side by side)
  cert.domains.forEach((domain, domainIdx) => {
    const baseY = 1 + domainIdx * 2
    const shortName = shortenDomainName(domain.name)

    // Study room — left side
    rooms.push({
      id: `${certId}-study-${domainIdx}`,
      label: shortName,
      domainName: domain.name,
      type: "study",
      gridX: 0,
      gridY: baseY,
      moduleIds: [`${certId}-module-${domainIdx}`],
      unlockRequires: domainIdx === 0
        ? [`${certId}-start`]
        : [`${certId}-quiz-${domainIdx - 1}`],
      xpReward: 15,
    })

    // Quiz room — right side
    rooms.push({
      id: `${certId}-quiz-${domainIdx}`,
      label: `${shortName}`,
      domainName: domain.name,
      type: "quiz",
      gridX: 2,
      gridY: baseY,
      quizDomain: domain.name,
      quizCount: 5,
      unlockRequires: [`${certId}-study-${domainIdx}`],
      xpReward: 50,
    })

    // Treasure room — center, between domain pairs
    if (domainIdx % 2 === 0 && domainIdx < cert.domains.length - 1) {
      rooms.push({
        id: `${certId}-treasure-${domainIdx}`,
        label: "宝箱",
        type: "treasure",
        gridX: 1,
        gridY: baseY + 1,
        unlockRequires: [`${certId}-quiz-${domainIdx}`],
        xpReward: 30,
      })
    }
  })

  // Boss room — final row
  const bossY = 1 + cert.domains.length * 2
  rooms.push({
    id: `${certId}-boss`,
    label: "ボス戦",
    type: "boss",
    gridX: 1,
    gridY: bossY,
    quizDomain: "all",
    quizCount: 20,
    unlockRequires: [`${certId}-quiz-${cert.domains.length - 1}`],
    xpReward: 200,
  })

  return rooms
}

function generateConnections(rooms: DungeonRoom[]): DungeonConnection[] {
  const connections: DungeonConnection[] = []

  for (const room of rooms) {
    if (room.unlockRequires) {
      for (const reqId of room.unlockRequires) {
        connections.push({ from: reqId, to: room.id })
      }
    }
  }

  return connections
}

function generateDungeonMap(certId: CertificationId): DungeonMap {
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) {
    throw new Error(`Certification ${certId} not found`)
  }

  const rooms = generateDungeonRooms(certId)
  const connections = generateConnections(rooms)
  const bossRoom = rooms.find((r) => r.type === "boss")

  return {
    certId,
    name: CERT_DUNGEON_NAMES[certId],
    theme: CERT_THEME_MAP[certId],
    description: cert.description,
    rooms,
    connections,
    bossRoomId: bossRoom?.id ?? "",
  }
}

const ALL_CERT_IDS: CertificationId[] = ["cdl", "ace", "pca", "pde", "pmle", "pcne", "pcse", "pcd"]

export const DUNGEON_MAPS: Record<CertificationId, DungeonMap> = Object.fromEntries(
  ALL_CERT_IDS.map((id) => [id, generateDungeonMap(id)])
) as Record<CertificationId, DungeonMap>

export function getDungeonMap(certId: CertificationId): DungeonMap {
  return DUNGEON_MAPS[certId]
}
