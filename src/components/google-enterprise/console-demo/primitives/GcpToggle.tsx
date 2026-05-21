"use client";

import { cn } from "@/lib/utils";

interface GcpToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

export function GcpToggle({
  checked,
  onChange,
  disabled,
  label,
  description,
  size = "md",
}: GcpToggleProps) {
  const w = size === "sm" ? "w-8" : "w-10";
  const h = size === "sm" ? "h-4" : "h-5";
  const knob = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const translateOn = size === "sm" ? "translate-x-4" : "translate-x-5";
  const trackOn = "bg-[#1A73E8]";
  const trackOff = "bg-[#80868B]";

  const body = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40",
        w,
        h,
        checked ? trackOn : trackOff,
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-150",
          knob,
          checked && translateOn,
        )}
      />
    </button>
  );

  if (!label && !description) return body;

  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <div className="mt-0.5">{body}</div>
      <div className="flex-1">
        {label && (
          <div className="text-[14px] text-[#202124] dark:text-white">
            {label}
          </div>
        )}
        {description && (
          <div className="text-[12px] text-[#5F6368] dark:text-white/60 mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
      </div>
    </label>
  );
}
