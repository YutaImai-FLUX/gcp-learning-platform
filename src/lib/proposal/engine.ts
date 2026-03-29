import type {
  ProposalInput,
  GeneratedProposal,
  RecommendedService,
  CostBreakdown,
  TimelinePhase,
  ChallengePoint,
} from "@/lib/types/proposal"
import type {
  Architecture,
  ArchNode,
  ArchEdge,
  ArchLayer,
} from "@/lib/data/architectures"
import { ARCHITECTURES } from "@/lib/data/architectures"
import { PROPOSAL_TEMPLATES, type ProposalTemplate } from "./templates"
import { getServiceCost, getCudDiscount } from "./pricing"
import { INDUSTRY_META, SCALE_META } from "./requirements-meta"

/* ─── Icon / Color lookup maps ─── */

const PRODUCT_ICON_MAP: Record<string, string> = {
  "compute-engine": "Server",
  "cloud-run": "Play",
  "gke": "Box",
  "cloud-functions": "Zap",
  "cloud-sql": "Database",
  "cloud-spanner": "Database",
  "firestore": "Flame",
  "bigtable": "LayoutGrid",
  "memorystore": "Zap",
  "cloud-storage": "HardDrive",
  "bigquery": "BarChart3",
  "dataflow": "GitBranch",
  "dataproc": "Cpu",
  "pub-sub": "Radio",
  "vertex-ai": "Brain",
  "vertex-ai-search": "Search",
  "gemini-api": "Sparkles",
  "cloud-load-balancing": "Network",
  "cloud-cdn": "Globe",
  "cloud-armor": "Shield",
  "cloud-dns": "Globe",
  "cloud-build": "GitBranch",
  "artifact-registry": "Package",
  "cloud-deploy": "Play",
  "cloud-logging": "Activity",
  "cloud-monitoring": "Activity",
  "secret-manager": "Key",
  "cloud-interconnect": "Cable",
  "cloud-vpn": "Lock",
  "cloud-iam": "Lock",
  "firebase-hosting": "Globe",
  "firebase-auth": "Lock",
  "looker-studio": "LineChart",
}

const PRODUCT_COLOR_MAP: Record<string, string> = {
  "compute-engine": "#4285F4",
  "cloud-run": "#4285F4",
  "gke": "#4285F4",
  "cloud-functions": "#FBBC05",
  "cloud-sql": "#EA4335",
  "cloud-spanner": "#EA4335",
  "firestore": "#FBBC05",
  "bigtable": "#EA4335",
  "memorystore": "#EA4335",
  "cloud-storage": "#4285F4",
  "bigquery": "#4285F4",
  "dataflow": "#4285F4",
  "dataproc": "#4285F4",
  "pub-sub": "#FBBC05",
  "vertex-ai": "#4285F4",
  "vertex-ai-search": "#4285F4",
  "gemini-api": "#4285F4",
  "cloud-load-balancing": "#34A853",
  "cloud-cdn": "#34A853",
  "cloud-armor": "#EA4335",
  "cloud-build": "#34A853",
  "artifact-registry": "#4285F4",
  "cloud-deploy": "#34A853",
  "cloud-logging": "#FBBC05",
  "cloud-monitoring": "#FBBC05",
  "secret-manager": "#EA4335",
  "cloud-interconnect": "#34A853",
  "cloud-vpn": "#34A853",
  "cloud-iam": "#EA4335",
}

/* ─── Scale duration multipliers ─── */

const SCALE_DURATION_MULTIPLIER: Record<string, number> = {
  small: 0.7,
  medium: 1,
  large: 1.5,
  enterprise: 2,
}

/* ─── Main export ─── */

