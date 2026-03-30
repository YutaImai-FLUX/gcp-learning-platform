"use client"

import { Badge } from "@/components/ui/badge"

interface DomainFilterProps {
  domains: string[]
  selected: string | null
  onSelect: (domain: string | null) => void
  color?: string
}

export function DomainFilter({ domains, selected, onSelect, color = "#4285F4" }: DomainFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onSelect(null)}>
        <Badge
          variant={selected === null ? "default" : "secondary"}
          className="text-xs cursor-pointer transition-colors"
          style={selected === null ? { backgroundColor: color, color: "#fff" } : {}}
        >
          全ドメイン
        </Badge>
      </button>
      {domains.map((domain) => {
        const shortName = domain.length > 15 ? domain.slice(0, 14) + "…" : domain
        return (
          <button key={domain} onClick={() => onSelect(domain)}>
            <Badge
              variant={selected === domain ? "default" : "secondary"}
              className="text-xs cursor-pointer transition-colors"
              style={selected === domain ? { backgroundColor: color, color: "#fff" } : {}}
            >
              {shortName}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
