"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import { Search, Brain, Bot, ShieldCheck, KeyRound, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepAutoSequence } from "@/lib/hooks/useStepAutoSequence";

interface ApiCard {
  id: string;
  name: string;
  serviceId: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const APIS: ApiCard[] = [
  {
    id: "aiplatform",
    name: "Vertex AI API",
    serviceId: "aiplatform.googleapis.com",
    description:
      "Gemini モデル本体・推論基盤。Generative AI Foundation Models。",
    icon: Brain,
    color: "#4285F4",
  },
  {
    id: "discoveryengine",
    name: "Vertex AI Agent Builder API",
    serviceId: "discoveryengine.googleapis.com",
    description:
      "旧 Discovery Engine API。AI Application と Data Store を作成するための API。",
    icon: Bot,
    color: "#34A853",
  },
  {
    id: "iam",
    name: "Identity and Access Management (IAM) API",
    serviceId: "iam.googleapis.com",
    description:
      "IAM ロール / Workforce プール / Service Account を操作する基盤 API。",
    icon: ShieldCheck,
    color: "#EA4335",
  },
  {
    id: "sts",
    name: "Security Token Service API",
    serviceId: "sts.googleapis.com",
    description:
      "WIF (Workforce Identity Federation) のトークン交換に必須。Federated 認証の核。",
    icon: KeyRound,
    color: "#FBBC05",
  },
];

export function Step07_ApiLibrary() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = APIS.filter((a) =>
    `${a.name} ${a.serviceId}`.toLowerCase().includes(query.toLowerCase()),
  );

  const enabledCount = Object.values(enabled).filter(Boolean).length;

  // 4 API を順次有効化するアニメーション
  useStepAutoSequence(
    APIS.flatMap((api) => [
      () => setActiveId(api.id),
      () => {
        setEnabled((m) => ({ ...m, [api.id]: true }));
        setActiveId(null);
      },
    ]),
    { intervalMs: 900, startDelayMs: 800 },
  );

  return (
    <GcpConsoleShell
      navHighlightId="apis"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["API とサービス", "ライブラリ"]}
      title="API ライブラリ"
      description={`Gemini Enterprise を動作させるために必要な 4 つの API を有効化します (${enabledCount} / ${APIS.length} 有効化済み)`}
      actions={null}
    >
      {/* Search bar */}
      <div className="mb-4 max-w-md relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="API、サービスを検索"
          className="w-full pl-9 pr-3 py-2 rounded-full border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] text-[13px] text-[#202124] dark:text-white placeholder:text-[#5F6368] focus:outline-none focus:border-[#1A73E8]"
        />
      </div>

      {/* Quick filter chips */}
      <div className="flex items-center gap-2 mb-4">
        <GcpChip tone="blue">推奨セット</GcpChip>
        <GcpChip tone="neutral">AI / 機械学習</GcpChip>
        <GcpChip tone="neutral">セキュリティ</GcpChip>
        <GcpChip tone="neutral">ID</GcpChip>
      </div>

      {/* API grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((api) => {
          const isOn = enabled[api.id];
          const isActive = activeId === api.id;
          const Icon = api.icon;
          return (
            <div
              key={api.id}
              className={cn(
                "rounded-lg border bg-white dark:bg-[#1F1F1F] p-4 transition-all duration-300 flex gap-3",
                isActive && "ring-4 ring-[#1A73E8]/30 border-[#1A73E8] scale-[1.02]",
                !isActive && isOn
                  ? "border-[#34A853]/40 ring-1 ring-[#34A853]/20"
                  : !isActive &&
                      "border-[#DADCE0] hover:shadow-[0_2px_6px_rgba(60,64,67,0.15)]",
              )}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white"
                style={{ backgroundColor: api.color }}
              >
                <Icon size={20} />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-medium font-display text-[#202124] dark:text-white truncate">
                    {api.name}
                  </span>
                  {isOn && (
                    <GcpChip tone="green" icon={<Check size={9} />}>
                      Enabled
                    </GcpChip>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#5F6368] mb-1">
                  {api.serviceId}
                </div>
                <p className="text-[12px] text-[#5F6368] leading-relaxed">
                  {api.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#5F6368]">
                    Google Enterprise API
                  </span>
                  {isOn ? (
                    <GcpButton
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        setEnabled((e) => ({ ...e, [api.id]: false }))
                      }
                    >
                      無効化
                    </GcpButton>
                  ) : (
                    <GcpButton
                      variant="filled"
                      size="sm"
                      onClick={() =>
                        setEnabled((e) => ({ ...e, [api.id]: true }))
                      }
                    >
                      有効にする
                    </GcpButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Org policy warning */}
      {enabledCount < APIS.length && (
        <div className="mt-4 rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2.5 text-[12px] leading-relaxed text-[#202124]">
          <strong>注意:</strong> 組織ポリシー「Restrict Allowed APIs
          (constraints/iam.allowedPolicyMemberDomains)」が
          設定されている場合、ここで「有効にする」を押しても 403
          エラーで拒否されます。情シスに事前に許可リストへの追加を依頼してください。
        </div>
      )}
      {enabledCount === APIS.length && (
        <div className="mt-4 rounded border border-[#34A853]/40 bg-[#E6F4EA] px-3 py-2.5 text-[12px] leading-relaxed text-[#202124]">
          <Check size={14} className="inline -mt-0.5 mr-1 text-[#137333]" />4
          つの API がすべて有効化されました。次のステップで Workforce Identity
          プールを作成します。
        </div>
      )}
    </GcpConsoleShell>
  );
}
