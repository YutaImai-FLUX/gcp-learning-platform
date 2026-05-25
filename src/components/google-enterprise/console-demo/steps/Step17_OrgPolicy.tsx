"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  Folder,
  FolderTree,
  ShieldCheck,
  ChevronLeft,
  AlertTriangle,
  Lock,
  KeyRound,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Policy {
  constraint: string;
  label: string;
  description: string;
  recommended: boolean;
  icon: React.ElementType;
  category: "Identity" | "Network" | "Compute" | "Data";
}

const POLICIES: Policy[] = [
  {
    constraint: "constraints/iam.allowedPolicyMemberDomains",
    label: "Domain Restricted Sharing",
    description:
      "yamatoseiki.co.jp ドメインのアカウントのみ IAM 付与可能に制限",
    recommended: true,
    icon: Globe,
    category: "Identity",
  },
  {
    constraint: "constraints/iam.disableServiceAccountKeyCreation",
    label: "Service Account Key 作成禁止",
    description: "鍵漏洩リスクを抑える。Workload Identity / WIF へ強制誘導",
    recommended: true,
    icon: KeyRound,
    category: "Identity",
  },
  {
    constraint: "constraints/serviceuser.services",
    label: "Allowed APIs (Allowlist)",
    description: "Vertex AI / Discovery Engine / IAM / STS のみ有効化を許可",
    recommended: true,
    icon: ShieldCheck,
    category: "Compute",
  },
  {
    constraint: "constraints/compute.vmExternalIpAccess",
    label: "VM 外部 IP 禁止",
    description: "Compute Engine VM への Public IP 付与を禁止",
    recommended: false,
    icon: Lock,
    category: "Network",
  },
  {
    constraint: "constraints/storage.publicAccessPrevention",
    label: "Storage Public Access Prevention",
    description: "GCS バケットの公開を全社レベルで禁止",
    recommended: true,
    icon: Lock,
    category: "Data",
  },
  {
    constraint: "constraints/gcp.resourceLocations",
    label: "リソース ロケーション制限",
    description: "asia-northeast1 / asia-northeast2 のみ作成可能に制限",
    recommended: true,
    icon: Globe,
    category: "Data",
  },
];

interface FolderNode {
  id: string;
  name: string;
  tone: "blue" | "green" | "yellow";
  projects: string[];
}

const FOLDERS: FolderNode[] = [
  {
    id: "prod",
    name: "Production",
    tone: "blue",
    projects: ["gemini-poc-prod", "gemini-prod-app"],
  },
  {
    id: "staging",
    name: "Staging",
    tone: "yellow",
    projects: ["gemini-staging"],
  },
  {
    id: "sandbox",
    name: "Sandbox",
    tone: "green",
    projects: ["dev-yutaimai", "dev-tanaka"],
  },
];

export function Step17_OrgPolicy() {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(
    Object.fromEntries(POLICIES.map((p) => [p.constraint, p.recommended])),
  );

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="組織レベル"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["IAM と管理", "組織のポリシー"]}
      title="組織のポリシー & リソース階層"
      description="本番プロジェクト作成前にガードレールを敷きます。ここで設定したポリシーは全配下リソースに自動継承されます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          ポリシー一覧
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Folder hierarchy */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-medium font-display flex items-center gap-2">
              <FolderTree size={16} className="text-[#1A73E8]" />
              リソース階層
            </div>
            <GcpButton variant="outlined" size="sm">
              フォルダを追加
            </GcpButton>
          </div>
          <div className="font-mono text-[12px] space-y-1">
            <div className="text-[#202124] dark:text-white font-medium">
              🏢 yamatoseiki.co.jp{" "}
              <span className="text-[#5F6368]">(組織)</span>
            </div>
            {FOLDERS.map((f) => (
              <div key={f.id} className="space-y-0.5">
                <div className="pl-3 flex items-center gap-2">
                  <Folder
                    size={12}
                    className={
                      f.tone === "blue"
                        ? "text-[#1A73E8]"
                        : f.tone === "yellow"
                          ? "text-[#B26A00]"
                          : "text-[#137333]"
                    }
                  />
                  <span className="text-[#202124] dark:text-white">
                    {f.name}
                  </span>
                  <GcpChip tone={f.tone}>{f.projects.length} PJ</GcpChip>
                </div>
                {f.projects.map((p) => (
                  <div
                    key={p}
                    className="pl-9 text-[#5F6368] flex items-center gap-1.5"
                  >
                    <span>└─</span>
                    <span>📦 {p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded border-l-4 border-[#1A73E8] bg-[#E8F0FE]/40 px-3 py-2 text-[12px] leading-relaxed">
            <strong>環境分離の鉄則:</strong>{" "}
            本番と検証は必ず別フォルダ。ポリシー継承を活かして「Sandbox
            では緩く、Production では厳しく」を一括制御できます。
          </div>
        </section>

        {/* Org Policies */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-medium font-display flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1A73E8]" />
              組織ポリシー (Constraints)
            </div>
            <div className="text-[11px] text-[#5F6368]">
              有効化済み:{" "}
              <span className="font-bold text-[#202124] dark:text-white tabular-nums">
                {Object.values(enabledMap).filter(Boolean).length}
              </span>{" "}
              / {POLICIES.length}
            </div>
          </div>
          <div className="rounded border border-[#DADCE0] divide-y divide-[#DADCE0] overflow-hidden">
            {POLICIES.map((p) => {
              const Icon = p.icon;
              const on = enabledMap[p.constraint];
              return (
                <div
                  key={p.constraint}
                  className={cn(
                    "flex items-start gap-3 p-3.5 transition-colors",
                    on && "bg-[#E6F4EA]/40",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      on
                        ? "bg-[#34A853]/15 text-[#137333]"
                        : "bg-[#F1F3F4] text-[#5F6368]",
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-medium font-display text-[#202124] dark:text-white">
                        {p.label}
                      </span>
                      <GcpChip tone="neutral">{p.category}</GcpChip>
                      {p.recommended && <GcpChip tone="blue">推奨</GcpChip>}
                    </div>
                    <div className="text-[10px] font-mono text-[#5F6368] mb-1">
                      {p.constraint}
                    </div>
                    <div className="text-[12px] text-[#5F6368] leading-relaxed">
                      {p.description}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <GcpToggle
                      checked={on}
                      onChange={(v) =>
                        setEnabledMap((m) => ({ ...m, [p.constraint]: v }))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle
              size={13}
              className="text-[#B26A00] mt-0.5 shrink-0"
            />
            <span>
              組織ポリシーは即時に全配下リソースへ適用されます。既存リソース違反の検出は{" "}
              <code className="font-mono bg-white rounded px-1">
                gcloud asset analyze-org-policies
              </code>{" "}
              で事前に Dry-run しましょう。
            </span>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <GcpButton variant="text">キャンセル</GcpButton>
          <GcpButton variant="filled">ポリシーを適用</GcpButton>
        </div>
      </div>
    </GcpConsoleShell>
  );
}
