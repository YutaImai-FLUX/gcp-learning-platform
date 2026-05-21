"use client";

import { cn } from "@/lib/utils";

interface GcpCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  elevated?: boolean;
}

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function GcpCard({
  children,
  className,
  padding = "md",
  elevated,
}: GcpCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] rounded-lg",
        elevated &&
          "shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]",
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GcpCardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 pb-3 border-b border-[#DADCE0] dark:border-[#3C4043]",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="text-[16px] font-medium text-[#202124] dark:text-white font-display">
          {title}
        </div>
        {description && (
          <div className="text-[12px] text-[#5F6368] dark:text-white/60 mt-1">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
