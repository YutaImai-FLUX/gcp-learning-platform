"use client";

import { useEffect, useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import {
  ShieldCheck,
  Database,
  Check,
  ChevronLeft,
  Activity,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataStore {
  id: string;
  name: string;
  source: string;
  docs: number;
  ingestStatus: "complete" | "ingesting" | "queued";
  aclEnabled: boolean;
}

const STORES: DataStore[] = [
  {
    id: "sp-internal-knowledge",
    name: "sp-internal-knowledge",
    source: "SharePoint",
    docs: 5012,
    ingestStatus: "ingesting",
    aclEnabled: true,
  },
  {
    id: "drive-engineering-docs",
    name: "drive-engineering-docs",
    source: "Google Drive",
    docs: 1820,
    ingestStatus: "complete",
    aclEnabled: true,
  },
];

export function Step14_BindDataStore() {
  const [bound, setBound] = useState<Record<string, boolean>>({
    "sp-internal-knowledge": true,
  });
  const [ingestPct, setIngestPct] = useState(38);
  const [ingestStatus, setIngestStatus] = useState<
    "complete" | "ingesting" | "queued"
  >("ingesting");

  const toggleBind = (id: string) => setBound((m) => ({ ...m, [id]: !m[id] }));

  // SharePoint データストアのインジェスト進捗を時間とともに進める
  useEffect(() => {
    if (ingestStatus === "complete") return;
    const id = setInterval(() => {
      setIngestPct((cur) => {
        if (cur >= 100) {
          clearInterval(id);
          setIngestStatus("complete");
          return 100;
        }
        return Math.min(100, cur + 4);
      });
    }, 600);
    return () => clearInterval(id);
  }, [ingestStatus]);

  return (
    <GcpConsoleShell
      navHighlightId="ai-app"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "AI Application",
        "アプリ",
        "internal-knowledge-search",
        "データストア",
      ]}
      title="internal-knowledge-search · データストアの管理"
      description="このアプリで検索対象とするデータストアをバインド (接続) します。複数のデータストアを 1 つのアプリにバインドできます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          アプリ概要へ戻る
        </GcpButton>
      }
    >
      {/* App settings tabs */}
      <div className="border-b border-[#DADCE0] -mt-1 mb-5">
        <div className="flex items-center gap-6 text-[13px]">
          <TabItem label="概要" />
          <TabItem label="プレビュー" />
          <TabItem label="データストア" active />
          <TabItem label="認証" />
          <TabItem label="ブランディング" />
          <TabItem label="統合" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] text-[#5F6368]">
              バインド済み:{" "}
              <span className="font-bold text-[#202124] dark:text-white tabular-nums">
                {Object.values(bound).filter(Boolean).length}
              </span>{" "}
              / {STORES.length}
            </div>
            <GcpButton
              variant="outlined"
              size="sm"
              leadingIcon={<Plus size={13} />}
            >
              データストアを新規作成
            </GcpButton>
          </div>

          {/* Data stores list */}
          <div className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] divide-y divide-[#DADCE0]">
            {STORES.map((s) => {
              const isBound = !!bound[s.id];
              // SharePoint データストアは動的進捗、Drive は完了固定
              const dynamicStatus =
                s.id === "sp-internal-knowledge" ? ingestStatus : s.ingestStatus;
              const pct =
                dynamicStatus === "complete"
                  ? 100
                  : dynamicStatus === "ingesting"
                    ? s.id === "sp-internal-knowledge"
                      ? ingestPct
                      : 64
                    : 0;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "p-4 flex items-start gap-4 transition-colors",
                    isBound && "bg-[#E8F0FE]/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      isBound
                        ? "bg-[#1A73E8] text-white"
                        : "bg-[#F1F3F4] text-[#5F6368]",
                    )}
                  >
                    <Database size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[13px] font-medium text-[#202124] dark:text-white truncate">
                        {s.name}
                      </span>
                      {s.aclEnabled ? (
                        <GcpChip tone="green" icon={<ShieldCheck size={10} />}>
                          ACL 継承 ON
                        </GcpChip>
                      ) : (
                        <GcpChip tone="red">ACL OFF</GcpChip>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5F6368] mb-2">
                      {s.source} · {s.docs.toLocaleString()} ドキュメント
                    </div>
                    {/* Ingestion progress */}
                    <div className="flex items-center gap-2 max-w-md">
                      <Activity
                        size={11}
                        className={cn(
                          dynamicStatus === "complete"
                            ? "text-[#137333]"
                            : "text-[#B26A00]",
                          dynamicStatus === "ingesting" && "animate-pulse",
                        )}
                      />
                      <div className="flex-1 h-1.5 rounded-full bg-[#E8EAED] overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            dynamicStatus === "complete"
                              ? "bg-[#34A853]"
                              : "bg-[#FBBC05]",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5F6368] tabular-nums w-9 text-right">
                        {pct}%
                      </span>
                    </div>
                    <div className="text-[10px] text-[#5F6368] mt-1">
                      {dynamicStatus === "ingesting"
                        ? `インジェスト中 (${Math.round((s.docs * pct) / 100).toLocaleString()} / ${s.docs.toLocaleString()})`
                        : dynamicStatus === "complete"
                          ? "インジェスト完了"
                          : "キューイング中"}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isBound ? (
                      <GcpButton
                        variant="tonal"
                        size="sm"
                        leadingIcon={<Check size={12} />}
                        onClick={() => toggleBind(s.id)}
                      >
                        バインド済み
                      </GcpButton>
                    ) : (
                      <GcpButton
                        variant="outlined"
                        size="sm"
                        onClick={() => toggleBind(s.id)}
                      >
                        バインド
                      </GcpButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <GcpButton variant="filled">変更を保存</GcpButton>
          </div>
        </div>

        {/* Right: status */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            アプリ準備状況
          </div>
          <div className="space-y-2 text-[12px]">
            <ReadyRow label="認証プロバイダ" ok ready="WIF 紐付け済み" />
            <ReadyRow
              label="データストア"
              ok
              ready={`${Object.values(bound).filter(Boolean).length} 件バインド`}
            />
            <ReadyRow
              label="インジェスト"
              ok={false}
              ready="進行中 (64%)"
              warn
            />
            <ReadyRow label="検索プレビュー" ok ready="利用可能" />
          </div>
          <div className="border-t border-[#DADCE0] pt-3 text-[11px] text-[#5F6368] leading-relaxed">
            インジェスト未完了でもプレビューは動作しますが、完了までは結果が部分的になります。
          </div>
        </aside>
      </div>
    </GcpConsoleShell>
  );
}

function TabItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "-mb-px pb-2.5 border-b-2 transition-colors",
        active
          ? "border-[#1A73E8] text-[#1A73E8] font-medium"
          : "border-transparent text-[#5F6368] hover:text-[#202124]",
      )}
    >
      {label}
    </button>
  );
}

function ReadyRow({
  label,
  ok,
  ready,
  warn,
}: {
  label: string;
  ok: boolean;
  ready: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#5F6368]">{label}</span>
      <span
        className={cn(
          "flex items-center gap-1 font-medium",
          warn ? "text-[#B26A00]" : ok ? "text-[#137333]" : "text-[#D93025]",
        )}
      >
        {ok || warn ? <Check size={11} /> : null}
        {ready}
      </span>
    </div>
  );
}