export function generateProposal(input: ProposalInput): GeneratedProposal {
  /* ── Step 1: Template Selection ── */
  let bestTemplate: ProposalTemplate = PROPOSAL_TEMPLATES[0]
  let bestScore = -Infinity

  for (const template of PROPOSAL_TEMPLATES) {
    let score = 0
    for (const req of input.requirements) {
      if (template.matchRequirements.includes(req)) {
        score += 1
      }
    }
    if (template.matchIndustries.includes(input.industry)) {
      score += 1
    }
    if (score > bestScore) {
      bestScore = score
      bestTemplate = template
    }
  }

  /* ── Step 2: Service Assembly ── */
  const serviceEntries: { productId: string; name: string; role: string; reason: string; tier: string }[] = [
    ...bestTemplate.coreServices,
  ]

  const coveredRequirements = new Set(bestTemplate.matchRequirements)
  for (const req of input.requirements) {
    if (!coveredRequirements.has(req)) {
      for (const rule of bestTemplate.supplementaryRules) {
        if (rule.when.includes(req)) {
          for (const svc of rule.add) {
            serviceEntries.push(svc)
          }
        }
      }
    }
  }

  // Deduplicate by productId (keep first occurrence)
  const seen = new Set<string>()
  const dedupedEntries: typeof serviceEntries = []
  for (const entry of serviceEntries) {
    if (!seen.has(entry.productId)) {
      seen.add(entry.productId)
      dedupedEntries.push(entry)
    }
  }

  const recommendedServices: RecommendedService[] = dedupedEntries.map((svc) => ({
    productId: svc.productId,
    name: svc.name,
    role: svc.role,
    reason: svc.reason,
    estimatedMonthlyCost: getServiceCost(svc.productId, input.scale),
    tier: svc.tier,
  }))

  /* ── Step 3: Architecture Building ── */
  const baseArch = ARCHITECTURES.find((a) => a.id === bestTemplate.baseArchitectureId)
  const architecture: Architecture = baseArch
    ? (JSON.parse(JSON.stringify(baseArch)) as Architecture)
    : {
        id: `proposal-${Date.now()}`,
        name: "カスタムアーキテクチャ",
        description: "",
        category: "Custom",
        tags: [],
        layers: [],
        nodes: [],
        edges: [],
        useCases: [],
        benefits: [],
      }

  architecture.id = `proposal-${Date.now()}`

  // Find supplementary services not already in the architecture nodes
  const existingNodeIds = new Set(architecture.nodes.map((n) => n.id))
  const supplementaryNodes: ArchNode[] = []
  const supplementaryEdges: ArchEdge[] = []

  for (const svc of recommendedServices) {
    if (!existingNodeIds.has(svc.productId)) {
      const label = svc.name.includes(" ")
        ? svc.name.replace(/ /, "\n")
        : svc.name
      const node: ArchNode = {
        id: svc.productId,
        label,
        service: svc.name,
        x: 0,
        y: 0,
        color: PRODUCT_COLOR_MAP[svc.productId] ?? "#5f6368",
        icon: PRODUCT_ICON_MAP[svc.productId] ?? "Box",
      }
      supplementaryNodes.push(node)
      existingNodeIds.add(svc.productId)

      // Connect from last existing node
      const lastNode =
        architecture.nodes.length > 0
          ? architecture.nodes[architecture.nodes.length - 1]
          : null
      if (lastNode) {
        supplementaryEdges.push({
          from: lastNode.id,
          to: svc.productId,
          dashed: true,
        })
      }
    }
  }

  if (supplementaryNodes.length > 0) {
    architecture.nodes.push(...supplementaryNodes)
    architecture.edges.push(...supplementaryEdges)

    const extraLayer: ArchLayer = {
      id: "l-extra",
      label: "追加サービス",
      color: "#4285F4",
      nodeIds: supplementaryNodes.map((n) => n.id),
    }
    architecture.layers.push(extraLayer)
  }

  /* ── Step 4: Cost Calculation ── */
  const costServices = recommendedServices.map((s) => ({
    productId: s.productId,
    name: s.name,
    monthlyCost: s.estimatedMonthlyCost,
  }))
  const totalMonthlyCost = costServices.reduce((sum, s) => sum + s.monthlyCost, 0)
  const annualCost = totalMonthlyCost * 12
  const cudSavings = recommendedServices.reduce(
    (sum, s) => sum + s.estimatedMonthlyCost * getCudDiscount(s.productId),
    0,
  )
  const cudAnnualCost = Math.round((totalMonthlyCost - cudSavings) * 12)
  const discountNote =
    cudSavings > 0
      ? `確約利用割引(CUD)適用で年間約$${Math.round(cudSavings * 12).toLocaleString()}の削減が見込めます`
      : "従量課金が中心のため、確約利用割引の対象は限定的です"

  const costBreakdown: CostBreakdown = {
    services: costServices,
    totalMonthlyCost,
    annualCost,
    cudAnnualCost,
    discountNote,
  }

  /* ── Step 5: Timeline ── */
  const multiplier = SCALE_DURATION_MULTIPLIER[input.scale] ?? 1
  const timeline: TimelinePhase[] = (
    JSON.parse(JSON.stringify(bestTemplate.baseTimeline)) as TimelinePhase[]
  ).map((phase) => ({
    ...phase,
    durationWeeks: Math.max(1, Math.round(phase.durationWeeks * multiplier)),
  }))
  const totalDurationWeeks = timeline.reduce((sum, p) => sum + p.durationWeeks, 0)

  /* ── Step 6: Challenges ── */
  const challenges: ChallengePoint[] = JSON.parse(
    JSON.stringify(bestTemplate.baseChallenges),
  ) as ChallengePoint[]

  // Industry-specific challenges
  if (input.industry === "finance") {
    challenges.push({
      category: "security",
      title: "金融規制対応",
      description:
        "FISC安全対策基準への準拠が必要です。データの暗号化、アクセス制御、監査ログの保持期間など、金融機関特有の要件を満たす設計が求められます。",
      mitigation:
        "Google Cloud は FISC 準拠のリファレンスアーキテクチャを提供しており、Cloud Audit Logs・VPC Service Controls・Cloud KMS を組み合わせて対応します。",
    })
  }
  if (input.industry === "healthcare") {
    challenges.push({
      category: "security",
      title: "医療情報ガイドライン準拠",
      description:
        "3省2ガイドラインへの対応が求められます。医療情報の適切な管理・保護のため、データ所在地やアクセス管理の厳格な設計が必要です。",
      mitigation:
        "東京・大阪リージョンでのデータ保持を徹底し、Cloud Healthcare API・IAM Conditions・DLP を活用してガイドライン準拠を実現します。",
    })
  }
  if (input.industry === "government") {
    challenges.push({
      category: "security",
      title: "ISMAPクラウドセキュリティ",
      description:
        "政府情報システムのためのセキュリティ評価制度(ISMAP)への登録・準拠が求められます。クラウドサービスの安全性評価をクリアする必要があります。",
      mitigation:
        "Google Cloud は ISMAP 登録済みサービスを多数提供しています。ISMAP 対象サービスを中心に構成し、Assured Workloads で準拠状態を継続監視します。",
    })
  }

  // Scale-specific challenge for enterprise
  if (input.scale === "enterprise") {
    challenges.push({
      category: "organizational",
      title: "大規模組織の変更管理",
      description:
        "エンタープライズ規模では、複数部門・チーム間の調整やレガシーシステムからの移行に伴う組織的な変更管理が大きな課題となります。",
      mitigation:
        "段階的な移行計画を策定し、CoE(Center of Excellence)チームを設置。Google Cloud のプロフェッショナルサービスと連携し、組織全体のクラウド成熟度を段階的に向上させます。",
    })
  }

  /* ── Step 7: Title & Summary ── */
  const industryLabel = INDUSTRY_META[input.industry].label
  const scaleLabel = SCALE_META[input.scale].label

  const title = bestTemplate.titleTemplate
    .replace("{client}", input.clientName)
    .replace("{industry}", industryLabel)
    .replace("{scale}", scaleLabel)

  const summary = bestTemplate.summaryTemplate
    .replace("{client}", input.clientName)
    .replace("{industry}", industryLabel)
    .replace("{scale}", scaleLabel)

  /* ── Step 8: Return ── */
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    input,
    title,
    summary,
    recommendedServices,
    architecture,
    costBreakdown,
    timeline,
    totalDurationWeeks,
    challenges,
    generatedAt: new Date().toISOString(),
  }
}
