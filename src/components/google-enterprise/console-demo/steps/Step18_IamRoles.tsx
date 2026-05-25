"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import {
  Plus,
  Search,
  ShieldCheck,
  Users,
  User,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PrincipalType = "group" | "user" | "service-account";

interface IamRow {
  principal: string;
  principalType: PrincipalType;
  roles: string[];
  scope: string;
  condition?: string;
  warn?: string;
}

const ROWS: IamRow[] = [
  {
    principal: "group:gcp-org-admins@yamatoseiki.co.jp",
    principalType: "group",
    roles: ["roles/resourcemanager.organizationAdmin"],
    scope: "組織",
  },
  {
    principal: "group:gcp-billing-admins@yamatoseiki.co.jp",
    principalType: "group",
    roles: ["roles/billing.admin"],
    scope: "請求アカウント",
  },
  {
    principal: "group:gcp-presales@yamatoseiki.co.jp",
    principalType: "group",
    roles: ["roles/editor"],
    scope: "Folder: Production",
    warn: "Editor は強すぎる。プロダクト固有ロールに分解推奨",
  },
  {
    principal: "group:ge-app-admins@yamatoseiki.co.jp",
    principalType: "group",
    roles: ["roles/discoveryengine.admin"],
    scope: "PJ: gemini-poc-prod",
  },
  {
    principal: "group:ge-users-pilot@yamatoseiki.co.jp",
    principalType: "group",
    roles: ["roles/discoveryengine.viewer"],
    scope: "PJ: gemini-poc-prod",
    condition: "request.time < timestamp('2026-08-31T00:00:00Z')",
  },
  {
    principal: "user:auditor.external@bigfour.co.jp",
    principalType: "user",
    roles: ["roles/logging.viewer", "roles/cloudasset.viewer"],
    scope: "組織",
    condition: "request.time.dayOfWeek() in [1,2,3,4,5]",
  },
  {
    principal: "ge-connector@gemini-poc-prod.iam.gserviceaccount.com",
    principalType: "service-account",
    roles: ["roles/discoveryengine.editor"],
    scope: "PJ: gemini-poc-prod",
  },
];

export function Step18_IamRoles() {
  const [query, setQuery] = useState("");
  const filtered = ROWS.filter((r) =>
    `${r.principal} ${r.roles.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="組織レベル"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["IAM と管理", "IAM"]}
      title="IAM 権限管理"
      description="最小権限の原則とグループベース付与を徹底します。個人ユーザーに直接 Owner/Editor を付けるのは禁忌。"
      actions={
        <>
          <GcpButton variant="outlined" size="sm">
            ポリシー監査ログ
          </GcpButton>
          <GcpButton
            variant="filled"
            size="sm"
            leadingIcon={<Plus size={13} />}
          >
            アクセスを許可
          </GcpButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="プリンシパル / ロール検索"
            className="w-full pl-9 pr-3 py-2 rounded border border-[#DADCE0] text-[13px] focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="プリンシパル"
            value={ROWS.length}
            hint="グループ + ユーザー + SA"
          />
          <StatCard
            label="グループ"
            value={ROWS.filter((r) => r.principalType === "group").length}
            hint="グループベース推奨"
            tone="green"
          />
          <StatCard
            label="個人ユーザー"
            value={ROWS.filter((r) => r.principalType === "user").length}
            hint="必要最小限"
            tone="yellow"
          />
          <StatCard
            label="Editor 付与"
            value={ROWS.filter((r) => r.roles.includes("roles/editor")).length}
            hint="極力削減すべき"
            tone="red"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2 bg-[#F8F9FA] dark:bg-[#28292C] text-[10px] font-medium text-[#5F6368] uppercase tracking-wider border-b border-[#DADCE0]">
            <div className="col-span-4">プリンシパル</div>
            <div className="col-span-3">ロール</div>
            <div className="col-span-2">範囲</div>
            <div className="col-span-3">条件 / 備考</div>
          </div>
          {filtered.map((r) => (
            <div
              key={r.principal}
              className={cn(
                "grid grid-cols-12 px-4 py-3 items-start text-[12px] border-b border-[#DADCE0] last:border-b-0",
                r.warn && "bg-[#FEF7E0]/30",
              )}
            >
              <div className="col-span-4 flex items-start gap-2 min-w-0">
                <PrincipalIcon type={r.principalType} />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-[#202124] dark:text-white truncate">
                    {r.principal}
                  </div>
                  <div className="text-[10px] text-[#5F6368] mt-0.5">
                    {r.principalType === "group"
                      ? "Cloud Identity Group"
                      : r.principalType === "user"
                        ? "User"
                        : "Service Account"}
                  </div>
                </div>
              </div>
              <div className="col-span-3 space-y-1">
                {r.roles.map((role) => (
                  <div
                    key={role}
                    className="font-mono text-[10px] inline-block px-1.5 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8] mr-1"
                  >
                    {role}
                  </div>
                ))}
              </div>
              <div className="col-span-2 text-[11px]">{r.scope}</div>
              <div className="col-span-3 text-[11px]">
                {r.condition && (
                  <div className="font-mono text-[10px] bg-[#F8F9FA] rounded px-1.5 py-0.5 mb-1 break-all">
                    {r.condition}
                  </div>
                )}
                {r.warn && (
                  <div className="text-[#B26A00] flex items-start gap-1">
                    <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                    {r.warn}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Best practice */}
        <div className="rounded-lg border border-[#1A73E8]/30 bg-[#E8F0FE]/40 p-4 space-y-2">
          <div className="text-[13px] font-medium text-[#1A73E8] flex items-center gap-1.5">
            <ShieldCheck size={14} /> IAM 設計のチェックリスト
          </div>
          <ul className="text-[12px] text-[#3C4043] dark:text-white/80 leading-relaxed space-y-1 pl-5 list-disc">
            <li>個人にロールを直接付与せず、Cloud Identity Group 経由で付与</li>
            <li>Owner / Editor の使用は組織管理者・ブートストラップ時に限定</li>
            <li>外部監査人など期限付きアクセスは Conditional IAM で日時制限</li>
            <li>
              Service Account の作成は最小限。Workload Identity / WIF を優先
            </li>
            <li>
              四半期ごとに `gcloud asset search-all-iam-policies` で棚卸し
            </li>
          </ul>
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
  value: number;
  hint: string;
  tone?: "green" | "yellow" | "red";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "green"
          ? "border-[#34A853]/30 bg-[#E6F4EA]/40"
          : tone === "yellow"
            ? "border-[#FBBC05]/30 bg-[#FEF7E0]/40"
            : tone === "red"
              ? "border-[#EA4335]/30 bg-[#FCE8E6]/40"
              : "border-[#DADCE0] bg-white dark:bg-[#1F1F1F]",
      )}
    >
      <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
        {label}
      </div>
      <div className="font-display text-[22px] font-bold tabular-nums text-[#202124] dark:text-white leading-tight">
        {value}
      </div>
      <div className="text-[10px] text-[#5F6368]">{hint}</div>
    </div>
  );
}

function PrincipalIcon({ type }: { type: PrincipalType }) {
  if (type === "group") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#1A73E8]/15 text-[#1A73E8] flex items-center justify-center shrink-0">
        <Users size={13} />
      </div>
    );
  }
  if (type === "user") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#34A853]/15 text-[#137333] flex items-center justify-center shrink-0">
        <User size={13} />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-[#FBBC05]/15 text-[#B26A00] flex items-center justify-center shrink-0">
      <ShieldCheck size={13} />
    </div>
  );
}
