"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOTAL_STEPS } from "@/components/google-enterprise/console-demo/demo-steps-config";

interface ConsoleDemoStore {
  currentStepIndex: number;
  setStepIndex: (idx: number) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export const useConsoleDemoStore = create<ConsoleDemoStore>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      setStepIndex: (idx) =>
        set({ currentStepIndex: Math.max(0, Math.min(idx, TOTAL_STEPS - 1)) }),
      next: () => {
        const cur = get().currentStepIndex;
        set({ currentStepIndex: Math.min(cur + 1, TOTAL_STEPS - 1) });
      },
      prev: () => {
        const cur = get().currentStepIndex;
        set({ currentStepIndex: Math.max(0, cur - 1) });
      },
      reset: () => set({ currentStepIndex: 0 }),
    }),
    {
      name: "ge-console-demo",
    },
  ),
);
