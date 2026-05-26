"use client";

import { useEffect, useRef, useState } from "react";
import { useConsoleDemoStore } from "@/lib/stores/useConsoleDemoStore";
import { DEMO_STEPS, PHASES, type PhaseTone } from "./demo-steps-config";
import {
  Check,
  Circle,
  PlayCircle,
  ChevronDown,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<
  PhaseTone,
  { dot: string; text: string; bg: string; border: string; active: string }
> = {
  blue: {
    dot: "bg-[#1A73E8]",
    text: "text-[#1A73E8]",
    bg: "bg-[#E8F0FE]",
    border: "border-[#1A73E8]/30",
    active: "bg-[#E8F0FE] text-[#1A73E8]",
  },
  green: {
    dot: "bg-[#34A853]",
    text: "text-[#137333]",
    bg: "bg-[#E6F4EA]",
    border: "border-[#34A853]/30",
    active: "bg-[#E6F4EA] text-[#137333]",
  },
  purple: {
    dot: "bg-[#9333EA]",
    text: "text-[#9333EA]",
    bg: "bg-[#9333EA]/10",
    border: "border-[#9333EA]/30",
    active: "bg-[#9333EA]/15 text-[#9333EA]",
  },
  yellow: {
    dot: "bg-[#FBBC05]",
    text: "text-[#B26A00]",
    bg: "bg-[#FEF7E0]",
    border: "border-[#FBBC05]/40",
    active: "bg-[#FEF7E0] text-[#B26A00]",
  },
  red: {
    dot: "bg-[#EA4335]",
    text: "text-[#C5221F]",
    bg: "bg-[#FCE8E6]",
    border: "border-[#EA4335]/30",
    active: "bg-[#FCE8E6] text-[#C5221F]",
  },
};

export function StepListSidebar() {
  const currentIdx = useConsoleDemoStore((s) => s.currentStepIndex);
  const setStepIndex = useConsoleDemoStore((s) => s.setStepIndex);
  const currentStep = DEMO_STEPS[currentIdx];
  const [collapsed, setCollapsed] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the current step into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [currentIdx]);

  return (
    <>
      {/* Mobile / md 以下: アコーディオン形式 */}
      <div className="lg:hidden">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs"
        >
          <span className="flex items-center gap-2">
            <ListChecks size={14} className="text-gcp-blue" />
            <span className="font-medium">
              ステップ一覧 ({currentIdx + 1} / {DEMO_STEPS.length})
            </span>
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform text-muted-foreground",
              !collapsed && "rotate-180",
            )}
          />
        </button>
        {!collapsed && (
          <div className="mt-2 rounded-lg border border-border bg-card p-2 space-y-2">
            <PhasesList
              currentIdx={currentIdx}
              setStepIndex={setStepIndex}
              currentPhaseStepId={currentStep.id}
              activeRef={activeRef}
              compact
            />
          </div>
        )}
      </div>

      {/* lg 以上: 常駐サイドバー */}
      <aside className="hidden lg:flex lg:flex-col rounded-lg border border-border bg-card overflow-hidden h-[calc(820px+44px)] sticky top-4">
        <header className="px-3 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ListChecks size={13} className="text-gcp-blue" />
            <span className="text-[12px] font-semibold text-foreground">
              ステップ一覧
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {currentIdx + 1} / {DEMO_STEPS.length}
          </span>
        </header>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <PhasesList
            currentIdx={currentIdx}
            setStepIndex={setStepIndex}
            currentPhaseStepId={currentStep.id}
            activeRef={activeRef}
          />
        </div>
      </aside>
    </>
  );
}

function PhasesList({
  currentIdx,
  setStepIndex,
  currentPhaseStepId,
  activeRef,
  compact,
}: {
  currentIdx: number;
  setStepIndex: (i: number) => void;
  currentPhaseStepId: string;
  activeRef: React.MutableRefObject<HTMLButtonElement | null>;
  compact?: boolean;
}) {
  return (
    <ol className="space-y-2.5">
      {PHASES.map((phase) => {
        const tone = TONE_STYLES[phase.tone];
        const isActivePhase = phase.stepIds.includes(currentPhaseStepId);
        const doneCount = phase.stepIds.filter((sid) => {
          const idx = DEMO_STEPS.findIndex((s) => s.id === sid);
          return idx < currentIdx;
        }).length;
        const total = phase.stepIds.length;
        return (
          <li key={phase.id}>
            {/* Phase header */}
            <div className="flex items-center gap-2 px-2 py-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", tone.dot)} />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider flex-1",
                  isActivePhase ? tone.text : "text-muted-foreground",
                )}
              >
                {phase.label}
              </span>
              <span className="text-[9px] tabular-nums text-muted-foreground">
                {doneCount}/{total}
              </span>
            </div>
            {/* Steps in phase */}
            <ul className="space-y-0.5">
              {phase.stepIds.map((sid) => {
                const step = DEMO_STEPS.find((s) => s.id === sid);
                if (!step) return null;
                const idx = step.order - 1;
                const isActive = idx === currentIdx;
                const isDone = idx < currentIdx;
                return (
                  <li key={sid}>
                    <button
                      ref={isActive ? activeRef : undefined}
                      onClick={() => setStepIndex(idx)}
                      className={cn(
                        "group/step w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                        compact ? "py-1" : "py-1.5",
                        isActive
                          ? tone.active
                          : "text-foreground hover:bg-muted/50",
                      )}
                    >
                      {/* Status icon */}
                      <span className="shrink-0 mt-0.5">
                        {isActive ? (
                          <PlayCircle size={13} className={tone.text} />
                        ) : isDone ? (
                          <Check size={13} className="text-gcp-green" />
                        ) : (
                          <Circle
                            size={13}
                            className="text-muted-foreground/40"
                          />
                        )}
                      </span>
                      {/* Step number + title */}
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-1.5">
                          <span
                            className={cn(
                              "text-[10px] font-mono tabular-nums shrink-0",
                              isActive ? "font-bold" : "text-muted-foreground",
                            )}
                          >
                            {String(step.order).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "text-[11px] leading-tight line-clamp-2",
                              isActive && "font-medium",
                            )}
                          >
                            {step.title}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
