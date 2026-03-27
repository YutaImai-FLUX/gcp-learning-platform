import type { CertificationId } from "./quiz"

export interface CertProgress {
  certId: CertificationId
  completedModuleSectionIds: string[]
  completedLabIds: string[]
  quizHighScore?: number
  lastStudiedAt: number
}

export interface UserProgress {
  version: number
  certProgress: Partial<Record<CertificationId, CertProgress>>
}

export const PROGRESS_STORAGE_KEY = "gcp_study_progress_v1"
