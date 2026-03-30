import type { CertificationId } from "@/lib/types/quiz"
import type { ConceptCardBlock } from "@/lib/types/study-module"
import { ALL_MODULES } from "@/lib/data/study-modules"

export interface FlashCard {
  id: string
  certId: CertificationId
  domain: string
  term: string
  definition: string
  useCases: string[]
  characteristics: string[]
  examRelevance?: string
}

function extractFlashCards(): FlashCard[] {
  const cards: FlashCard[] = []

  for (const mod of ALL_MODULES) {
    for (const section of mod.sections) {
      for (const block of section.blocks) {
        if (block.type === "concept_card") {
          const cb = block as ConceptCardBlock
          cards.push({
            id: `fc-${mod.certId}-${cards.filter((c) => c.certId === mod.certId).length}`,
            certId: mod.certId,
            domain: mod.domainName,
            term: cb.term,
            definition: cb.definition,
            useCases: cb.useCases,
            characteristics: cb.characteristics,
            examRelevance: cb.examRelevance,
          })
        }
      }
    }
  }

  return cards
}

export const FLASH_CARDS: FlashCard[] = extractFlashCards()

export function getFlashCardsByCert(certId: CertificationId): FlashCard[] {
  return FLASH_CARDS.filter((c) => c.certId === certId)
}

export function getFlashCardsByDomain(certId: CertificationId, domain: string): FlashCard[] {
  return FLASH_CARDS.filter((c) => c.certId === certId && c.domain === domain)
}
