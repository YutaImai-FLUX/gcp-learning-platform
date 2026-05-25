"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  Copy,
  RefreshCcw,
  Check,
  ChevronLeft,
  ArrowRightLeft,
  Users,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncLog {
  time: string;
  type: "user.create" | "user.update" | "group.create" | "user.deprovision";
  target: string;
  result: "ok" | "skip" | "fail";
  detail?: string;
}

const LOGS: SyncLog[] = [
  {
    time: "2 分前",
    type: "user.create",
    target: "sato.misaki@yamatoseiki.co.jp",
    result: "ok",
  },
  {
    time: "2 分前",
    type: "group.create",
    target: "ge-users-pilot",
    result: "ok",
    detail: "+15 members",
  },
  {
    time: "8 分前",
    type: "user.update",
    target: "yamada.kenji@yamatoseiki.co.jp",
    result: "ok",
    detail: "department: 品質保証部 → 品質管理本部",
  },
  {
    time: "15 分前",
    type: "user.deprovision",
    target: "ex.employee@yamatoseiki.co.jp",
    result: "ok",
    detail: "GE ライセンス自動回収",
  },
  {
    time: "1 時間前",
    type: "user.create",
    target: "external.contractor@partner.co.jp",
    result: "skip",
    detail: "Entra 側で対象スコープ外",
  },
  {
    time: "3 時間前",
    type: "group.create",
    target: "engineering-line3",
    result: "fail",
    detail: "displayName が重複",
  },
];

