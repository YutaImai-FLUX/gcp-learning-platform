"use client";

import { cn } from "@/lib/utils";
import { Globe, LogOut, Settings } from "lucide-react";

interface DnsProviderShellProps {
  domain: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function DnsProviderShell({
  domain,
  title,
  description,
  children,
  className,
}: DnsProviderShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden bg-[#FAFAFA] dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] shadow-sm",
        className,
      )}
    >
      {/* URL bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#F1F3F4] dark:bg-[#28292C] border-b border-[#DADCE0] dark:border-[#3C4043] text-[12px] text-[#5F6368]">
        <Globe size={12} />
        <span className="font-mono">navi.onamae.com/domain/dns</span>
      </div>

      {/* Provider header (orange theme) */}
      <header className="bg-[#1F4E8A] text-white">
        <div className="px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#F39200] flex items-center justify-center text-white font-bold text-[10px]">
              .com
            </div>
            <span className="font-bold text-[14px] tracking-tight">
              お名前.com Navi
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <span className="opacity-80">user@example.co.jp</span>
            <button className="hover:opacity-80 flex items-center gap-1">
              <Settings size={13} /> 設定
            </button>
            <button className="hover:opacity-80 flex items-center gap-1">
              <LogOut size={13} /> ログアウト
            </button>
          </div>
        </div>
        <nav className="bg-white/10 px-5 flex items-center gap-5 text-[12px]">
          {["TOP", "ドメイン", "DNS設定", "サーバー", "メール", "請求"].map(
            (t) => (
              <button
                key={t}
                className={cn(
                  "py-2.5 border-b-2",
                  t === "DNS設定"
                    ? "border-[#F39200] font-bold"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
              >
                {t}
              </button>
            ),
          )}
        </nav>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-[12px] text-[#5F6368] mb-1">
          DNS設定 / レコード設定 /{" "}
          <span className="text-[#202124] dark:text-white font-medium">
            {domain}
          </span>
        </div>
        <h1 className="text-[20px] font-display text-[#202124] dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-[13px] text-[#5F6368] mt-1">{description}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
