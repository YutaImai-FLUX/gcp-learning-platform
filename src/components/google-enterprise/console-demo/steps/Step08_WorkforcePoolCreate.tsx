"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpButton } from "../primitives/GcpButton";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import { ChevronLeft, Users, Globe } from "lucide-react";

export function Step08_WorkforcePoolCreate() {
  const [displayName, setDisplayName] = useState(
    "Workforce - Yamatoseiki 従業員",
  );
  const [poolId, setPoolId] = useState("wif-employees-pool");
  const [description, setDescription] = useState(
    "Entra ID の従業員アカウントを Gemini Enterprise に SSO 連携するための WIF プール",
  );
  const [sessionEnabled, setSessionEnabled] = useState(true);

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="組織レベル"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "IAM と管理",
        "ID フェデレーション",
        "Workforce プール",
        "新規作成",
      ]}
      title="Workforce Identity プールの作成"
      description="外部 IdP (Entra ID / Okta / Ping) から認証されたユーザーを Google Cloud で受け入れるためのプールを作成します。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          プール一覧へ戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-6 h-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-medium">
              1
            </span>
            <span className="text-[#202124] dark:text-white font-medium">
              プールの設定
            </span>
            <span className="text-[#5F6368]">›</span>
            <span className="text-[#5F6368]">
              2. プロバイダの追加 (次のステップ)
            </span>
          </div>

          <div className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5 space-y-5">
            <GcpInput
              label="表示名"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              helperText="管理コンソール上の表示に使われます。後から変更可能。"
            />
            <GcpInput
              label="プール ID"
              value={poolId}
              onChange={(e) => setPoolId(e.target.value)}
              required
              helperText="リソース名の一部として URL / API で使われる識別子。作成後に変更不可。"
            />
            <GcpInput
              label="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="運用メモ。後から変更可能。"
            />
            <div className="pt-2 border-t border-[#DADCE0]">
              <GcpToggle
                checked={sessionEnabled}
                onChange={setSessionEnabled}
                label="ユーザーセッションを有効化"
                description="連携後のユーザーが Cloud Console / gcloud CLI を使うときに必要。Gemini Enterprise の利用には必須。"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled">次へ: プロバイダの追加</GcpButton>
          </div>
        </div>

        {/* Right summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white flex items-center gap-2">
            <Users size={14} className="text-[#1A73E8]" /> プール概要
          </div>
          <dl className="text-[12px] space-y-2">
            <SummaryRow label="親リソース" value="組織 yamatoseiki.co.jp" />
            <SummaryRow
              label="プール ID"
              value={<code className="font-mono">{poolId}</code>}
            />
            <SummaryRow
              label="ステータス"
              value={<GcpChip tone="yellow">未公開</GcpChip>}
            />
            <SummaryRow
              label="認証元"
              value={
                <span className="text-[#5F6368] italic">
                  次のステップで追加
                </span>
              }
            />
          </dl>
          <div className="border-t border-[#DADCE0] pt-3 space-y-1.5">
            <div className="text-[11px] font-medium text-[#5F6368] uppercase tracking-wider">
              リソースパス
            </div>
            <code className="block text-[10px] font-mono text-[#1A73E8] break-all bg-white dark:bg-[#1F1F1F] px-2 py-1.5 rounded border border-[#DADCE0]">
              {`//iam.googleapis.com/locations/global/workforcePools/${poolId}`}
            </code>
          </div>
          <div className="border-t border-[#DADCE0] pt-3 flex items-start gap-2 text-[11px] text-[#5F6368] leading-relaxed">
            <Globe size={12} className="shrink-0 mt-0.5" />
            <span>
              ロケーションは <code className="font-mono">global</code>{" "}
              固定。プールは組織配下の任意のプロジェクトから参照可能。
            </span>
          </div>
        </aside>
      </div>
    </GcpConsoleShell>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="text-[#5F6368] shrink-0">{label}</dt>
      <dd className="text-right text-[#202124] dark:text-white">{value}</dd>
    </div>
  );
}
