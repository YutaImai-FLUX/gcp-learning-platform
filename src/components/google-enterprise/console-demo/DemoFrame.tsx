"use client";

import { useConsoleDemoStore } from "@/lib/stores/useConsoleDemoStore";
import { DEMO_STEPS, TOTAL_STEPS } from "./demo-steps-config";
import { DemoStepGuide } from "./DemoStepGuide";
import { ChevronLeft, ChevronRight, RotateCcw, Play } from "lucide-react";
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

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  "google-account": Step01_GoogleAccountCreate,
  "cloud-identity-signup": Step02_CloudIdentitySignup,
  "domain-verify": Step03_DomainTxtVerify,
  "org-confirm": Step04_OrgConfirm,
  "billing-create": Step05_BillingCreate,
  "project-create": Step06_ProjectCreate,
  "api-enable": Step07_ApiLibrary,
  "wif-pool": Step08_WorkforcePoolCreate,
  "wif-provider": Step09_ProviderAdd,
  "ge-subscription": Step10_GeSubscription,
  "user-licensing": Step11_UserLicensing,
  "ai-app-create": Step12_AiAppCreate,
  "datastore-create": Step13_DataStoreCreate,
  "bind-datastore": Step14_BindDataStore,
  "search-preview": Step15_SearchPreview,
};

export function DemoFrame() {
  const idx = useConsoleDemoStore((s) => s.currentStepIndex);
  const next = useConsoleDemoStore((s) => s.next);
  const prev = useConsoleDemoStore((s) => s.prev);
  const reset = useConsoleDemoStore((s) => s.reset);
  const setStepIndex = useConsoleDemoStore((s) => s.setStepIndex);
  const step = DEMO_STEPS[idx];
  const StepComponent = STEP_COMPONENTS[step.id];

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
          <div className="ml-auto flex items-center gap-1.5">
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

      {/* Main canvas: shell on left, guide on right */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
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
    </div>
  );
}
