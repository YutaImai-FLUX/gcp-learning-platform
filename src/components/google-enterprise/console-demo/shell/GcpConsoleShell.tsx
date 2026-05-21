"use client";

import { useState } from "react";
import { GcpTopBar } from "./GcpTopBar";
import { GcpSideNav } from "./GcpSideNav";
import { GcpBreadcrumb } from "../primitives/GcpBreadcrumb";
import { cn } from "@/lib/utils";

interface GcpConsoleShellProps {
  navHighlightId?: string;
  breadcrumb: string[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  projectLabel?: string;
  organizationLabel?: string;
  children: React.ReactNode;
  /** Hide subheader divider when body has its own structure */
  bare?: boolean;
  className?: string;
}

export function GcpConsoleShell({
  navHighlightId,
  breadcrumb,
  title,
  description,
  actions,
  projectLabel,
  organizationLabel,
  children,
  bare,
  className,
}: GcpConsoleShellProps) {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden border border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] shadow-sm",
        className,
      )}
    >
      <GcpTopBar
        projectLabel={projectLabel}
        organizationLabel={organizationLabel}
        onToggleNav={() => setNavOpen((v) => !v)}
      />
      <div className="flex flex-1 min-h-0">
        <GcpSideNav highlightId={navHighlightId} expanded={navOpen} />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#1F1F1F]">
          {/* Breadcrumb */}
          <div className="px-6 pt-4 pb-2">
            <GcpBreadcrumb items={breadcrumb} />
          </div>
          {/* Title + actions */}
          <div className="px-6 pb-3 flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-[22px] leading-tight font-display text-[#202124] dark:text-white font-normal">
                {title}
              </h1>
              {description && (
                <p className="text-[13px] text-[#5F6368] dark:text-white/60 mt-1 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 shrink-0">{actions}</div>
            )}
          </div>
          {!bare && (
            <div className="border-b border-[#DADCE0] dark:border-[#3C4043]" />
          )}
          {/* Body */}
          <div className="px-6 py-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
