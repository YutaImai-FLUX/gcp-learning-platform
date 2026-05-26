"use client";

import { useEffect } from "react";
import {
  useConsoleDemoStore,
  SPEED_MS,
  type DemoMode,
  type DemoSpeed,
} from "@/lib/stores/useConsoleDemoStore";
import { DEMO_STEPS, TOTAL_STEPS } from "./demo-steps-config";
import { DemoStepGuide } from "./DemoStepGuide";
import { CoachBubble } from "./CoachBubble";
import { StepListSidebar } from "./StepListSidebar";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Hand,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Step01_GoogleAccountCreate } from "./steps/Step01_GoogleAccountCreate";
import { Step02_CloudIdentitySignup } from "./steps/Step02_CloudIdentitySignup";
import { Step03_DomainTxtVerify } from "./steps/Step03_DomainTxtVerify";
import { Step04_OrgConfirm } from "./steps/Step04_OrgConfirm";
import { Step05_BillingCreate } from "./steps/Step05_BillingCreate";
import { Step06_ProjectCreate } from "./steps/Step06_ProjectCreate";
import { Step07_ApiLibrary } from "./steps/Step07_ApiLibrary";
import { Step08_WorkforcePoolCreate } from "./steps/Step08_WorkforcePoolCreate";
import { Step09_ProviderAdd } from "./steps/Step09_ProviderAdd";
import { Step10_GeSubscription } from "./steps/Step10_GeSubscription";
import { Step11_UserLicensing } from "./steps/Step11_UserLicensing";
import { Step12_AiAppCreate } from "./steps/Step12_AiAppCreate";
import { Step13_DataStoreCreate } from "./steps/Step13_DataStoreCreate";
import { Step14_BindDataStore } from "./steps/Step14_BindDataStore";
import { Step15_SearchPreview } from "./steps/Step15_SearchPreview";
import { Step15_NotebookLmSubscription } from "./steps/Step15_NotebookLmSubscription";
import { Step16_BudgetAlerts } from "./steps/Step16_BudgetAlerts";
import { Step17_OrgPolicy } from "./steps/Step17_OrgPolicy";
import { Step18_IamRoles } from "./steps/Step18_IamRoles";
import { Step19_ScimProvision } from "./steps/Step19_ScimProvision";
import { Step20_CmekVpcSc } from "./steps/Step20_CmekVpcSc";
import { Step21_AuditLog } from "./steps/Step21_AuditLog";
import { Step22_QualityKpi } from "./steps/Step22_QualityKpi";
import { Step23_ChangeMgmt } from "./steps/Step23_ChangeMgmt";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  "google-account": Step01_GoogleAccountCreate,
  "cloud-identity-signup": Step02_CloudIdentitySignup,
  "domain-verify": Step03_DomainTxtVerify,
  "org-confirm": Step04_OrgConfirm,
  "billing-create": Step05_BillingCreate,
  "budget-alerts": Step16_BudgetAlerts,
  "project-create": Step06_ProjectCreate,
  "org-policy": Step17_OrgPolicy,
  "api-enable": Step07_ApiLibrary,
  "iam-roles": Step18_IamRoles,
  "wif-pool": Step08_WorkforcePoolCreate,
  "scim-provision": Step19_ScimProvision,
  "wif-provider": Step09_ProviderAdd,
  "ge-subscription": Step10_GeSubscription,
  "notebooklm-subscription": Step15_NotebookLmSubscription,
  "user-licensing": Step11_UserLicensing,
  "ai-app-create": Step12_AiAppCreate,
  "datastore-create": Step13_DataStoreCreate,
  "cmek-vpc-sc": Step20_CmekVpcSc,
  "bind-datastore": Step14_BindDataStore,
  "search-preview": Step15_SearchPreview,
  "audit-log": Step21_AuditLog,
  "quality-kpi": Step22_QualityKpi,
  "change-mgmt": Step23_ChangeMgmt,
};

