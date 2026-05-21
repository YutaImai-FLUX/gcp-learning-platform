"use client";

import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { GoogleLogo } from "../primitives/GoogleLogo";

interface WorkspaceSignupShellProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceSignupShell({
  step,
  totalSteps,
  stepLabel,
  title,
  description,
  children,
  className,
}: WorkspaceSignupShellProps) {
  const pct = (step / totalSteps) * 100;
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] shadow-sm",
        className,
      )}
    >
      {/* URL bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#F1F3F4] dark:bg-[#28292C] border-b border-[#DADCE0] dark:border-[#3C4043] text-[12px] text-[#5F6368]">
        <Globe size={12} />
        <span className="font-mono">
          workspace.google.com/signup/cloudidentity
        </span>
      </div>

      {/* Header logo */}
      <div className="border-b border-[#DADCE0] dark:border-[#3C4043] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GoogleLogo size="md" />
          <span className="ml-1 text-[14px] text-[#5F6368]">
            Cloud Identity
          </span>
        </div>
        <span className="text-[12px] text-[#5F6368]">
          ステップ{" "}
          <span className="font-medium text-[#202124] dark:text-white">
            {step}/{totalSteps}
          </span>{" "}
          · {stepLabel}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-[#E8EAED]">
        <div
          className="h-full bg-[#1A73E8] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1F1F1F]">
        <div className="max-w-3xl mx-auto px-8 py-10">
          <h1 className="text-[28px] font-display text-[#202124] dark:text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-[#5F6368] dark:text-white/60 mt-2">
              {description}
            </p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
