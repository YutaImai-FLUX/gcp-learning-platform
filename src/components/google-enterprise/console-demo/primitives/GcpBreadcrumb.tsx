"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GcpBreadcrumbProps {
  items: string[];
  className?: string;
}

export function GcpBreadcrumb({ items, className }: GcpBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-[12px] text-[#5F6368] dark:text-white/60 flex-wrap gap-y-1",
        className,
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center">
            <span
              className={cn(
                isLast
                  ? "text-[#202124] dark:text-white font-medium"
                  : "hover:text-[#1A73E8] cursor-pointer",
              )}
            >
              {item}
            </span>
            {!isLast && (
              <ChevronRight size={14} className="mx-1 text-[#5F6368]/60" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