export function Step19_ScimProvision() {
  const [enabled, setEnabled] = useState(true);
  const [includeGroups, setIncludeGroups] = useState(true);
  const [includeDeprovision, setIncludeDeprovision] = useState(true);
  const [token, setToken] = useState("ya29.scim-prov-token-***-redacted-***");
  const [copied, setCopied] = useState<string | null>(null);

  const SCIM_URL = "https://www.googleapis.com/admin/directory/v1/scim/v2";

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* noop */
    }
  };

  const rotateToken = () => {
    const random = Math.random().toString(36).slice(2, 10);
    setToken(`ya29.scim-prov-${random}-redacted`);
  };

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="組織レベル"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={[
        "IAM と管理",
        "ID フェデレーション",
        "SCIM プロビジョニング",
      ]}
      title="SCIM プロビジョニング"
      description="Entra ID 側でのユーザー・グループ変更を、Cloud Identity と Gemini Enterprise へ自動同期します。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          ID フェデレーション
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Status banner */}
        <div
          className={cn(
            "rounded-lg border-2 p-4 flex items-center gap-3",
            enabled
              ? "border-[#34A853]/50 bg-[#E6F4EA]/40"
              : "border-[#FBBC05]/50 bg-[#FEF7E0]/40",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              enabled
                ? "bg-[#34A853]/15 text-[#137333]"
                : "bg-[#FBBC05]/20 text-[#B26A00]",
            )}
          >
            <ArrowRightLeft size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
              SCIM 同期: {enabled ? "有効" : "停止中"}
            </div>
            <div className="text-[11px] text-[#5F6368]">
              {enabled
                ? "Entra ID から Cloud Identity へ 15 分間隔で差分同期中。次回実行まで 8 分。"
                : "Entra 側の変更が Google 側に反映されません。WIF 単体運用に戻ります。"}
            </div>
          </div>
          <GcpToggle checked={enabled} onChange={setEnabled} size="md" />
        </div>

        {/* Endpoint info */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-3">
            Entra ID 側に登録する接続情報
          </div>
          <div className="space-y-3">
            <KeyValueRow
              label="テナント URL (SCIM 2.0 Endpoint)"
              value={SCIM_URL}
              copied={copied === "url"}
              onCopy={() => handleCopy("url", SCIM_URL)}
            />
            <KeyValueRow
              label="シークレット トークン"
              value={token}
              copied={copied === "token"}
              onCopy={() => handleCopy("token", token)}
              extra={
                <GcpButton
                  variant="text"
                  size="sm"
                  leadingIcon={<RefreshCcw size={11} />}
                  onClick={rotateToken}
                >
                  再生成
                </GcpButton>
              }
            />
            <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertTriangle
                size={13}
                className="text-[#B26A00] mt-0.5 shrink-0"
              />
              <span>
                トークンは <strong>1 年で自動失効</strong>
                。期限切れで一夜にして同期停止し、新規入社者がアクセスできなくなる障害が頻発します。
                Calendar リマインダ・Secret Manager Rotation Policy
                を必ず設定すること。
              </span>
            </div>
          </div>
        </section>

        {/* Sync scope */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-3">
            同期スコープ
          </div>
          <div className="space-y-3">
            <ToggleRow
              icon={Users}
              label="グループ同期"
              description="Entra ID のセキュリティグループを Cloud Identity Group に複製。Step 18 の IAM 付与の前提"
              checked={includeGroups}
              onChange={setIncludeGroups}
            />
            <ToggleRow
              icon={Calendar}
              label="ライセンス自動回収 (deprovisioning)"
              description="退職・部署異動で Entra から削除されたユーザーの GE ライセンスを即時回収"
              checked={includeDeprovision}
              onChange={setIncludeDeprovision}
            />
            <div className="px-3 py-2.5 rounded border border-[#DADCE0] bg-[#F8F9FA] text-[12px] leading-relaxed">
              <div className="font-medium text-[#202124] dark:text-white mb-1">
                対象スコープ (Entra 側で設定)
              </div>
              <div className="text-[#5F6368] font-mono text-[11px]">
                department in (営業企画, 品質保証, 技術開発) OR group startsWith
                &apos;ge-&apos;
              </div>
            </div>
          </div>
        </section>

        {/* Sync logs */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between">
            <div className="text-[13px] font-medium font-display text-[#202124] dark:text-white">
              直近の同期ログ
            </div>
            <GcpChip tone="neutral">過去 24 時間</GcpChip>
          </div>
          <table className="w-full text-[12px]">
            <thead className="bg-[#F8F9FA] text-[#5F6368]">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                  時刻
                </th>
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                  イベント
                </th>
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                  対象
                </th>
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                  結果
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DADCE0]">
              {LOGS.map((log, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-[#5F6368]">{log.time}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px]">
                    {log.type}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-[11px]">{log.target}</div>
                    {log.detail && (
                      <div className="text-[10px] text-[#5F6368]">
                        {log.detail}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <GcpChip
                      tone={
                        log.result === "ok"
                          ? "green"
                          : log.result === "skip"
                            ? "neutral"
                            : "red"
                      }
                    >
                      {log.result === "ok"
                        ? "成功"
                        : log.result === "skip"
                          ? "スキップ"
                          : "失敗"}
                    </GcpChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="flex justify-end gap-2">
          <GcpButton variant="outlined">手動同期を実行</GcpButton>
          <GcpButton variant="filled">設定を保存</GcpButton>
        </div>
      </div>
    </GcpConsoleShell>
  );
}

function KeyValueRow({
  label,
  value,
  copied,
  onCopy,
  extra,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-[#5F6368] mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 px-3 py-2 rounded border border-[#DADCE0] bg-[#F8F9FA] font-mono text-[12px] break-all text-[#202124] dark:text-white">
          {value}
        </code>
        <GcpButton
          variant="outlined"
          size="sm"
          leadingIcon={
            copied ? (
              <Check size={11} className="text-[#137333]" />
            ) : (
              <Copy size={11} />
            )
          }
          onClick={onCopy}
        >
          {copied ? "コピー済み" : "コピー"}
        </GcpButton>
        {extra}
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded border border-[#DADCE0]">
      <Icon size={14} className="text-[#1A73E8] mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#202124] dark:text-white">
          {label}
        </div>
        <div className="text-[11px] text-[#5F6368] leading-relaxed">
          {description}
        </div>
      </div>
      <GcpToggle checked={checked} onChange={onChange} />
    </div>
  );
}
