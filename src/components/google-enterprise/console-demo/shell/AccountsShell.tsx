"use client";

import { cn } from "@/lib/utils";
import { GoogleLogo } from "../primitives/GoogleLogo";
import { Globe } from "lucide-react";

interface AccountsShellProps {
  title: string;
  description?: string;
  illustrationCaption?: string;
  children: React.ReactNode;
  className?: string;
}

export function AccountsShell({
  title,
  description,
  illustrationCaption,
  children,
  className,
}: AccountsShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden bg-white dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] shadow-sm",
        className,
      )}
    >
      {/* Top URL bar pretend */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#F1F3F4] dark:bg-[#28292C] border-b border-[#DADCE0] dark:border-[#3C4043] text-[12px] text-[#5F6368]">
        <Globe size={12} />
        <span className="font-mono">accounts.google.com/signup</span>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#202124] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] rounded-3xl px-12 py-10 shadow-sm grid md:grid-cols-[1fr_220px] gap-8">
          {/* Left: form */}
          <div className="space-y-6">
            <GoogleLogo size="lg" />
            <div>
              <h1 className="text-[24px] font-display text-[#202124] dark:text-white leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-[14px] text-[#5F6368] dark:text-white/60 mt-2">
                  {description}
                </p>
              )}
            </div>
            {children}
          </div>
          {/* Right: illustration */}
          <div className="hidden md:flex flex-col items-center justify-center text-center gap-3 pt-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4285F4]/15 via-[#EA4335]/10 to-[#FBBC05]/15 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-[#1F1F1F] shadow-inner flex items-center justify-center text-3xl">
                👤
              </div>
            </div>
            {illustrationCaption && (
              <p className="text-[12px] text-[#5F6368] leading-relaxed">
                {illustrationCaption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
