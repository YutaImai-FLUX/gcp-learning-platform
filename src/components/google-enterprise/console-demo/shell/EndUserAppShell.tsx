"use client";

import { cn } from "@/lib/utils";
import { Globe, Sparkles, HelpCircle } from "lucide-react";

interface EndUserAppShellProps {
  appName: string;
  userName?: string;
  userAvatar?: string;
  children: React.ReactNode;
  className?: string;
}

export function EndUserAppShell({
  appName,
  userName = "佐藤 美咲",
  userAvatar = "佐",
  children,
  className,
}: EndUserAppShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden bg-[#F8F9FB] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] shadow-sm",
        className,
      )}
    >
      {/* URL bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#F1F3F4] dark:bg-[#28292C] border-b border-[#DADCE0] dark:border-[#3C4043] text-[12px] text-[#5F6368]">
        <Globe size={12} />
        <span className="font-mono truncate">
          {appName.toLowerCase().replace(/\s+/g, "-")}
          .app.gemini.cloud.google.com
        </span>
      </div>

      {/* App header */}
      <header className="bg-white dark:bg-[#1F1F1F] border-b border-[#DADCE0] dark:border-[#3C4043] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A73E8] via-[#34A853] to-[#FBBC05] flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
              {appName}
            </div>
            <div className="text-[10px] text-[#5F6368]">Gemini Enterprise</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="ヘルプ"
            className="w-9 h-9 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-white/10 flex items-center justify-center text-[#5F6368]"
          >
            <HelpCircle size={18} />
          </button>
          <div className="flex items-center gap-2 pl-2">
            <span className="text-[12px] text-[#5F6368]">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-[#34A853] flex items-center justify-center text-white text-[12px] font-medium">
              {userAvatar}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
