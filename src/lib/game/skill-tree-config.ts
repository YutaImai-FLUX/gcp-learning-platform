import type { CertificationId } from "@/lib/types/quiz"

export interface SkillNode {
  id: string
  label: string
  labelJa: string
  certId?: CertificationId
  type: "cert" | "category"
  requires: string[]
  x: number
  y: number
}

export const SKILL_TREE_NODES: SkillNode[] = [
  // Root
  { id: "start", label: "Start", labelJa: "学習開始", type: "category", requires: [], x: 3, y: 0 },

  // Foundational
  { id: "cdl", label: "CDL", labelJa: "Cloud Digital Leader", certId: "cdl", type: "cert", requires: ["start"], x: 3, y: 1 },

  // Associate
  { id: "ace", label: "ACE", labelJa: "Associate Cloud Engineer", certId: "ace", type: "cert", requires: ["cdl"], x: 3, y: 2 },

  // Professional branches
  { id: "pca", label: "PCA", labelJa: "Professional Cloud Architect", certId: "pca", type: "cert", requires: ["ace"], x: 1, y: 3 },
  { id: "pde", label: "PDE", labelJa: "Professional Data Engineer", certId: "pde", type: "cert", requires: ["ace"], x: 2, y: 3 },
  { id: "pcd", label: "PCD", labelJa: "Professional Cloud Developer", certId: "pcd", type: "cert", requires: ["ace"], x: 3, y: 3 },
  { id: "pcne", label: "PCNE", labelJa: "Professional Cloud Network Engineer", certId: "pcne", type: "cert", requires: ["ace"], x: 4, y: 3 },
  { id: "pcse", label: "PCSE", labelJa: "Professional Cloud Security Engineer", certId: "pcse", type: "cert", requires: ["ace"], x: 5, y: 3 },

  // ML (requires PDE)
  { id: "pmle", label: "PMLE", labelJa: "Professional ML Engineer", certId: "pmle", type: "cert", requires: ["pde"], x: 2, y: 4 },
]

export const SKILL_TREE_EDGES: Array<{ from: string; to: string }> = SKILL_TREE_NODES
  .filter((n) => n.requires.length > 0)
  .flatMap((n) => n.requires.map((r) => ({ from: r, to: n.id })))
