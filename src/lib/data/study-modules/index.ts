export { ACE_MODULES } from "./ace-modules"
export { PCSE_MODULES } from "./pcse-modules"
export { PCA_MODULES } from "./pca-modules"
export { PDE_MODULES } from "./pde-modules"
export { CDL_MODULES } from "./cdl-modules"
export { PMLE_MODULES } from "./pmle-modules"
export { PCNE_MODULES } from "./pcne-modules"
export { PCD_MODULES } from "./pcd-modules"

import { ACE_MODULES } from "./ace-modules"
import { PCSE_MODULES } from "./pcse-modules"
import { PCA_MODULES } from "./pca-modules"
import { PDE_MODULES } from "./pde-modules"
import { CDL_MODULES } from "./cdl-modules"
import { PMLE_MODULES } from "./pmle-modules"
import { PCNE_MODULES } from "./pcne-modules"
import { PCD_MODULES } from "./pcd-modules"
import type { StudyModule } from "@/lib/types/study-module"
import type { CertificationId } from "@/lib/types/quiz"

export const ALL_MODULES: StudyModule[] = [
  ...ACE_MODULES,
  ...PCSE_MODULES,
  ...PCA_MODULES,
  ...PDE_MODULES,
  ...CDL_MODULES,
  ...PMLE_MODULES,
  ...PCNE_MODULES,
  ...PCD_MODULES,
]

export function getModulesByCert(certId: CertificationId): StudyModule[] {
  return ALL_MODULES.filter((m) => m.certId === certId)
}

export function getModuleById(id: string): StudyModule | undefined {
  return ALL_MODULES.find((m) => m.id === id)
}
