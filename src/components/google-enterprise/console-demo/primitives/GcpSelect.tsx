"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GcpSelectOption {
  value: string;
  label: string;
}

interface GcpSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: GcpSelectOption[];
  required?: boolean;
  helperText?: string;
  className?: string;
}

export function GcpSelect({
  label,
  value,
  onChange,
  options,
  required,
  helperText,
  className,
}: GcpSelectProps) {
  const id = useId();
  return (
    <div className={cn("w-full", className)}>
      <div className="relative rounded border border-[#DADCE0] hover:border-[#80868B] focus-within:border-[#1A73E8] focus-within:ring-1 focus-within:ring-[#1A73E8] bg-white dark:bg-[#1F1F1F] transition-colors">
        <label
          htmlFor={id}
          className="absolute top-0 left-2 -translate-y-1/2 bg-white dark:bg-[#1F1F1F] px-1 text-[11px] text-[#5F6368] pointer-events-none"
        >
          {label}
          {required && <span className="text-[#D93025] ml-0.5">*</span>}
        </label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent px-3 py-2 pr-9 text-[14px] text-[#202124] dark:text-white outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] pointer-events-none"
        />
      </div>
      {helperText && (
        <div className="mt-1 px-3 text-[11px] text-[#5F6368]">{helperText}</div>
      )}
    </div>
  );
}
