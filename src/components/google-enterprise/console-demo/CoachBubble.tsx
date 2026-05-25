"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  Sparkles,
  AlertTriangle,
  Check,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useConsoleDemoStore } from "@/lib/stores/useConsoleDemoStore";
import type { Callout, CalloutTone } from "./demo-steps-config";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<
  CalloutTone,
  { bar: string; bg: string; text: string; icon: React.ElementType }
> = {
  blue: {
    bar: "bg-[#1A73E8]",
    bg: "bg-[#E8F0FE]",
    text: "text-[#1A73E8]",
    icon: Info,
  },
  green: {
    bar: "bg-[#34A853]",
    bg: "bg-[#E6F4EA]",
    text: "text-[#137333]",
    icon: Check,
  },
  yellow: {
    bar: "bg-[#FBBC05]",
    bg: "bg-[#FEF7E0]",
    text: "text-[#B26A00]",
    icon: Lightbulb,
  },
  red: {
    bar: "bg-[#EA4335]",
    bg: "bg-[#FCE8E6]",
    text: "text-[#C5221F]",
    icon: AlertTriangle,
  },
};

interface CoachBubbleProps {
  callouts: Callout[];
  stepTitle: string;
  stepOrder: number;
}

export function CoachBubble({
  callouts,
  stepTitle,
  stepOrder,
}: CoachBubbleProps) {
  const calloutIndex = useConsoleDemoStore((s) => s.calloutIndex);
  const setCalloutIndex = useConsoleDemoStore((s) => s.setCalloutIndex);
  const nextCallout = useConsoleDemoStore((s) => s.nextCallout);
  const prevCallout = useConsoleDemoStore((s) => s.prevCallout);
  const mode = useConsoleDemoStore((s) => s.mode);
  const paused = useConsoleDemoStore((s) => s.paused);
  const togglePaused = useConsoleDemoStore((s) => s.togglePaused);

  const [collapsed, setCollapsed] = useState(false);

  // Reset to first callout on step change
  useEffect(() => {
    setCalloutIndex(0);
  }, [stepOrder, setCalloutIndex]);

  if (!callouts || callouts.length === 0) return null;

  const current = callouts[Math.min(calloutIndex, callouts.length - 1)];
  const tone = TONE_STYLES[current.tone ?? "blue"];
  const ToneIcon = tone.icon;
  const total = callouts.length;

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#34A853] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="コーチを開く"
      >
        <Sparkles size={22} />
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-[#1A73E8] text-[10px] font-bold flex items-center justify-center border-2 border-[#1A73E8]">
          {total}
        </span>
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${stepOrder}-${calloutIndex}`}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] shadow-[0_8px_28px_rgba(60,64,67,0.25)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#1A73E8] to-[#34A853] text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-base">
            🧑‍🏫
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-[10px] uppercase tracking-wider opacity-80">
              コーチ · Step {stepOrder}
            </div>
            <div className="text-[12px] font-medium truncate">{stepTitle}</div>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-full hover:bg-white/15 flex items-center justify-center"
            aria-label="閉じる"
          >
            <X size={14} />
          </button>
        </div>

        {/* Callout body */}
        <div className="relative">
          <div className={cn("absolute left-0 top-0 bottom-0 w-1", tone.bar)} />
          <div className="px-4 py-3 pl-5 space-y-2">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  tone.bg,
                  tone.text,
                )}
              >
                <ToneIcon size={13} />
              </div>
              <div
                className={cn(
                  "text-[13px] font-medium font-display",
                  tone.text,
                )}
              >
                {current.title}
              </div>
            </div>
            <p className="text-[12px] leading-relaxed text-[#3C4043] dark:text-white/85 pl-7">
              {current.body}
            </p>
          </div>
        </div>

        {/* Footer: progress + controls */}
        <div className="px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#28292C] border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
          {/* Dot progress */}
          <div className="flex items-center gap-1.5">
            {callouts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCalloutIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === calloutIndex
                    ? "w-5 bg-[#1A73E8]"
                    : i < calloutIndex
                      ? "w-1.5 bg-[#1A73E8]/60"
                      : "w-1.5 bg-[#DADCE0] hover:bg-[#5F6368]/40",
                )}
                aria-label={`解説 ${i + 1} へ`}
              />
            ))}
            <span className="ml-2 text-[10px] text-[#5F6368] tabular-nums">
              {calloutIndex + 1} / {total}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {mode === "auto" && (
              <button
                onClick={togglePaused}
                className="w-7 h-7 rounded-full hover:bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center"
                title={paused ? "再生" : "一時停止"}
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            )}
            <button
              onClick={() => prevCallout(total)}
              className="w-7 h-7 rounded-full hover:bg-[#1A73E8]/10 text-[#5F6368] hover:text-[#1A73E8] flex items-center justify-center"
              aria-label="前の解説"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => nextCallout(total)}
              className="w-7 h-7 rounded-full hover:bg-[#1A73E8]/10 text-[#5F6368] hover:text-[#1A73E8] flex items-center justify-center"
              aria-label="次の解説"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
