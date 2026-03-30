"use client"

import { useSidebarStore } from "@/lib/stores/useSidebarStore"
import { Breadcrumb } from "./Breadcrumb"

export function MainContent({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebarStore((s) => s.collapsed)

  return (
    <main
      className={`mt-14 min-h-[calc(100vh-3.5rem)] bg-[#f8f9fa] dark:bg-[#202124] transition-[margin-left] duration-200 ${collapsed ? "ml-16" : "ml-64"}`}
    >
      <div className="p-6 max-w-[1400px]">
        <Breadcrumb />
        {children}
      </div>
    </main>
  )
}
