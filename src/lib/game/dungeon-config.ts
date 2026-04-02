import type { DungeonMap, DungeonRoom, DungeonConnection, DungeonTheme, PathSide, DungeonDifficulty, DifficultyConfig, BattleRank } from "@/lib/types/dungeon"
import type { CertificationId } from "@/lib/types/quiz"
import { CERTIFICATIONS } from "@/lib/data/certifications"

/* ── Difficulty system ── */

export const DIFFICULTY_CONFIGS: Record<DungeonDifficulty, DifficultyConfig> = {
  normal: {
    label: "Normal",
    description: "標準的な難易度。初挑戦におすすめ",
    playerHP: 100,
    enemyHP: 100,
    bossHP: 150,
    damagePerCorrect: 25,
    damagePerWrong: 20,
    xpMultiplier: 1,
    quizCountMultiplier: 1,
  },
  hard: {
    label: "Hard",
    description: "敵が強化。より正確な知識が求められる",
    playerHP: 80,
    enemyHP: 130,
    bossHP: 200,
    damagePerCorrect: 25,
    damagePerWrong: 25,
    xpMultiplier: 1.5,
    quizCountMultiplier: 1.5,
  },
  expert: {
    label: "Expert",
    description: "最高難度。一問のミスが命取り",
    playerHP: 60,
    enemyHP: 150,
    bossHP: 250,
    damagePerCorrect: 25,
    damagePerWrong: 35,
    xpMultiplier: 2,
    quizCountMultiplier: 2,
  },
}

/* ── Boss names per certification ── */

export const BOSS_NAMES: Record<CertificationId, string> = {
  cdl: "クラウドガーディアン",
  ace: "テックタイタン",
  pca: "アーキテクトドラゴン",
  pde: "データフェニックス",
  pmle: "フロストMLロード",
  pcne: "ネットリヴァイアサン",
  pcse: "シャドウセンチネル",
  pcd: "スカイコンパイラ",
}

/* ── Battle rank calculation ── */

const RANK_S_ACCURACY = 0.9
const RANK_A_ACCURACY = 0.7
const RANK_B_ACCURACY = 0.5

export function calculateBattleRank(
  correctCount: number,
  totalCount: number,
  remainingHP: number,
  maxHP: number,
): BattleRank {
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0
  const hpRatio = maxHP > 0 ? remainingHP / maxHP : 0

  if (accuracy >= RANK_S_ACCURACY && hpRatio > 0.5) return "S"
  if (accuracy >= RANK_A_ACCURACY) return "A"
  if (accuracy >= RANK_B_ACCURACY) return "B"
  return "C"
}

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
    "クラウドの世界は広大で、Compute・Storage・Networkの3本柱が全ての基礎となる。",
    "まずは「学習の部屋」で基礎知識を固めよう。焦らず、一歩ずつ進むのだ。",
    "バトルでは正解で敵にダメージ、不正解で自分がダメージを受ける。慎重に選べ！",
    "最奥にはクラウドガーディアンが待ち構えている。全ドメインの知識で挑むのだ！",
    "この森を制する者は、Cloud Digitalの基礎を完全に理解した証となる。",
  ],
  ace: [
    "テックラボへようこそ。ここではGCPインフラの実践スキルを磨く。",
    "GCE、GKE、Cloud Run...コンピューティングの選択は状況次第。使い分けを学べ。",
    "IAMとネットワーキングは全ての土台だ。権限設計を疎かにするな。",
    "コスト最適化も重要なスキルだ。Committedは長期、Spotはバッチ処理向きと覚えよ。",
    "最後のボス戦では、全ドメインの知識が横断的に試される。準備は万全にしておけ。",
    "Associate Engineer の名に恥じぬ実力を、このラボで証明するのだ！",
  ],
  pca: [
    "城砦の門をくぐったか。ここはアーキテクト達の修練場だ。",
    "ケーススタディを読み解き、ビジネス要件から最適な設計を導き出せ。",
    "高可用性、スケーラビリティ、セキュリティ...設計の三原則を常に念頭に置け。",
    "マルチリージョン vs リージョナル。SLAの要件で判断が変わるぞ。",
    "マイクロサービスかモノリスか。移行戦略も含めた総合判断力が問われる。",
    "アーキテクトドラゴンは最強の設計問題を出す。覚悟せよ！",
  ],
  pde: [
    "データの溶岩が流れるこの火山で、パイプラインの設計を学べ。",
    "BigQueryはデータウェアハウスの王。パーティション分割とクラスタリングを極めよ。",
    "Dataflow（Apache Beam）でストリーミング処理を制御する力を身につけよ。",
    "Pub/Subは非同期メッセージングの要。少なくとも1回の配信保証を理解せよ。",
    "データガバナンスとセキュリティも忘れるな。DLPとCloud KMSの使い分けが鍵だ。",
    "データフェニックスは溶岩の中から蘇る。パイプライン全体の理解で挑め！",
  ],
  pmle: [
    "氷結研究所へようこそ。MLの精密な知識を冷静に学ぶのだ。",
    "Vertex AIはエンドツーエンドのMLプラットフォーム。AutoMLからカスタムモデルまで使いこなせ。",
    "特徴量エンジニアリングは精度を左右する。Feature Storeの活用法を学べ。",
    "MLOpsの原則を理解せよ。CI/CD/CTの3つのパイプラインが鍵だ。",
    "モデルの公平性とバイアス対策。Responsible AIの観点も忘れるな。",
    "フロストMLロードは氷のように冷静で正確だ。曖昧な知識では倒せぬぞ。",
  ],
  pcne: [
    "深海へようこそ。ネットワークの海底ケーブルの世界だ。",
    "VPCネットワークの設計はGCPの根幹。共有VPCとVPCピアリングの違いを理解せよ。",
    "Cloud Load Balancingは7種類。プロトコルとスコープで正しく選択するのだ。",
    "ハイブリッド接続: Cloud VPN、Cloud Interconnect、Partner Interconnect。帯域と要件で判断。",
    "プライベートGoogleアクセスとPrivate Service Connect。内部通信の制御を極めよ。",
    "ネットリヴァイアサンは深海から全帯域の知識を試す。覚悟して挑め！",
  ],
  pcse: [
    "暗号洞窟へ足を踏み入れたか。セキュリティの聖域だ。",
    "IAMの最小権限の原則は全ての基本。カスタムロールとサービスアカウントの運用を学べ。",
    "Cloud KMS、Secret Manager、Certificate Authority...暗号化の層を理解せよ。",
    "Security Command Center でポスチャ管理。脅威検出はChronicle SIEMと連携。",
    "VPC Service Controls でデータ流出を防げ。境界ポリシーの設計が問われるぞ。",
    "シャドウセンチネルは闇から攻撃する。多層防御の知識なくして勝利なし！",
  ],
  pcd: [
    "天空都市へようこそ、デベロッパーよ。",
    "Cloud Native開発の基礎: コンテナ化、マイクロサービス、12-Factorアプリを理解せよ。",
    "Cloud Build と Artifact Registry で CI/CD パイプラインを構築するのだ。",
    "Cloud Run と GKE の使い分け。サーバーレスかオーケストレーションか、要件で判断。",
    "Firestore、Cloud SQL、Spanner...データストアの選択は整合性と規模で決まる。",
    "スカイコンパイラは天空から全コードを見渡す。開発の全フェーズの知識で挑め！",
  ],
}

