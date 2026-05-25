"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOTAL_STEPS } from "@/components/google-enterprise/console-demo/demo-steps-config";

export type DemoMode = "manual" | "auto";
export type DemoSpeed = "slow" | "normal" | "fast";

export const SPEED_MS: Record<DemoSpeed, { step: number; callout: number }> = {
  slow: { step: 16000, callout: 5500 },
  normal: { step: 10000, callout: 3500 },
  fast: { step: 6000, callout: 2200 },
};

interface ConsoleDemoStore {
  currentStepIndex: number;
  mode: DemoMode;
  speed: DemoSpeed;
  paused: boolean;
  calloutIndex: number;

  setStepIndex: (idx: number) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;

  setMode: (m: DemoMode) => void;
  setSpeed: (s: DemoSpeed) => void;
  togglePaused: () => void;
  setPaused: (p: boolean) => void;

  setCalloutIndex: (i: number) => void;
  nextCallout: (total: number) => void;
  prevCallout: (total: number) => void;
}

export const useConsoleDemoStore = create<ConsoleDemoStore>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      mode: "manual",
      speed: "normal",
      paused: false,
      calloutIndex: 0,

      setStepIndex: (idx) =>
        set({
          currentStepIndex: Math.max(0, Math.min(idx, TOTAL_STEPS - 1)),
          calloutIndex: 0,
        }),

      next: () => {
        const cur = get().currentStepIndex;
        set({
          currentStepIndex: Math.min(cur + 1, TOTAL_STEPS - 1),
          calloutIndex: 0,
        });
      },

      prev: () => {
        const cur = get().currentStepIndex;
        set({
          currentStepIndex: Math.max(0, cur - 1),
          calloutIndex: 0,
        });
      },

      reset: () =>
        set({
          currentStepIndex: 0,
          calloutIndex: 0,
          paused: false,
        }),

      setMode: (m) =>
        set({
          mode: m,
          paused: false,
          calloutIndex: 0,
        }),

      setSpeed: (s) => set({ speed: s }),

      togglePaused: () => set({ paused: !get().paused }),

      setPaused: (p) => set({ paused: p }),

      setCalloutIndex: (i) => set({ calloutIndex: Math.max(0, i) }),

      nextCallout: (total) => {
        if (total <= 0) return;
        const cur = get().calloutIndex;
        set({ calloutIndex: (cur + 1) % total });
      },

      prevCallout: (total) => {
        if (total <= 0) return;
        const cur = get().calloutIndex;
        set({ calloutIndex: (cur - 1 + total) % total });
      },
    }),
    {
      name: "ge-console-demo",
      partialize: (s) => ({
        currentStepIndex: s.currentStepIndex,
        mode: s.mode,
        speed: s.speed,
      }),
    },
  ),
);
