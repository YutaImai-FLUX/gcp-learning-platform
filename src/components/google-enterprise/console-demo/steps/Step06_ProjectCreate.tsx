"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import { ChevronLeft, Edit2 } from "lucide-react";

export function Step06_ProjectCreate() {
  const [projectName, setProjectName] = useState("Gemini Enterprise PoC");
  const [projectId, setProjectId] = useState("gemini-poc-prod-23874");
  const [editingId, setEditingId] = useState(false);

  return (
    <GcpConsoleShell
      navHighlightId="home"
      projectLabel="プロジェクトを選択"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["プロジェクト", "新しいプロジェクト"]}
      title="新しいプロジェクト"
      description="このプロジェクトには Gemini Enterprise のリソース（Workforce Pool / Subscription / Data Store 等）が配置されます。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          戻る
        </GcpButton>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="rounded-lg border border-[#FBBC05]/40 bg-[#FEF7E0] p-3 text-[12px] leading-relaxed text-[#202124]">
            プロジェクト ID
            は作成後に変更できません。命名規則を事前に決めて、組織内で一意になる
            ID にしてください。
          </div>

          <div className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5 space-y-5">
            <GcpInput
              label="プロジェクト名"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />

            {/* Project ID with edit toggle */}
            <div>
              <div className="text-[11px] text-[#5F6368] mb-1">
                プロジェクト ID
              </div>
              <div className="flex items-center gap-2">
                {editingId ? (
                  <GcpInput
                    label="プロジェクト ID"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  />
                ) : (
                  <>
                    <code className="px-3 py-2 rounded border border-[#DADCE0] bg-[#F8F9FA] text-[13px] font-mono flex-1 text-[#202124]">
                      {projectId}
                    </code>
                    <GcpButton
                      variant="text"
                      size="sm"
                      leadingIcon={<Edit2 size={12} />}
                      onClick={() => setEditingId(true)}
                    >
                      編集
                    </GcpButton>
                  </>
                )}
              </div>
              <div className="text-[11px] text-[#5F6368] mt-1">
                プロジェクト ID は変更不可。6〜30 文字、小文字英数字とハイフン。
              </div>
            </div>

            {/* Location selector mock */}
            <div>
              <div className="text-[11px] text-[#5F6368] mb-1">場所 *</div>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#DADCE0] bg-white">
                <div>
                  <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                    yamatoseiki.co.jp
                  </div>
                  <div className="text-[11px] text-[#5F6368]">組織</div>
                </div>
                <GcpButton variant="text" size="sm">
                  参照
                </GcpButton>
              </div>
              <div className="text-[11px] text-[#5F6368] mt-1">
                親リソース。プロジェクトはこの組織配下に作成されます。
              </div>
            </div>

            {/* Billing */}
            <div>
              <div className="text-[11px] text-[#5F6368] mb-1">
                請求アカウント *
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#34A853]/40 bg-[#E6F4EA]">
                <div>
                  <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                    ge-billing-primary
                  </div>
                  <div className="text-[11px] text-[#5F6368]">
                    JPY · リセラー請求書払い · 紐付け可
                  </div>
                </div>
                <GcpChip tone="green">紐付け中</GcpChip>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <GcpButton variant="text">キャンセル</GcpButton>
            <GcpButton variant="filled">作成</GcpButton>
          </div>
        </div>

        {/* Summary */}
        <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white mb-3">
            作成後のリソース構造
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-[#202124] dark:text-white space-y-0.5">
            <div>
              📁 yamatoseiki.co.jp{" "}
              <span className="text-[#5F6368]">(組織)</span>
            </div>
            <div className="pl-3">└─ 📦 {projectName}</div>
            <div className="pl-9 text-[#5F6368]">
              ID: <span className="text-[#1A73E8]">{projectId}</span>
            </div>
            <div className="pl-9 text-[#5F6368]">請求: ge-billing-primary</div>
            <div className="pl-9 text-[#5F6368]">API: 未有効化 (次の Step)</div>
          </div>
          <div className="mt-3 text-[11px] text-[#5F6368] leading-relaxed border-t border-[#DADCE0] pt-3">
            作成後、このプロジェクトに対して API 有効化 / IAM 設定 / Workforce
            Pool 設定を順次行います。
          </div>
        </aside>
      </div>
    </GcpConsoleShell>
  );
}
