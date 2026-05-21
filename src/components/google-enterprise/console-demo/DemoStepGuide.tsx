"use client";

import type { DemoStep } from "./demo-steps-config";
import {
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

interface DemoStepGuideProps {
  step: DemoStep;
}

export function DemoStepGuide({ step }: DemoStepGuideProps) {
  return (
    <aside className="rounded-lg border border-[#DADCE0] dark:border-[#3C4043] bg-white dark:bg-[#1F1F1F] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F8F9FA] dark:bg-[#28292C] border-b border-[#DADCE0] dark:border-[#3C4043]">
        <div className="text-[10px] font-medium text-[#5F6368] uppercase tracking-wider mb-1">
          STEP {step.order} / 15 · {step.product}
        </div>
        <div className="text-[14px] font-display font-medium text-[#202124] dark:text-white leading-tight">
          {step.title}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#5F6368] font-mono">
          <ExternalLink size={11} />
          <span className="truncate">{step.url}</span>
        </div>
      </div>

      {/* What */}
      <Section
        icon={Lightbulb}
        iconColor="text-[#1A73E8]"
        bgColor="bg-[#E8F0FE]"
        label="このステップで何をするか"
      >
        {step.guide.what}
      </Section>

      {/* Why */}
      <Section
        icon={HelpCircle}
        iconColor="text-[#137333]"
        bgColor="bg-[#E6F4EA]"
        label="なぜ必要か"
      >
        {step.guide.why}
      </Section>

      {/* Pitfall */}
      {step.guide.pitfall && (
        <Section
          icon={AlertTriangle}
          iconColor="text-[#B26A00]"
          bgColor="bg-[#FEF7E0]"
          label="実機の落とし穴"
        >
          {step.guide.pitfall}
        </Section>
      )}
    </aside>
  );
}

function Section({
  icon: Icon,
  iconColor,
  bgColor,
  label,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3 border-b last:border-b-0 border-[#DADCE0] dark:border-[#3C4043]">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}
        >
          <Icon size={13} />
        </span>
        <span className="text-[11px] font-medium text-[#5F6368] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-[#3C4043] dark:text-white/80">
        {children}
      </p>
    </div>
  );
}
