"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  FileSearch,
  Database,
  Eye,
  ChevronLeft,
  AlertTriangle,
  Activity,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogType {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
  costNote?: string;
  required: boolean;
}

const AUDIT_TYPES: AuditLogType[] = [
  {
    id: "admin-activity",
    label: "Admin Activity",
    description:
      "IAM 変更 / リソース作成削除 / ポリシー変更など、管理者操作のすべて",
    defaultOn: true,
    required: true,
  },
  {
    id: "data-access",
    label: "Data Access (Read)",
    description:
      "Data Store / GCS / BigQuery など、データの読み取りログ。監査必須だが課金対象",
    defaultOn: true,
    costNote: "課金対象。対象 API を必ず絞り込むこと",
    required: false,
  },
  {
    id: "data-access-write",
    label: "Data Access (Write)",
    description:
      "データの書き込み・更新ログ。Discovery Engine への文書 ingest が含まれる",
    defaultOn: true,
    required: false,
  },
  {
    id: "system-event",
    label: "System Event",
    description:
      "Google 側のシステムイベント (自動再起動等)。常時記録・課金なし",
    defaultOn: true,
    required: true,
  },
  {
    id: "policy-denied",
    label: "Policy Denied",
    description: "VPC Service Controls / 組織ポリシーで拒否されたアクセス試行",
    defaultOn: true,
    required: true,
  },
];

interface RecentLogEntry {
  time: string;
  type: string;
  principal: string;
  action: string;
  resource: string;
  severity: "info" | "warning" | "error";
}

const RECENT_LOGS: RecentLogEntry[] = [
  {
    time: "12:43:21",
    type: "Admin",
    principal: "admin@yamatoseiki.co.jp",
    action: "google.iam.admin.v1.SetIamPolicy",
    resource: "projects/gemini-poc-prod",
    severity: "info",
  },
  {
    time: "12:42:08",
    type: "Data Access",
    principal: "sato.misaki@yamatoseiki.co.jp",
    action: "discoveryengine.servingConfigs.search",
    resource: "engines/internal-knowledge-search",
    severity: "info",
  },
  {
    time: "12:39:54",
    type: "Policy Denied",
    principal: "yamada.kenji@yamatoseiki.co.jp",
    action: "storage.objects.get",
    resource: "gs://restricted-bucket/confidential.pdf",
    severity: "warning",
  },
  {
    time: "12:35:12",
    type: "Data Access",
    principal: "ge-connector@gemini-poc-prod.iam.gserviceaccount.com",
    action: "discoveryengine.documents.import",
    resource: "dataStores/sp-internal-knowledge",
    severity: "info",
  },
  {
    time: "12:30:01",
    type: "Admin",
    principal: "external.contractor@partner.co.jp",
    action: "google.cloud.kms.v1.Decrypt",
    resource: "cryptoKeys/ge-datastore-key",
    severity: "error",
  },
];

