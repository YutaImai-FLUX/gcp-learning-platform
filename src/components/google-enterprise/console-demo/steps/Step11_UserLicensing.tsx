"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import { Users, Sparkles, AlertTriangle } from "lucide-react";

export function Step11_UserLicensing() {
  const [region, setRegion] = useState("global");
  const [autoAssign, setAutoAssign] = useState(true);
  const assigned = autoAssign ? 12 : 0;
  const total = 50;

  return (
    <GcpConsoleShell
      navHighlightId="ge"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={["Gemini Enterprise", "ユーザー管理"]}
      title="ユーザー管理 - ライセンス自動割当"
      description="購入したサブスクリプションを WIF プール経由でログインするユーザーに自動付与する設定を行います。"
      actions={
        <GcpButton variant="outlined" size="sm">
          ユーザー一覧 (CSV)
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Tabs */}
        <div className="border-b border-[#DADCE0] -mt-1">
          <div className="flex items-center gap-6 text-[13px]">
            <TabItem label="ユーザー" active />
            <TabItem label="グループ" />
            <TabItem label="サブスクリプション" />
            <TabItem label="アクセス監査" />
          </div>
        </div>

        {/* Region + summary */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
              <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-3">
                マルチリージョン
              </div>
              <GcpSelect
                label="ライセンスを適用するリージョン"
                value={region}
                onChange={setRegion}
                options={[
                  { value: "global", label: "global (世界共通 - 推奨)" },
                  { value: "us", label: "us (米国データセンター)" },
                  { value: "eu", label: "eu (欧州データセンター)" },
                ]}
                helperText="データ所在地に強い要件がない場合は global が推奨。"
              />
            </section>

            {/* Auto-assign */}
            <section className="rounded-lg border-2 border-[#1A73E8] bg-[#E8F0FE]/30 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
                        Assign licenses automatically
                      </div>
                      <div className="text-[12px] text-[#5F6368] mt-0.5 leading-relaxed max-w-xl">
                        WIF プール{" "}
                        <code className="font-mono px-1 bg-white rounded text-[#1A73E8]">
                          wif-employees-pool
                        </code>{" "}
                        からサインインしたユーザーに、初回アクセス時に空きライセンスを動的付与します。
                      </div>
                    </div>
                    <GcpToggle checked={autoAssign} onChange={setAutoAssign} />
                  </div>
                  {!autoAssign && (
                    <div className="mt-3 flex items-start gap-2 text-[12px] text-[#B26A00] bg-[#FEF7E0] border border-[#FBBC05]/40 rounded p-2.5">
                      <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                      <span>
                        手動割当は数百名規模の本番運用では破綻します。50
                        名のメール手入力は転記ミスでサポート問合せが多発するので、自動割当を有効にすることを推奨します。
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Recent activity table */}
            <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F]">
              <div className="px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between">
                <div className="text-[13px] font-medium text-[#202124] dark:text-white">
                  最近の割当アクティビティ
                </div>
                <GcpChip tone="neutral">直近 24 時間</GcpChip>
              </div>
              <table className="w-full text-[12px]">
                <thead className="bg-[#F8F9FA] text-[#5F6368]">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                      プール
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                      割当方法
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider">
                      時刻
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DADCE0]">
                  {[
                    {
                      u: "sato.misaki@yamatoseiki.co.jp",
                      m: "自動",
                      time: "2分前",
                    },
                    {
                      u: "yamada.kenji@yamatoseiki.co.jp",
                      m: "自動",
                      time: "15分前",
                    },
                    {
                      u: "kawamoto.taro@yamatoseiki.co.jp",
                      m: "自動",
                      time: "1時間前",
                    },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5 font-mono text-[11px]">
                        {r.u}
                      </td>
                      <td className="px-4 py-2.5 text-[#5F6368]">
                        wif-employees-pool
                      </td>
                      <td className="px-4 py-2.5">
                        <GcpChip tone="blue">{r.m}</GcpChip>
                      </td>
                      <td className="px-4 py-2.5 text-[#5F6368]">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          {/* Right: usage */}
          <aside className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] p-4 h-fit sticky top-4 space-y-3">
            <div className="text-[13px] font-medium text-[#202124] dark:text-white flex items-center gap-2">
              <Users size={14} className="text-[#1A73E8]" /> ライセンス使用状況
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[28px] font-bold text-[#202124] dark:text-white tabular-nums">
                  {assigned}
                </span>
                <span className="text-[12px] text-[#5F6368]">
                  / {total} シート
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#E8EAED]">
                <div
                  className="h-full rounded-full bg-[#1A73E8] transition-all"
                  style={{ width: `${(assigned / total) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-[#5F6368] mt-1">
                使用率 {Math.round((assigned / total) * 100)}%
              </div>
            </div>
            <div className="border-t border-[#DADCE0] pt-3 text-[11px] text-[#5F6368] leading-relaxed">
              シートが足りなくなった場合は Step 10
              のサブスクリプション画面から追加購入可能 (即時反映)。
            </div>
          </aside>
        </div>
      </div>
    </GcpConsoleShell>
  );
}

function TabItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`-mb-px pb-2.5 border-b-2 ${
        active
          ? "border-[#1A73E8] text-[#1A73E8] font-medium"
          : "border-transparent text-[#5F6368] hover:text-[#202124]"
      }`}
    >
      {label}
    </button>
  );
}
