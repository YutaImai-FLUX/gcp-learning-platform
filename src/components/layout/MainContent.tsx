"use client"

import { useSidebarStore } from "@/lib/stores/useSidebarStore"
import { Breadcrumb } from "./Breadcrumb"

export function MainContent({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebarStore((s) => s.collapsed)

  return (
    <main
      className={`mt-14 min-h-[calc(100vh-3.5rem)] transition-[margin-left] duration-200 ml-0 ${collapsed ? "md:ml-16" : "md:ml-64"}`}
      style={{
        background: `
          radial-gradient(ellipse at 15% 0%, var(--accent) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 100%, var(--accent) 0%, transparent 40%),
          var(--background)
        `,
      }}
    >
      <div className="p-3 sm:p-6">
        <Breadcrumb />
        {children}
      </div>
    </main>
  )
}