/** Shorten long domain names for room labels */
function shortenDomain(name: string): string {
  return name
    .replace(/Google Cloud\s*(による|の)\s*/g, "")
    .replace(/インフラストラクチャの/g, "インフラ")
    .replace(/アプリケーションの近代化/g, "アプリ近代化")
    .replace(/データ価値の最大化/g, "データ活用")
    .replace(/モダナイズ/g, "近代化")
    .replace(/デジタルトランスフォーメーションと/g, "DX基礎: ")
}

function generateDungeonRooms(certId: CertificationId): DungeonRoom[] {
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return []

  const rooms: DungeonRoom[] = []
  let idx = 0

  // Start room — center
  rooms.push({
    id: `${certId}-start`,
    label: "入口",
    type: "start",
    gridX: 1, gridY: 0,
    pathIndex: idx++,
    pathSide: "center",
    xpReward: 0,
    npc: { name: "案内人", dialogues: NPC_DIALOGUES[certId] },
  })

  // Generate rooms per domain — zigzag left/right
  cert.domains.forEach((domain, domainIdx) => {
    const side: PathSide = domainIdx % 2 === 0 ? "left" : "right"
    const shortName = shortenDomain(domain.name)

    // Study room — unlocks from previous quiz, or from treasure if one was inserted
    const prevTreasureId = domainIdx > 0 && (domainIdx - 1) % 2 === 0 && (domainIdx - 1) < cert.domains.length - 1
      ? `${certId}-treasure-${domainIdx - 1}`
      : null
    const studyUnlockReq = domainIdx === 0
      ? [`${certId}-start`]
      : prevTreasureId
        ? [prevTreasureId]
        : [`${certId}-quiz-${domainIdx - 1}`]

    rooms.push({
      id: `${certId}-study-${domainIdx}`,
      label: shortName,
      domainName: domain.name,
      type: "study",
      gridX: side === "left" ? 0 : 2, gridY: idx,
      pathIndex: idx++,
      pathSide: side,
      moduleIds: [`${certId}-module-${domainIdx}`],
      unlockRequires: studyUnlockReq,
      xpReward: 15,
    })

    // Quiz room — same side as study
    rooms.push({
      id: `${certId}-quiz-${domainIdx}`,
      label: "バトル",
      domainName: domain.name,
      type: "quiz",
      gridX: side === "left" ? 0 : 2, gridY: idx,
      pathIndex: idx++,
      pathSide: side,
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
        gridX: 1, gridY: idx,
        pathIndex: idx++,
        pathSide: "center",
        unlockRequires: [`${certId}-quiz-${domainIdx}`],
        xpReward: 30,
      })
    }
  })

  // Boss room — center
  rooms.push({
    id: `${certId}-boss`,
    label: "BOSS",
    type: "boss",
    gridX: 1, gridY: idx,
    pathIndex: idx,
    pathSide: "center",
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
  if (!cert) throw new Error(`Certification ${certId} not found`)

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
