"use client";

import { useState } from "react";
import { AccountsShell } from "../shell/AccountsShell";
import { GcpInput } from "../primitives/GcpInput";
import { GcpButton } from "../primitives/GcpButton";
import { Eye, EyeOff } from "lucide-react";

export function Step01_GoogleAccountCreate() {
  const [lastName, setLastName] = useState("田中");
  const [firstName, setFirstName] = useState("正樹");
  const [username, setUsername] = useState("yamato.admin");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  return (
    <AccountsShell
      title="Google アカウントの作成"
      description="この管理者アカウントで Google Workspace / Cloud Identity に申し込みます。"
      illustrationCaption="どのGoogleサービスでも、このアカウント1つでサインインできます。"
    >
      <div className="grid grid-cols-2 gap-4">
        <GcpInput
          label="姓"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <GcpInput
          label="名"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-4">
        <GcpInput
          label="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          helperText="半角英数字、ピリオド (.) を使用できます"
          trailing={
            <span className="text-[14px] text-[#5F6368]">@gmail.com</span>
          }
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <GcpInput
            label="パスワード"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <GcpInput
            label="確認"
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            errorText={
              confirm && confirm !== password
                ? "パスワードが一致しません"
                : undefined
            }
            required
          />
        </div>
        <label className="flex items-center gap-2 text-[12px] text-[#5F6368] cursor-pointer">
          <input
            type="checkbox"
            checked={showPw}
            onChange={(e) => setShowPw(e.target.checked)}
            className="accent-[#1A73E8]"
          />
          {showPw ? (
            <span className="flex items-center gap-1">
              <Eye size={12} /> パスワードを表示しています
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <EyeOff size={12} /> パスワードを表示
            </span>
          )}
        </label>
      </div>
      <div className="flex items-center justify-between pt-4">
        <button className="text-[14px] text-[#1A73E8] hover:underline">
          代わりにログイン
        </button>
        <GcpButton variant="filled">次へ</GcpButton>
      </div>
    </AccountsShell>
  );
}
