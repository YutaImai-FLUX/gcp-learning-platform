"use client";

import { useState } from "react";
import { useStepAutoSequence } from "@/lib/hooks/useStepAutoSequence";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpInput } from "../primitives/GcpInput";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  ShieldCheck,
  AlertOctagon,
  FolderOpen,
  Cloud,
  ChevronLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Source = "sharepoint" | "drive" | "confluence" | "jira" | "salesforce";

const SOURCES: { id: Source; label: string; sub: string }[] = [
  {
    id: "sharepoint",
    label: "Microsoft SharePoint",
    sub: "Microsoft 365 サイト",
  },
  { id: "drive", label: "Google Drive", sub: "共有ドライブ / マイドライブ" },
  { id: "confluence", label: "Atlassian Confluence", sub: "スペース・ページ" },
  { id: "jira", label: "Atlassian Jira", sub: "プロジェクト・課題" },
  { id: "salesforce", label: "Salesforce", sub: "オブジェクト・添付ファイル" },
];

export function Step13_DataStoreCreate() {
  const [source, setSource] = useState<Source>("drive");
  const [tenantId, setTenantId] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [storeName, setStoreName] = useState("");
  const [accessControl, setAccessControl] = useState(false);
  const [aclPulse, setAclPulse] = useState(false);
  const [createPulse, setCreatePulse] = useState(false);

  useStepAutoSequence(
    [
      // 1. SharePoint ソースに切替
      () => setSource("sharepoint"),
      // 2. テナント / サイト / 名前を順次入力
      () => setTenantId("yamatoseiki.onmicrosoft.com"),
      () =>
        setSiteUrl(
          "https://yamatoseiki.sharepoint.com/sites/internal-knowledge",
        ),
      () => setStoreName("sp-internal-knowledge"),
      // 3. アクセス制御トグルをハイライト
      () => setAclPulse(true),
      // 4. ACL を ON へ
      () => {
        setAccessControl(true);
        setAclPulse(false);
      },
      // 5. 作成ボタンをハイライト
      () => setCreatePulse(true),
    ],
    { intervalMs: 1100, startDelayMs: 600 },
  );

  return (
    <GcpConsoleShell
      navHighlightId="ai-app"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["AI Application", "データストア", "新しいデータストア"]}
      title="新しいデータストア"
      description="検索対象とするソースを選び、アクセス制御方式を決定します。**アクセス制御は作成後変更できません。**"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          データストア一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Source selection */}
          <Section title="データソースを選択">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {SOURCES.map((s) => {
                const active = source === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSource(s.id)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left transition-all",
                      active
                        ? "border-[#1A73E8] bg-[#E8F0FE]/40"
                        : "border-[#DADCE0] hover:border-[#1A73E8]/40",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Cloud
                        size={14}
                        className={active ? "text-[#1A73E8]" : "text-[#5F6368]"}
                      />
                      <span className="text-[13px] font-medium font-display text-[#202124] dark:text-white">
                        {s.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5F6368]">{s.sub}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Connection */}
          <Section
            title={`${SOURCES.find((s) => s.id === source)?.label} への接続`}
          >
            <div className="space-y-4">
              <GcpInput
                label="テナント ID / ドメイン"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              />
              <GcpInput
                label="対象サイト URL"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                helperText="このサイト配下のドキュメントライブラリがインジェスト対象になります。"
                required
              />
              <div className="px-3 py-2.5 rounded border border-[#DADCE0] bg-[#F8F9FA] flex items-center gap-3">
                <FolderOpen size={14} className="text-[#5F6368]" />
                <span className="text-[12px] flex-1 font-mono text-[#202124] dark:text-white">
                  /sites/internal-knowledge/Shared Documents/
                </span>
                <button className="text-[12px] text-[#1A73E8] hover:underline">
                  変更
                </button>
              </div>
              <div className="rounded border border-[#DADCE0] bg-white p-3 flex items-center justify-between gap-3">
                <div className="text-[12px]">
                  <div className="font-medium text-[#202124] dark:text-white">
                    接続用アカウント
                  </div>
                  <div className="text-[#5F6368]">
                    sharepoint-connector@yamatoseiki.onmicrosoft.com
                  </div>
                </div>
                <GcpChip tone="green" icon={<Check size={10} />}>
                  Sites.Selected 委譲済み
                </GcpChip>
              </div>
            </div>
          </Section>

          {/* CRITICAL: Access control */}
          <section
            className={cn(
              "rounded-lg border-2 p-5 transition-all duration-500",
              accessControl
                ? "border-[#34A853]/50 bg-[#E6F4EA]/40"
                : "border-[#EA4335] bg-[#FCE8E6] ring-4 ring-[#EA4335]/15",
              aclPulse && "ring-8 ring-[#FBBC05]/40 animate-pulse",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {accessControl ? (
                  <ShieldCheck size={18} className="text-[#137333]" />
                ) : (
                  <AlertOctagon size={18} className="text-[#D93025]" />
                )}
                <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
                  データソースのアクセス制御
                </div>
                <GcpChip tone="yellow">作成後変更不可</GcpChip>
              </div>
              <GcpToggle checked={accessControl} onChange={setAccessControl} />
            </div>
            {accessControl ? (
              <div className="text-[12px] text-[#137333] leading-relaxed">
                ✓ <strong>有効。</strong>SharePoint
                側で設定されているドキュメント単位の ACL が Gemini Enterprise
                にインポートされ、検索結果はユーザーごとに権限フィルタされます。
                <br />
                <span className="text-[#5F6368]">
                  ※ Documents
                  タブにはドキュメント一覧が表示されなくなりますが、これは仕様です。
                  動作確認は WIF
                  認証済みユーザーでアプリのプレビューを使ってください。
                </span>
              </div>
            ) : (
              <div className="text-[12px] text-[#D93025] leading-relaxed">
                <strong>致命的: </strong>全 PoC
                ユーザーが全ドキュメントを閲覧可能になります。 かつ、後から ON
                にすることはできません。Phase 1 で約束したアクセス境界が崩壊し、
                作り直し前提でスケジュールが伸びます。本番運用想定では必ず ON
                にしてください。
              </div>
            )}
          </section>

          {/* Name */}
          <Section title="データストア名">
            <GcpInput
              label="データストア ID"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </Section>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton
              variant="filled"
              className={cn(
                createPulse && "ring-4 ring-[#1A73E8]/40 animate-pulse",
              )}
            >
              作成 (バックグラウンドでインジェスト開始)
            </GcpButton>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            設定概要
          </div>
          <dl className="text-[12px] space-y-2">
            <Row
              label="ソース"
              value={SOURCES.find((s) => s.id === source)?.label ?? ""}
            />
            <Row
              label="名前"
              value={<code className="font-mono">{storeName}</code>}
            />
            <Row
              label="ACL"
              value={
                accessControl ? (
                  <GcpChip tone="green">継承 ON</GcpChip>
                ) : (
                  <GcpChip tone="red">継承 OFF (危険)</GcpChip>
                )
              }
            />
            <Row label="想定件数" value="約 5,000 件" />
            <Row label="インジェスト目安" value="〜2 時間" />
          </dl>
          <div className="border-t border-[#DADCE0] pt-3 text-[11px] text-[#5F6368] leading-relaxed">
            作成直後にインジェスト処理がバックグラウンドで開始されます。ステータスは「ドキュメント」タブの代わりに「アクティビティ」で確認します。
          </div>
        </aside>
      </div>
    </GcpConsoleShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
      <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-4">
        {title}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="text-[#5F6368] shrink-0">{label}</dt>
      <dd className="text-right text-[#202124] dark:text-white">{value}</dd>
    </div>
  );
}
