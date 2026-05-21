"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "filled" | "outlined" | "text" | "tonal";
type Size = "sm" | "md" | "lg";

interface GcpButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variantClass: Record<Variant, string> = {
  filled:
    "bg-[#1A73E8] hover:bg-[#1765D0] active:bg-[#1559BB] text-white shadow-sm hover:shadow",
  outlined:
    "bg-transparent border border-[#DADCE0] hover:border-[#1A73E8] hover:bg-[#F8FBFF] text-[#1A73E8]",
  text: "bg-transparent hover:bg-[#F8FBFF] text-[#1A73E8]",
  tonal: "bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-7 px-3 text-[12px]",
  md: "h-9 px-6 text-[14px]",
  lg: "h-10 px-6 text-[14px]",
};

export const GcpButton = forwardRef<HTMLButtonElement, GcpButtonProps>(
  function GcpButton(
    {
      variant = "filled",
      size = "md",
      leadingIcon,
      trailingIcon,
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded font-medium font-display tracking-[0.0107em] transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40",
          variantClass[variant],
          sizeClass[size],
          disabled && "opacity-40 pointer-events-none",
          className,
        )}
        {...rest}
      >
        {leadingIcon && <span className="-ml-1 shrink-0">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span className="-mr-1 shrink-0">{trailingIcon}</span>}
      </button>
    );
  },
);
