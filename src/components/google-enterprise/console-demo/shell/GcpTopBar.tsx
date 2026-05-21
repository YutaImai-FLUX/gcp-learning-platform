"use client";

import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Terminal,
  Grid3x3,
  ChevronDown,
} from "lucide-react";
import { GoogleLogo } from "../primitives/GoogleLogo";

interface GcpTopBarProps {
  projectLabel?: string;
  organizationLabel?: string;
  onToggleNav?: () => void;
}

export function GcpTopBar({
  projectLabel = "gemini-poc-prod",
  organizationLabel = "yamatoseiki.co.jp",
  onToggleNav,
}: GcpTopBarProps) {
  return (
    <header className="flex items-center h-12 bg-[#202124] text-white border-b border-black/30 shrink-0">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3 pl-2 pr-4">
        <button
          onClick={onToggleNav}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center"
          aria-label="メインメニュー"
        >
          <Menu size={20} />
        </button>
        <GoogleLogo monochrome="white" withCloud size="md" />
      </div>

      {/* Project selector */}
      <button className="flex items-center gap-1 px-3 h-8 rounded-md bg-white/[0.07] hover:bg-white/[0.12] text-[13px] font-normal">
        <span className="text-white/60 text-[12px]">{organizationLabel}</span>
        <span className="text-white/60">/</span>
        <span className="text-white">{projectLabel}</span>
        <ChevronDown size={14} className="ml-0.5 text-white/60" />
      </button>

      {/* Center: search */}
      <div className="flex-1 mx-4 max-w-2xl">
        <div className="flex items-center gap-2 h-8 px-3 rounded-md bg-white/[0.07] text-white/70 text-[13px] hover:bg-white/[0.10]">
          <Search size={16} />
          <span>リソース、ドキュメント、プロダクト、その他を検索</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">
            /
          </span>
        </div>
      </div>

      {/* Right: action icons */}
      <div className="flex items-center gap-1 pr-3">
        <IconButton ariaLabel="Cloud Shell">
          <Terminal size={18} />
        </IconButton>
        <IconButton ariaLabel="通知">
          <Bell size={18} />
        </IconButton>
        <IconButton ariaLabel="ヘルプ">
          <HelpCircle size={18} />
        </IconButton>
        <IconButton ariaLabel="Google アプリ">
          <Grid3x3 size={18} />
        </IconButton>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#34A853] flex items-center justify-center text-[12px] font-medium ml-1">
          A
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="w-10 h-10 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center"
    >
      {children}
    </button>
  );
}
