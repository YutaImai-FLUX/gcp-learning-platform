"use client";

import { cn } from "@/lib/utils";

interface GcpRadioOption {
  value: string;
  label: string;
  description?: string;
}

interface GcpRadioGroupProps {
  legend?: string;
  value: string;
  onChange: (value: string) => void;
  options: GcpRadioOption[];
  name?: string;
}

export function GcpRadioGroup({
  legend,
  value,
  onChange,
  options,
  name = "radio-group",
}: GcpRadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      {legend && (
        <legend className="text-[12px] text-[#5F6368] mb-1">{legend}</legend>
      )}
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className="flex items-start gap-3 cursor-pointer select-none"
          >
            <span
              className={cn(
                "relative mt-0.5 w-4 h-4 rounded-full border-2 transition-colors shrink-0",
                checked
                  ? "border-[#1A73E8]"
                  : "border-[#5F6368] hover:border-[#1A73E8]",
              )}
            >
              {checked && (
                <span className="absolute inset-1 rounded-full bg-[#1A73E8]" />
              )}
            </span>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-[#202124] dark:text-white">
                {opt.label}
              </div>
              {opt.description && (
                <div className="text-[12px] text-[#5F6368] mt-0.5 leading-relaxed">
                  {opt.description}
                </div>
              )}
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