export function DemoFrame() {
  const idx = useConsoleDemoStore((s) => s.currentStepIndex);
  const next = useConsoleDemoStore((s) => s.next);
  const prev = useConsoleDemoStore((s) => s.prev);
  const reset = useConsoleDemoStore((s) => s.reset);
  const setStepIndex = useConsoleDemoStore((s) => s.setStepIndex);
  const mode = useConsoleDemoStore((s) => s.mode);
  const speed = useConsoleDemoStore((s) => s.speed);
  const paused = useConsoleDemoStore((s) => s.paused);
  const calloutIndex = useConsoleDemoStore((s) => s.calloutIndex);
  const nextCallout = useConsoleDemoStore((s) => s.nextCallout);
  const setMode = useConsoleDemoStore((s) => s.setMode);
  const setSpeed = useConsoleDemoStore((s) => s.setSpeed);
  const togglePaused = useConsoleDemoStore((s) => s.togglePaused);
  const step = DEMO_STEPS[idx];
  const StepComponent = STEP_COMPONENTS[step.id];
  const calloutTotal = step.callouts.length;
  const isLastStep = idx === TOTAL_STEPS - 1;

  // Auto progression: cycle callouts, then advance step
  useEffect(() => {
    if (mode !== "auto" || paused) return;
    const timing = SPEED_MS[speed];
    const isLastCallout = calloutIndex >= calloutTotal - 1;
    const delay = isLastCallout ? timing.step : timing.callout;
    const t = setTimeout(() => {
      if (isLastCallout) {
        if (!isLastStep) next();
      } else {
        nextCallout(calloutTotal);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [
    mode,
    speed,
    paused,
    calloutIndex,
    calloutTotal,
    isLastStep,
    next,
    nextCallout,
  ]);

  return (
    <div className="space-y-4">
      {/* Demo control header */}
      <div className="rounded-lg border border-border bg-card p-3 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Play size={12} className="text-gcp-blue" />
            <span className="font-mono font-semibold">
              STEP {step.order} / {TOTAL_STEPS}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-foreground font-medium">{step.title}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <ModeToggle value={mode} onChange={setMode} />
            {mode === "auto" && (
              <>
                <SpeedToggle value={speed} onChange={setSpeed} />
                <button
                  onClick={togglePaused}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border transition-colors",
                    paused
                      ? "border-gcp-blue bg-gcp-blue text-white hover:bg-gcp-blue-dark"
                      : "border-border bg-card hover:bg-muted/60"
                  )}
                  title={paused ? "再生" : "一時停止"}
                >
                  {paused ? (
                    <>
                      <Play size={12} />
                      再生
                    </>
                  ) : (
                    <>
                      <Pause size={12} />
                      一時停止
                    </>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (confirm("デモを最初からやり直しますか？")) reset();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              title="リセット"
            >
              <RotateCcw size={12} />
              リセット
            </button>
            <button
              onClick={prev}
              disabled={idx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs border border-border bg-card hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} />
              前へ
            </button>
            <button
              onClick={next}
              disabled={idx === TOTAL_STEPS - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-gcp-blue text-white hover:bg-gcp-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              次へ
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEMO_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStepIndex(i)}
              className="group/dot relative"
              title={`${s.order}. ${s.title}`}
            >
              <span
                className={cn(
                  "block w-2 h-2 rounded-full transition-all",
                  i < idx && "bg-gcp-green",
                  i === idx && "bg-gcp-blue w-6",
                  i > idx && "bg-border group-hover/dot:bg-foreground/30",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main canvas: step list (left) + shell (center) + guide (right) */}
      <div className="grid lg:grid-cols-[240px_1fr_300px] gap-4">
        <StepListSidebar />
        <div className="h-[760px] min-h-[600px] lg:h-[820px]">
          {StepComponent ? (
            <StepComponent />
          ) : (
            <div className="h-full rounded-lg border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
              Step component not found: {step.id}
            </div>
          )}
        </div>
        <DemoStepGuide step={step} />
      </div>

      {/* Coach bubble (floating, bottom-right) */}
      <CoachBubble
        callouts={step.callouts}
        stepTitle={step.title}
        stepOrder={step.order}
      />
    </div>
  );
}

function ModeToggle({
  value,
  onChange,
}: {
  value: DemoMode;
  onChange: (m: DemoMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-[11px]">
      <button
        onClick={() => onChange("manual")}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors",
          value === "manual"
            ? "bg-foreground text-background font-medium"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="マニュアル: 自分で「次へ」を押して進める"
      >
        <Hand size={11} />
        マニュアル
      </button>
      <button
        onClick={() => onChange("auto")}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors",
          value === "auto"
            ? "bg-gcp-blue text-white font-medium"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="オート: 解説と画面が自動で切替"
      >
        <Zap size={11} />
        オート
      </button>
    </div>
  );
}

function SpeedToggle({
  value,
  onChange,
}: {
  value: DemoSpeed;
  onChange: (s: DemoSpeed) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-[10px]">
      {(["slow", "normal", "fast"] as const).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            "px-2 py-1 rounded-full transition-colors",
            value === s
              ? "bg-gcp-blue/15 text-gcp-blue font-medium"
              : "text-muted-foreground hover:text-foreground",
          )}
          title={
            s === "slow"
              ? "ゆっくり (約 16s / step)"
              : s === "normal"
                ? "標準 (約 10s / step)"
                : "速い (約 6s / step)"
          }
        >
          {s === "slow" ? "遅" : s === "normal" ? "中" : "速"}
        </button>
      ))}
    </div>
  );
}
