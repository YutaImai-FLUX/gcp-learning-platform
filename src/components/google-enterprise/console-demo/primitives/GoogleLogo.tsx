"use client";

import { cn } from "@/lib/utils";

interface GoogleLogoProps {
  size?: "sm" | "md" | "lg";
  withCloud?: boolean;
  className?: string;
  monochrome?: "white" | "black";
}

export function GoogleLogo({
  size = "md",
  withCloud,
  className,
  monochrome,
}: GoogleLogoProps) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }[size];

  if (monochrome) {
    return (
      <span
        className={cn(
          "font-display font-medium tracking-tight",
          sizeClass,
          monochrome === "white" ? "text-white" : "text-[#202124]",
          className,
        )}
      >
        Google{withCloud ? " Cloud" : ""}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-display font-medium tracking-tight inline-flex items-baseline",
        sizeClass,
        className,
      )}
    >
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
      {withCloud && (
        <span className="ml-1.5 text-[#5F6368] dark:text-white/80">Cloud</span>
      )}
    </span>
  );
}
