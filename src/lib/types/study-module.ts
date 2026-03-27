import type { CertificationId } from "./quiz"

export type ContentBlockType =
  | "text"
  | "concept_card"
  | "comparison_table"
  | "decision_tree"
  | "key_point"
  | "code_example"

export interface TextBlock {
  type: "text"
  markdown: string
}

export interface ConceptCardBlock {
  type: "concept_card"
  term: string
  definition: string
  useCases: string[]
  characteristics: string[]
  examRelevance?: string
}

export interface ComparisonRow {
  label: string
  values: string[]
  highlight?: boolean
}

export interface ComparisonTableBlock {
  type: "comparison_table"
  title: string
  headers: string[]
  rows: ComparisonRow[]
  footnote?: string
}

export interface DecisionTreeNode {
  id: string
  question?: string
  answer?: string
  yesId?: string
  noId?: string
  explanation?: string
}

export interface DecisionTreeBlock {
  type: "decision_tree"
  title: string
  rootId: string
  nodes: DecisionTreeNode[]
}

export type KeyPointLevel = "info" | "warning" | "exam_tip" | "common_mistake"

export interface KeyPointBlock {
  type: "key_point"
  level: KeyPointLevel
  title: string
  content: string
}

export interface CodeExampleBlock {
  type: "code_example"
  language: "bash" | "yaml" | "python" | "json" | "sql" | "hcl"
  title?: string
  code: string
  explanation?: string
}

export type ContentBlock =
  | TextBlock
  | ConceptCardBlock
  | ComparisonTableBlock
  | DecisionTreeBlock
  | KeyPointBlock
  | CodeExampleBlock

export interface ModuleSection {
  id: string
  title: string
  estimatedMinutes: number
  blocks: ContentBlock[]
}

export interface StudyModule {
  id: string
  certId: CertificationId
  domainName: string
  title: string
  description: string
  estimatedMinutes: number
  difficulty: "beginner" | "intermediate" | "advanced"
  prerequisites?: string[]
  sections: ModuleSection[]
  relatedLabIds?: string[]
}

export function getModulesByCert(modules: StudyModule[], certId: string): StudyModule[] {
  return modules.filter((m) => m.certId === certId)
}