export function Step21_AuditLog() {
  const [enabledLogs, setEnabledLogs] = useState<Record<string, boolean>>(
    Object.fromEntries(AUDIT_TYPES.map((t) => [t.id, t.defaultOn])),
  );
  const [bqExport, setBqExport] = useState(true);
  const [accessTransparency, setAccessTransparency] = useState(true);
  const [retentionDays, setRetentionDays] = useState(2555); // 7 years

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["IAM と管理", "監査ログ"]}
      title="監査ログ設定"
      description="誰が・いつ・何にアクセスしたかを完全記録。エンプラ案件の本契約に必須。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          IAM ホーム
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="有効ログ"
            value={`${Object.values(enabledLogs).filter(Boolean).length} / ${AUDIT_TYPES.length}`}
            hint="4 種類すべて推奨"
          />
          <StatCard
            label="保存期間"
            value={`${Math.round(retentionDays / 365)} 年`}
            hint="ISO27001 は 3 年〜"
          />
          <StatCard
            label="BigQuery シンク"
            value={bqExport ? "有効" : "無効"}
            tone={bqExport ? "green" : "yellow"}
            hint={bqExport ? "長期保存可能" : "90 日で消える"}
          />
          <StatCard
            label="Access Transparency"
            value={accessTransparency ? "ON" : "OFF"}
            tone={accessTransparency ? "blue" : "neutral"}
            hint="Google 社員アクセス可視化"
          />
        </div>

        {/* Audit types */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
          <div className="text-[14px] font-medium font-display mb-3 flex items-center gap-2">
            <FileSearch size={16} className="text-[#1A73E8]" />
            記録するログタイプ
          </div>
          <div className="rounded border border-[#DADCE0] divide-y divide-[#DADCE0] overflow-hidden">
            {AUDIT_TYPES.map((t) => {
              const on = enabledLogs[t.id];
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-start gap-3 p-3.5",
                    on && "bg-[#E8F0FE]/30",
                    t.required && !on && "bg-[#FCE8E6]/40",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium font-display">
                        {t.label}
                      </span>
                      {t.required && <GcpChip tone="red">必須</GcpChip>}
                      {t.costNote && <GcpChip tone="yellow">課金</GcpChip>}
                    </div>
                    <div className="text-[12px] text-[#5F6368] leading-relaxed">
                      {t.description}
                    </div>
                    {t.costNote && (
                      <div className="text-[11px] text-[#B26A00] mt-1">
                        ⚠ {t.costNote}
                      </div>
                    )}
                  </div>
                  <GcpToggle
                    checked={on}
                    onChange={(v) =>
                      setEnabledLogs((m) => ({ ...m, [t.id]: v }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Long-term retention */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5 space-y-4">
          <div className="text-[14px] font-medium font-display flex items-center gap-2">
            <Database size={16} className="text-[#1A73E8]" />
            長期保存 (BigQuery シンク)
          </div>
          <div
            className={cn(
              "flex items-center justify-between p-3 rounded border-2 transition-colors",
              bqExport
                ? "border-[#34A853]/40 bg-[#E6F4EA]/40"
                : "border-[#FBBC05]/40 bg-[#FEF7E0]",
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium">
                BigQuery シンクで {Math.round(retentionDays / 365)} 年保存
              </div>
              <div className="text-[11px] text-[#5F6368]">
                bigquery: projects/gemini-poc-prod/datasets/audit_logs · Lock
                設定で改竄防止
              </div>
            </div>
            <GcpToggle checked={bqExport} onChange={setBqExport} />
          </div>
          <div>
            <div className="text-[11px] text-[#5F6368] mb-1">
              保存期間 (日数)
            </div>
            <input
              type="range"
              min={365}
              max={3650}
              step={365}
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="w-full accent-[#1A73E8]"
            />
            <div className="flex justify-between text-[10px] text-[#5F6368] mt-1">
              <span>1 年</span>
              <span className="font-medium text-[#202124] dark:text-white">
                {Math.round(retentionDays / 365)} 年
              </span>
              <span>10 年</span>
            </div>
          </div>
        </section>

        {/* Access Transparency */}
        <section className="rounded-lg border-2 border-[#1A73E8]/30 bg-[#E8F0FE]/30 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center shrink-0">
              <Eye size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-medium font-display">
                    Access Transparency
                  </div>
                  <div className="text-[11px] text-[#5F6368] leading-relaxed max-w-xl">
                    Google サポート・SRE
                    があなたのデータにアクセスした際の操作ログを取得します。エンプラ特権機能。Access
                    Approval 併用で「事前承認」も可能。
                  </div>
                </div>
                <GcpToggle
                  checked={accessTransparency}
                  onChange={setAccessTransparency}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent logs viewer */}
        <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between">
            <div className="text-[13px] font-medium font-display flex items-center gap-2">
              <Activity size={14} className="text-[#1A73E8]" />
              ログ エクスプローラー (直近)
            </div>
            <div className="flex items-center gap-2">
              <GcpButton
                variant="outlined"
                size="sm"
                leadingIcon={<Filter size={11} />}
              >
                フィルタ
              </GcpButton>
              <GcpChip tone="neutral" icon={<Clock size={10} />}>
                live
              </GcpChip>
            </div>
          </div>
          <table className="w-full text-[11px]">
            <thead className="bg-[#F8F9FA] text-[#5F6368]">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider w-20">
                  時刻
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider w-24">
                  タイプ
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider">
                  プリンシパル / アクション
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider">
                  リソース
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider w-20">
                  重要度
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DADCE0] font-mono">
              {RECENT_LOGS.map((log, i) => (
                <tr
                  key={i}
                  className={cn(
                    log.severity === "error" && "bg-[#FCE8E6]/30",
                    log.severity === "warning" && "bg-[#FEF7E0]/40",
                  )}
                >
                  <td className="px-3 py-2 tabular-nums text-[#5F6368]">
                    {log.time}
                  </td>
                  <td className="px-3 py-2">
                    <GcpChip
                      tone={
                        log.type === "Policy Denied"
                          ? "red"
                          : log.type === "Admin"
                            ? "blue"
                            : "neutral"
                      }
                    >
                      {log.type}
                    </GcpChip>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-[#202124] dark:text-white truncate">
                      {log.principal}
                    </div>
                    <div className="text-[10px] text-[#5F6368]">
                      {log.action}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#5F6368] truncate">
                    {log.resource}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        log.severity === "error"
                          ? "text-[#D93025]"
                          : log.severity === "warning"
                            ? "text-[#B26A00]"
                            : "text-[#137333]",
                      )}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
          <AlertTriangle size={13} className="text-[#B26A00] mt-0.5 shrink-0" />
          <span>
            Data Access ログを全 API
            で取ると、月数十万円規模で課金が跳ねます。対象を{" "}
            <code className="font-mono bg-white rounded px-1">
              discoveryengine / iam / kms
            </code>{" "}
            に絞ること。 Cloud Logging の `_Required` バケットは無料で 400
            日固定保存されます。
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <GcpButton variant="text">キャンセル</GcpButton>
          <GcpButton variant="filled">設定を保存</GcpButton>
        </div>
      </div>
    </GcpConsoleShell>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: "green" | "yellow" | "red" | "blue" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "green"
          ? "border-[#34A853]/30 bg-[#E6F4EA]/40"
          : tone === "yellow"
            ? "border-[#FBBC05]/30 bg-[#FEF7E0]/40"
            : tone === "blue"
              ? "border-[#1A73E8]/30 bg-[#E8F0FE]/40"
              : tone === "red"
                ? "border-[#EA4335]/30 bg-[#FCE8E6]/40"
                : "border-[#DADCE0] bg-white dark:bg-[#1F1F1F]",
      )}
    >
      <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
        {label}
      </div>
      <div className="font-display text-[20px] font-bold tabular-nums text-[#202124] dark:text-white leading-tight">
        {value}
      </div>
      <div className="text-[10px] text-[#5F6368]">{hint}</div>
    </div>
  );
}
