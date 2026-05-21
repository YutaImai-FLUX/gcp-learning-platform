"use client";

import { cn } from "@/lib/utils";

type Tone = "default" | "blue" | "green" | "red" | "yellow" | "neutral";

const toneStyles: Record<Tone, string> = {
  default: "bg-[#E8EAED] text-[#3C4043]",
  blue: "bg-[#E8F0FE] text-[#1A73E8]",
  green: "bg-[#E6F4EA] text-[#137333]",
  red: "bg-[#FCE8E6] text-[#C5221F]",
  yellow: "bg-[#FEF7E0] text-[#B26A00]",
  neutral: "bg-[#F1F3F4] text-[#5F6368]",
};

interface GcpChipProps {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
}

export function GcpChip({
  children,
  tone = "default",
  icon,
  className,
}: GcpChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
