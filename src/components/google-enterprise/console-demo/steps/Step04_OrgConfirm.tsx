"use client";

import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import {
  Building2,
  Folder,
  FileText,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Step04_OrgConfirm() {
  return (
    <GcpConsoleShell
      navHighlightId="org"
      projectLabel="プロジェクトを選択"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["IAM と管理", "リソース管理"]}
      title="リソース管理"
      description="Cloud Identity のドメイン検証が完了し、組織ノードが自動で作成されました。すべてのリソースはこの組織配下で統制されます。"
      actions={
        <>
          <GcpButton variant="outlined" leadingIcon={<Plus size={14} />}>
            フォルダを作成
          </GcpButton>
          <GcpButton variant="filled" leadingIcon={<Plus size={14} />}>
            プロジェクトを作成
          </GcpButton>
        </>
      }
    >
      {/* Notice */}
      <div className="rounded border border-[#34A853]/40 bg-[#E6F4EA] px-3 py-2.5 mb-4 flex items-start gap-2 text-[13px]">
        <Check size={16} className="text-[#137333] mt-0.5 shrink-0" />
        <div>
          <strong className="text-[#137333]">組織が確立されました: </strong>
          <span className="font-mono text-[12px]">yamatoseiki.co.jp</span>。
          以降のリソースはすべてこの組織配下に作成されます。
        </div>
      </div>

      {/* Resource tree */}
      <div className="rounded border border-[#DADCE0] bg-white dark:bg-[#1F1F1F]">
        <div className="grid grid-cols-12 px-4 py-2 border-b border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] text-[11px] font-medium text-[#5F6368] uppercase tracking-wider">
          <div className="col-span-6">名前</div>
          <div className="col-span-2">タイプ</div>
          <div className="col-span-3">ID</div>
          <div className="col-span-1">状態</div>
        </div>

        {/* Organization row */}
        <Row
          icon={Building2}
          iconColor="text-[#1A73E8]"
          name="yamatoseiki.co.jp"
          type="組織"
          id="organizations/123456789012"
          highlight
          chip={<GcpChip tone="blue">組織</GcpChip>}
        />

        {/* Empty state under org */}
        <div className="px-4 py-8 text-center text-[#5F6368] border-t border-[#DADCE0]">
          <Folder size={28} className="mx-auto mb-2 opacity-50" />
          <div className="text-[13px] mb-1">プロジェクトはまだありません</div>
          <div className="text-[11px]">
            次のステップで Gemini Enterprise
            を配置するプロジェクトを作成します。
          </div>
        </div>
      </div>

      {/* Identity Details */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card
          title="アイデンティティ"
          rows={[
            ["プロバイダ", "Cloud Identity Free"],
            ["プライマリドメイン", "yamatoseiki.co.jp"],
            ["管理者", "admin@yamatoseiki.co.jp"],
            ["ユーザー数", "1"],
          ]}
        />
        <Card
          title="プラットフォーム"
          rows={[
            ["組織 ID", "123456789012"],
            ["デフォルトロケーション", "asia-northeast1 (東京)"],
            ["IAM ポリシー", "未設定"],
            ["請求アカウント", "未紐付け"],
          ]}
        />
      </div>

      {/* Quickstart */}
      <div className="mt-4 rounded border border-[#DADCE0] bg-white dark:bg-[#1F1F1F]">
        <div className="px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#202124] dark:text-white">
            おすすめの次のアクション
          </span>
        </div>
        <ul className="divide-y divide-[#DADCE0]">
          {[
            {
              icon: FileText,
              text: "請求アカウントを作成する (Step 5)",
              current: true,
            },
            {
              icon: Folder,
              text: "Gemini Enterprise 用プロジェクトを作成する (Step 6)",
              current: false,
            },
            {
              icon: FileText,
              text: "必要な API を有効化する (Step 7)",
              current: false,
            },
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <li
                key={i}
                className={cn(
                  "px-4 py-3 flex items-center gap-3 text-[13px]",
                  act.current && "bg-[#E8F0FE]/40",
                )}
              >
                <Icon size={16} className="text-[#1A73E8]" />
                <span className="flex-1">{act.text}</span>
                <ChevronRight size={14} className="text-[#5F6368]" />
              </li>
            );
          })}
        </ul>
      </div>
    </GcpConsoleShell>
  );
}

function Row({
  icon: Icon,
  iconColor,
  name,
  type,
  id,
  chip,
  highlight,
}: {
  icon: React.ElementType;
  iconColor: string;
  name: string;
  type: string;
  id: string;
  chip?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 px-4 py-3 items-center text-[13px]",
        highlight && "bg-[#F8F9FA] dark:bg-[#28292C]",
      )}
    >
      <div className="col-span-6 flex items-center gap-2">
        <Icon size={18} className={iconColor} />
        <span className="font-medium text-[#202124] dark:text-white">
          {name}
        </span>
      </div>
      <div className="col-span-2">
        {chip ?? <span className="text-[#5F6368]">{type}</span>}
      </div>
      <div className="col-span-3 font-mono text-[11px] text-[#5F6368] truncate">
        {id}
      </div>
      <div className="col-span-1">
        <GcpChip tone="green" icon={<Check size={10} />}>
          有効
        </GcpChip>
      </div>
    </div>
  );
}

function Card({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded border border-[#DADCE0] bg-white dark:bg-[#1F1F1F]">
      <div className="px-4 py-2.5 border-b border-[#DADCE0]">
        <span className="text-[13px] font-medium text-[#202124] dark:text-white">
          {title}
        </span>
      </div>
      <dl className="px-4 py-3 space-y-2 text-[12px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <dt className="text-[#5F6368]">{k}</dt>
            <dd className="text-[#202124] dark:text-white font-mono text-[11px] truncate text-right">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
