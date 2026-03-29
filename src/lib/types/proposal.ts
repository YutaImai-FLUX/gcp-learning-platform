import type { Architecture } from "@/lib/data/architectures"

/* ─── Input ─── */

export type Industry =
  | "retail" | "finance" | "healthcare" | "manufacturing"
  | "media" | "education" | "government" | "startup" | "gaming"

export type ProjectScale = "small" | "medium" | "large" | "enterprise"

export type Requirement =
  | "realtime-analytics" | "ml-prediction" | "batch-processing"
  | "api-backend" | "web-app" | "mobile-backend" | "iot"
  | "data-warehouse" | "ci-cd" | "microservices" | "serverless"
  | "hybrid-cloud" | "high-availability" | "security-compliance"
  | "content-delivery" | "event-driven" | "genai-rag" | "multi-agent"

export interface ProposalInput {
  clientName: string
  industry: Industry
  scale: ProjectScale
  requirements: Requirement[]
  budgetRange: "low" | "medium" | "high"
  existingInfra: string
}

/* ─── Output ─── */

export interface RecommendedService {
  productId: string
  name: string
  role: string
  reason: string
  estimatedMonthlyCost: number
  tier: string
}

export interface CostBreakdown {
  services: { productId: string; name: string; monthlyCost: number }[]
  totalMonthlyCost: number
  annualCost: number
  cudAnnualCost: number
  discountNote: string
}

export interface TimelinePhase {
  phase: string
  durationWeeks: number
  tasks: string[]
  services: string[]
}

export interface ChallengePoint {
  category: "technical" | "organizational" | "cost" | "security"
  title: string
  description: string
  mitigation: string
}

export interface GeneratedProposal {
  id: string
  input: ProposalInput
  title: string
  summary: string
  recommendedServices: RecommendedService[]
  architecture: Architecture
  costBreakdown: CostBreakdown
  timeline: TimelinePhase[]
  totalDurationWeeks: number
  challenges: ChallengePoint[]
  generatedAt: string
}
