import type { ProjectScale } from "@/lib/types/proposal"

export interface ServicePricing {
  baseMonthlyCost: number
  scaleMultipliers: Record<ProjectScale, number>
  cudDiscount: number
}

export const SERVICE_PRICING: Record<string, ServicePricing> = {
  /* ── Compute ── */
  "compute-engine":       { baseMonthlyCost: 150,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 22 },  cudDiscount: 0.30 },
  "cloud-run":            { baseMonthlyCost: 40,   scaleMultipliers: { small: 1, medium: 3, large: 10, enterprise: 25 }, cudDiscount: 0 },
  "gke":                  { baseMonthlyCost: 220,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0.25 },
  "app-engine":           { baseMonthlyCost: 60,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 18 },  cudDiscount: 0 },
  "cloud-functions":      { baseMonthlyCost: 15,   scaleMultipliers: { small: 1, medium: 4, large: 12, enterprise: 30 }, cudDiscount: 0 },

  /* ── Database ── */
  "cloud-sql":            { baseMonthlyCost: 80,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0.25 },
  "cloud-spanner":        { baseMonthlyCost: 650,  scaleMultipliers: { small: 1, medium: 2, large: 5, enterprise: 15 },  cudDiscount: 0.20 },
  "firestore":            { baseMonthlyCost: 25,   scaleMultipliers: { small: 1, medium: 4, large: 12, enterprise: 30 }, cudDiscount: 0 },
  "bigtable":             { baseMonthlyCost: 460,  scaleMultipliers: { small: 1, medium: 2, large: 5, enterprise: 12 },  cudDiscount: 0.20 },
  "memorystore":          { baseMonthlyCost: 70,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 18 },  cudDiscount: 0.25 },

  /* ── Storage ── */
  "cloud-storage":        { baseMonthlyCost: 20,   scaleMultipliers: { small: 1, medium: 4, large: 15, enterprise: 40 }, cudDiscount: 0 },

  /* ── Analytics ── */
  "bigquery":             { baseMonthlyCost: 200,  scaleMultipliers: { small: 1, medium: 4, large: 12, enterprise: 30 }, cudDiscount: 0.35 },
  "dataflow":             { baseMonthlyCost: 120,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0 },
  "dataproc":             { baseMonthlyCost: 100,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 18 },  cudDiscount: 0.25 },
  "pub-sub":              { baseMonthlyCost: 30,   scaleMultipliers: { small: 1, medium: 4, large: 12, enterprise: 30 }, cudDiscount: 0 },
  "looker-studio":        { baseMonthlyCost: 0,    scaleMultipliers: { small: 1, medium: 1, large: 1, enterprise: 1 },   cudDiscount: 0 },

  /* ── AI/ML ── */
  "vertex-ai":            { baseMonthlyCost: 300,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0.20 },
  "vertex-ai-search":     { baseMonthlyCost: 180,  scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 18 },  cudDiscount: 0 },
  "gemini-api":           { baseMonthlyCost: 100,  scaleMultipliers: { small: 1, medium: 4, large: 12, enterprise: 30 }, cudDiscount: 0 },

  /* ── Networking ── */
  "cloud-load-balancing": { baseMonthlyCost: 25,   scaleMultipliers: { small: 1, medium: 2, large: 5, enterprise: 12 },  cudDiscount: 0 },
  "cloud-cdn":            { baseMonthlyCost: 30,   scaleMultipliers: { small: 1, medium: 3, large: 10, enterprise: 25 }, cudDiscount: 0 },
  "cloud-armor":          { baseMonthlyCost: 75,   scaleMultipliers: { small: 1, medium: 1, large: 2, enterprise: 4 },   cudDiscount: 0 },
  "cloud-dns":            { baseMonthlyCost: 5,    scaleMultipliers: { small: 1, medium: 1, large: 2, enterprise: 3 },   cudDiscount: 0 },
  "cloud-interconnect":   { baseMonthlyCost: 1500, scaleMultipliers: { small: 1, medium: 1, large: 2, enterprise: 4 },   cudDiscount: 0 },
  "cloud-vpn":            { baseMonthlyCost: 75,   scaleMultipliers: { small: 1, medium: 2, large: 3, enterprise: 6 },   cudDiscount: 0 },

  /* ── DevOps ── */
  "cloud-build":          { baseMonthlyCost: 15,   scaleMultipliers: { small: 1, medium: 2, large: 4, enterprise: 8 },   cudDiscount: 0 },
  "artifact-registry":    { baseMonthlyCost: 10,   scaleMultipliers: { small: 1, medium: 2, large: 4, enterprise: 8 },   cudDiscount: 0 },
  "cloud-deploy":         { baseMonthlyCost: 0,    scaleMultipliers: { small: 1, medium: 1, large: 1, enterprise: 1 },   cudDiscount: 0 },

  /* ── Operations ── */
  "cloud-logging":        { baseMonthlyCost: 15,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0 },
  "cloud-monitoring":     { baseMonthlyCost: 10,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0 },
  "secret-manager":       { baseMonthlyCost: 5,    scaleMultipliers: { small: 1, medium: 1, large: 2, enterprise: 3 },   cudDiscount: 0 },

  /* ── Security ── */
  "cloud-iam":            { baseMonthlyCost: 0,    scaleMultipliers: { small: 1, medium: 1, large: 1, enterprise: 1 },   cudDiscount: 0 },

  /* ── Firebase ── */
  "firebase-hosting":     { baseMonthlyCost: 10,   scaleMultipliers: { small: 1, medium: 3, large: 8, enterprise: 20 },  cudDiscount: 0 },
  "firebase-auth":        { baseMonthlyCost: 0,    scaleMultipliers: { small: 1, medium: 1, large: 1, enterprise: 1 },   cudDiscount: 0 },
}

export function getServiceCost(productId: string, scale: ProjectScale): number {
  const p = SERVICE_PRICING[productId]
  if (!p) return 50 // fallback
  return Math.round(p.baseMonthlyCost * p.scaleMultipliers[scale])
}

export function getCudDiscount(productId: string): number {
  return SERVICE_PRICING[productId]?.cudDiscount ?? 0
}
