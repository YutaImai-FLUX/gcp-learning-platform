"use client";

import { useState } from "react";
import { GcpConsoleShell } from "../shell/GcpConsoleShell";
import { GcpButton } from "../primitives/GcpButton";
import { GcpInput } from "../primitives/GcpInput";
import { GcpSelect } from "../primitives/GcpSelect";
import { GcpToggle } from "../primitives/GcpToggle";
import { GcpChip } from "../primitives/GcpChip";
import {
  KeyRound,
  Network,
  ChevronLeft,
  ShieldCheck,
  AlertTriangle,
  Check,
  Lock,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "cmek" | "vpcsc";

export function Step20_CmekVpcSc() {
  const [tab, setTab] = useState<Tab>("cmek");

  return (
    <GcpConsoleShell
      navHighlightId="iam"
      projectLabel="gemini-poc-prod"
      organizationLabel="yamatoseiki.co.jp"
      breadcrumb={
        tab === "cmek"
          ? ["セキュリティ", "Cloud KMS", "鍵リング", "ge-keyring"]
          : ["セキュリティ", "VPC Service Controls", "Perimeter"]
      }
      title="CMEK & VPC Service Controls"
      description="顧客管理鍵 (CMEK) でデータを暗号化し、VPC Service Controls で API のデータ流出経路を封じます。金融・公共・医療では必須要件。"
      actions={
        <GcpButton variant="text" leadingIcon={<ChevronLeft size={14} />}>
          セキュリティ ホーム
        </GcpButton>
      }
    >
      <div className="space-y-5">
        {/* Tabs */}
        <div className="border-b border-[#DADCE0] -mt-1">
          <div className="flex items-center gap-6 text-[13px]">
            <TabItem
              label="Cloud KMS / CMEK"
              icon={KeyRound}
              active={tab === "cmek"}
              onClick={() => setTab("cmek")}
            />
            <TabItem
              label="VPC Service Controls"
              icon={Network}
              active={tab === "vpcsc"}
              onClick={() => setTab("vpcsc")}
            />
          </div>
        </div>

        {tab === "cmek" ? <CmekPanel /> : <VpcScPanel />}
      </div>
    </GcpConsoleShell>
  );
}

function CmekPanel() {
  const [keyName, setKeyName] = useState("ge-datastore-key");
  const [location, setLocation] = useState("asia-northeast1");
  const [rotation, setRotation] = useState("90");
  const [protection, setProtection] = useState("software");
  const [boundToDataStore, setBoundToDataStore] = useState(true);

  return (
    <div className="space-y-5">
      {/* Keyring */}
      <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
        <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white mb-1">
          鍵リング: <code className="font-mono text-[13px]">ge-keyring</code>
        </div>
        <div className="text-[11px] text-[#5F6368] mb-4">
          asia-northeast1 (東京) · 1 鍵作成済み
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GcpInput
            label="鍵名"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            required
          />
          <GcpSelect
            label="ロケーション"
            value={location}
            onChange={setLocation}
            options={[
              { value: "asia-northeast1", label: "asia-northeast1 (東京)" },
              { value: "asia-northeast2", label: "asia-northeast2 (大阪)" },
              { value: "global", label: "global (multi-region)" },
            ]}
            helperText="Data Store と同一ロケーション必須"
          />
          <GcpSelect
            label="保護レベル"
            value={protection}
            onChange={setProtection}
            options={[
              { value: "software", label: "ソフトウェア (標準)" },
              { value: "hsm", label: "HSM (FIPS 140-2 Level 3)" },
              { value: "external", label: "External Key Manager (EKM)" },
            ]}
            helperText="金融案件は HSM、超機密案件は EKM"
          />
          <GcpSelect
            label="自動ローテーション"
            value={rotation}
            onChange={setRotation}
            options={[
              { value: "30", label: "30 日" },
              { value: "90", label: "90 日 (推奨)" },
              { value: "365", label: "365 日" },
              { value: "off", label: "無効" },
            ]}
          />
        </div>
      </section>

      {/* Binding */}
      <section className="rounded-lg border-2 border-[#1A73E8]/30 bg-[#E8F0FE]/30 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-[#1A73E8]" />
          <div className="text-[14px] font-medium font-display text-[#202124] dark:text-white">
            Data Store への鍵バインド
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-3 py-2 rounded bg-white border border-[#DADCE0]">
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
              対象データストア
            </div>
            <div className="font-mono text-[12px] mt-0.5">
              sp-internal-knowledge
            </div>
          </div>
          <div className="px-3 py-2 rounded bg-white border border-[#DADCE0]">
            <div className="text-[10px] text-[#5F6368] uppercase tracking-wider">
              鍵 (CMEK)
            </div>
            <div className="font-mono text-[11px] mt-0.5 text-[#1A73E8] break-all">
              projects/.../locations/{location}/keyRings/ge-keyring/cryptoKeys/
              {keyName}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1A73E8]/20">
          <div className="text-[12px]">
            <div className="font-medium">CMEK を Data Store に紐付ける</div>
            <div className="text-[11px] text-[#5F6368]">
              Google デフォルト暗号化 → 顧客管理鍵に切り替え
            </div>
          </div>
          <GcpToggle
            checked={boundToDataStore}
            onChange={setBoundToDataStore}
          />
        </div>
      </section>

      {/* Pitfall */}
      <div className="rounded border border-[#FBBC05]/40 bg-[#FEF7E0] px-3 py-2 text-[11px] leading-relaxed flex items-start gap-2">
        <AlertTriangle size={13} className="text-[#B26A00] mt-0.5 shrink-0" />
        <span>
          <strong>鍵を削除すると暗号化データは永久に復号不可</strong>。Cloud KMS
          は 24 時間の遅延削除 (destroy scheduled) 機能あり。誤削除防止に IAM
          `cloudkms.cryptoKeyVersionsDestroyer`
          ロールを情シス管理者だけに限定すること。
        </span>
      </div>
    </div>
  );
}

function VpcScPanel() {
  const [perimeterName, setPerimeterName] = useState("ge-data-perimeter");
  const [mode, setMode] = useState<"dryrun" | "enforce">("dryrun");
  const [services, setServices] = useState<Record<string, boolean>>({
    "discoveryengine.googleapis.com": true,
    "storage.googleapis.com": true,
    "bigquery.googleapis.com": true,
    "aiplatform.googleapis.com": true,
    "cloudkms.googleapis.com": true,
  });

  return (
    <div className="space-y-5">
      {/* Perimeter basic */}
      <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
        <div className="text-[14px] font-medium font-display mb-3">
          サービス境界 (Perimeter)
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GcpInput
            label="境界名"
            value={perimeterName}
            onChange={(e) => setPerimeterName(e.target.value)}
            required
          />
          <GcpSelect
            label="モード"
            value={mode}
            onChange={(v) => setMode(v as "dryrun" | "enforce")}
            options={[
              { value: "dryrun", label: "Dry-run (ログのみ・推奨で開始)" },
              { value: "enforce", label: "Enforce (実際にブロック)" },
            ]}
            helperText="Dry-run で違反ログを確認 → Enforce 切替"
          />
        </div>
      </section>

      {/* Protected services */}
      <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-medium font-display">
            保護対象 API
          </div>
          <GcpChip tone="blue">
            {Object.values(services).filter(Boolean).length} / 5 有効
          </GcpChip>
        </div>
        <div className="space-y-2">
          {Object.entries(services).map(([svc, on]) => (
            <div
              key={svc}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded border transition-colors",
                on
                  ? "border-[#34A853]/40 bg-[#E6F4EA]/40"
                  : "border-[#DADCE0] bg-white",
              )}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={14}
                  className={on ? "text-[#137333]" : "text-[#5F6368]"}
                />
                <code className="font-mono text-[12px]">{svc}</code>
              </div>
              <GcpToggle
                checked={on}
                onChange={(v) => setServices((m) => ({ ...m, [svc]: v }))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ingress/Egress */}
      <section className="rounded-lg border border-[#DADCE0] bg-white dark:bg-[#1F1F1F] p-5 space-y-3">
        <div className="text-[14px] font-medium font-display">
          Ingress / Egress ルール
        </div>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="rounded border border-[#DADCE0] p-3">
            <div className="text-[#5F6368] uppercase text-[10px] tracking-wider mb-1">
              Ingress (許可された侵入)
            </div>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                Workforce Pool:{" "}
                <span className="font-mono">wif-employees-pool</span>
              </li>
              <li>
                IP 範囲: <span className="font-mono">203.0.113.0/24</span>{" "}
                (本社)
              </li>
              <li>VPN 経由のアクセス</li>
            </ul>
          </div>
          <div className="rounded border border-[#DADCE0] p-3">
            <div className="text-[#5F6368] uppercase text-[10px] tracking-wider mb-1">
              Egress (許可された外向き)
            </div>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>SharePoint コネクタ → graph.microsoft.com</li>
              <li>Cloud Monitoring → Google マネージド</li>
              <li>その他はすべて拒否</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Status */}
      <div
        className={cn(
          "rounded border-2 p-3 flex items-start gap-2",
          mode === "enforce"
            ? "border-[#34A853]/50 bg-[#E6F4EA]/40"
            : "border-[#FBBC05]/50 bg-[#FEF7E0]",
        )}
      >
        {mode === "enforce" ? (
          <Check size={14} className="text-[#137333] mt-0.5" />
        ) : (
          <RefreshCcw size={14} className="text-[#B26A00] mt-0.5" />
        )}
        <div className="text-[12px] leading-relaxed">
          {mode === "enforce" ? (
            <>
              <strong>Enforce モード:</strong>{" "}
              違反アクセスは即座にブロックされ、Cloud Audit Log に
              `accessPolicyDeniedReason` が記録されます。
            </>
          ) : (
            <>
              <strong>Dry-run モード:</strong>{" "}
              違反は許可しつつログだけ記録。Logs Explorer で
              `vpcServiceControlsUniqueId` をフィルタしてから Enforce
              に切替えること。
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <GcpButton variant="outlined">違反ログを確認</GcpButton>
        <GcpButton variant="filled">境界を保存</GcpButton>
      </div>
    </div>
  );
}

function TabItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 -mb-px pb-2.5 border-b-2 transition-colors",
        active
          ? "border-[#1A73E8] text-[#1A73E8] font-medium"
          : "border-transparent text-[#5F6368] hover:text-[#202124]",
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
