"use client";

import { useState } from "react";
import { DnsProviderShell } from "../shell/DnsProviderShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpChip } from "../primitives/GcpChip";
import { Check, Copy, Plus, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const GOOGLE_TXT = "google-site-verification=4f2a8e7b9c1d3a6f8e0b5c2d9a7e1f3b";

interface DnsRecord {
  host: string;
  type: string;
  ttl: number;
  value: string;
  status: "active" | "pending";
}

const INITIAL_RECORDS: DnsRecord[] = [
  { host: "@", type: "A", ttl: 3600, value: "203.0.113.10", status: "active" },
  {
    host: "www",
    type: "CNAME",
    ttl: 3600,
    value: "yamatoseiki.co.jp.",
    status: "active",
  },
  {
    host: "@",
    type: "MX",
    ttl: 3600,
    value: "10 aspmx.l.google.com.",
    status: "active",
  },
];

export function Step03_DomainTxtVerify() {
  const [records, setRecords] = useState<DnsRecord[]>(INITIAL_RECORDS);
  const [txtValue, setTxtValue] = useState(GOOGLE_TXT);
  const [copied, setCopied] = useState(false);

  const txtAdded = records.some(
    (r) => r.type === "TXT" && r.value === GOOGLE_TXT,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_TXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handleAdd = () => {
    if (txtAdded || !txtValue) return;
    setRecords([
      ...records,
      { host: "@", type: "TXT", ttl: 3600, value: txtValue, status: "pending" },
    ]);
  };

  return (
    <DnsProviderShell
      domain="yamatoseiki.co.jp"
      title="DNSレコード設定"
      description="Google から発行された TXT レコードを追加し、ドメイン所有権を証明します。"
    >
      <div className="space-y-5">
        {/* Google-issued TXT */}
        <div className="rounded-md border-l-4 border-[#1A73E8] bg-[#E8F0FE]/60 dark:bg-[#1A73E8]/10 p-4 space-y-3">
          <div className="text-[13px] font-medium text-[#202124] dark:text-white">
            Google が発行した TXT レコード値（このまま登録してください）
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] text-[12px] font-mono break-all text-[#202124] dark:text-white">
              {GOOGLE_TXT}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-[12px] border border-[#DADCE0] hover:bg-white dark:hover:bg-[#1F1F1F]"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-[#137333]" /> コピー済み
                </>
              ) : (
                <>
                  <Copy size={12} /> コピー
                </>
              )}
            </button>
          </div>
        </div>

        {/* New TXT add form */}
        <div className="rounded border border-[#DADCE0] bg-white dark:bg-[#1F1F1F]">
          <div className="px-3 py-2 border-b border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#202124] dark:text-white">
              レコード追加
            </span>
            <span className="text-[10px] text-[#5F6368]">
              対象ドメイン: yamatoseiki.co.jp
            </span>
          </div>
          <div className="p-3 grid grid-cols-12 gap-2 items-end">
            <FormField label="ホスト名" cols={2}>
              <input
                value="@"
                readOnly
                className="w-full px-2 py-1.5 rounded border border-[#DADCE0] text-[13px] bg-[#F8F9FA]"
              />
            </FormField>
            <FormField label="TYPE" cols={2}>
              <input
                value="TXT"
                readOnly
                className="w-full px-2 py-1.5 rounded border border-[#DADCE0] text-[13px] bg-[#F8F9FA] font-mono"
              />
            </FormField>
            <FormField label="TTL" cols={2}>
              <input
                value="3600"
                readOnly
                className="w-full px-2 py-1.5 rounded border border-[#DADCE0] text-[13px] bg-[#F8F9FA] font-mono"
              />
            </FormField>
            <FormField label="VALUE" cols={6}>
              <input
                value={txtValue}
                onChange={(e) => setTxtValue(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-[#DADCE0] text-[12px] font-mono"
              />
            </FormField>
            <div className="col-span-12 flex justify-end gap-2 pt-1">
              <GcpButton
                variant="outlined"
                size="sm"
                onClick={() => setTxtValue("")}
              >
                クリア
              </GcpButton>
              <GcpButton
                variant="filled"
                size="sm"
                leadingIcon={<Plus size={13} />}
                onClick={handleAdd}
                disabled={txtAdded}
              >
                {txtAdded ? "追加済み" : "追加"}
              </GcpButton>
            </div>
          </div>
        </div>

        {/* DNS Records table */}
        <div className="rounded border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] overflow-hidden">
          <div className="px-3 py-2 border-b border-[#DADCE0] bg-[#F8F9FA] dark:bg-[#28292C] flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#202124] dark:text-white">
              現在の DNS レコード ({records.length} 件)
            </span>
          </div>
          <table className="w-full text-[12px]">
            <thead className="bg-[#F8F9FA] dark:bg-[#28292C]">
              <tr className="text-left text-[#5F6368]">
                <Th>HOST</Th>
                <Th>TYPE</Th>
                <Th>TTL</Th>
                <Th>VALUE</Th>
                <Th>STATUS</Th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-t border-[#DADCE0]",
                    r.status === "pending" && "bg-[#FEF7E0]/40",
                  )}
                >
                  <Td>{r.host}</Td>
                  <Td>
                    <span
                      className={cn(
                        "font-mono font-bold",
                        r.type === "TXT" &&
                          r.status === "pending" &&
                          "text-[#B26A00]",
                      )}
                    >
                      {r.type}
                    </span>
                  </Td>
                  <Td>{r.ttl}</Td>
                  <Td>
                    <span className="font-mono break-all">{r.value}</span>
                  </Td>
                  <Td>
                    {r.status === "active" ? (
                      <GcpChip tone="green" icon={<Check size={10} />}>
                        Active
                      </GcpChip>
                    ) : (
                      <GcpChip tone="yellow" icon={<Clock size={10} />}>
                        反映待ち
                      </GcpChip>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verify button (Google管理コンソール側のアクション風) */}
        {txtAdded && (
          <div className="rounded-md border border-[#34A853]/40 bg-[#E6F4EA] p-3 text-[12px] leading-relaxed">
            <div className="flex items-start gap-2">
              <Check size={14} className="text-[#137333] mt-0.5 shrink-0" />
              <div>
                TXT レコードが追加されました。続いて Google
                管理コンソールの「ドメインを確認」ボタンで検証を実行してください。
                反映には DNS の TTL に応じて数分〜数時間かかることがあります。
              </div>
            </div>
          </div>
        )}
        {!txtAdded && (
          <div className="rounded-md border border-[#FBBC05]/40 bg-[#FEF7E0] p-3 text-[12px] leading-relaxed flex items-start gap-2">
            <AlertTriangle
              size={14}
              className="text-[#B26A00] mt-0.5 shrink-0"
            />
            <span>
              まだ TXT レコードが追加されていません。Google
              から発行された値を「追加」ボタンで登録してください。
            </span>
          </div>
        )}
      </div>
    </DnsProviderShell>
  );
}

function FormField({
  label,
  cols,
  children,
}: {
  label: string;
  cols: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`col-span-${cols}`}
      style={{ gridColumn: `span ${cols} / span ${cols}` }}
    >
      <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">
        {label}
      </div>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>;
}
