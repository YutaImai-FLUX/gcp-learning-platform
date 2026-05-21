"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  CreditCard,
  ShieldCheck,
  Plug,
  Brain,
  Bot,
  Sparkles,
  Building2,
  ChevronRight,
  Pin,
} from "lucide-react";
import { useConsoleDemoStore } from "@/lib/stores/useConsoleDemoStore";
import { DEMO_STEPS } from "../demo-steps-config";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  /** クリックで遷移するステップ ID (DEMO_STEPS の id) */
  targetStepId?: string;
  /** このナビ項目に紐づくステップ ID 群 (ハイライト判定で使用) */
  relatedStepIds?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "ダッシュボード",
    icon: Home,
    targetStepId: "org-confirm",
    relatedStepIds: ["org-confirm", "project-create"],
  },
  {
    id: "billing",
    label: "お支払い",
    icon: CreditCard,
    targetStepId: "billing-create",
    relatedStepIds: ["billing-create"],
  },
  {
    id: "iam",
    label: "IAM と管理",
    icon: ShieldCheck,
    targetStepId: "wif-pool",
    relatedStepIds: ["wif-pool", "wif-provider", "org-confirm"],
  },
  {
    id: "apis",
    label: "API とサービス",
    icon: Plug,
    targetStepId: "api-enable",
    relatedStepIds: ["api-enable"],
  },
  {
    id: "vertex",
    label: "Vertex AI",
    icon: Brain,
  },
  {
    id: "ai-app",
    label: "AI Application",
    icon: Bot,
    targetStepId: "ai-app-create",
    relatedStepIds: ["ai-app-create", "datastore-create", "bind-datastore"],
  },
  {
    id: "ge",
    label: "Gemini Enterprise",
    icon: Sparkles,
    targetStepId: "ge-subscription",
    relatedStepIds: ["ge-subscription", "user-licensing"],
  },
  {
    id: "org",
    label: "リソース管理",
    icon: Building2,
    targetStepId: "org-confirm",
    relatedStepIds: ["org-confirm"],
  },
];

interface GcpSideNavProps {
  highlightId?: string;
  expanded?: boolean;
}

export function GcpSideNav({ highlightId, expanded = true }: GcpSideNavProps) {
  const setStepIndex = useConsoleDemoStore((s) => s.setStepIndex);

  const handleNavClick = (item: NavItem) => {
    if (!item.targetStepId) return;
    const targetIdx = DEMO_STEPS.findIndex((s) => s.id === item.targetStepId);
    if (targetIdx >= 0) setStepIndex(targetIdx);
  };

  return (
    <aside
      className={cn(
        "shrink-0 bg-white dark:bg-[#1F1F1F] border-r border-[#DADCE0] dark:border-[#3C4043] flex flex-col transition-all duration-200",
        expanded ? "w-[256px]" : "w-[68px]",
      )}
    >
      {/* PINNED heading */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        {expanded ? (
          <span className="text-[11px] font-medium text-[#5F6368] uppercase tracking-wider">
            PINNED
          </span>
        ) : (
          <Pin size={12} className="text-[#5F6368] mx-auto" />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = highlightId === item.id;
          const isClickable = !!item.targetStepId;
          return (
            <div
              key={item.id}
              className={cn(
                "relative mx-2 my-0.5 rounded-r-full transition-colors",
                active
                  ? "bg-[#E8F0FE] dark:bg-[#1A73E8]/15"
                  : isClickable
                    ? "hover:bg-[#F1F3F4] dark:hover:bg-white/5"
                    : "",
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A73E8] rounded-r" />
              )}
              <button
                onClick={() => handleNavClick(item)}
                disabled={!isClickable}
                className={cn(
                  "w-full flex items-center gap-4 pl-4 pr-3 py-2 text-left transition-colors",
                  active
                    ? "text-[#1A73E8]"
                    : isClickable
                      ? "text-[#3C4043] dark:text-white/80 hover:text-[#1A73E8]"
                      : "text-[#5F6368]/50 cursor-not-allowed",
                )}
                title={
                  isClickable
                    ? `${item.label} に関連するステップへ移動`
                    : `${item.label} (このデモでは扱いません)`
                }
              >
                <Icon size={18} className="shrink-0" />
                {expanded && (
                  <span
                    className={cn(
                      "text-[14px] flex-1 truncate",
                      active && "font-medium",
                    )}
                  >
                    {item.label}
                  </span>
                )}
                {expanded && item.id === "iam" && (
                  <ChevronRight size={14} className="text-[#5F6368] shrink-0" />
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
