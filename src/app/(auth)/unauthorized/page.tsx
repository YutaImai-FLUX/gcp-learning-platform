"use client"

import { ShieldX, ArrowLeft } from "lucide-react"
import { auth as getAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function UnauthorizedPage() {
  async function handleSignOut() {
    await signOut(getAuth())
    await fetch("/api/auth/session", { method: "DELETE" })
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-2">
            <ShieldX size={32} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            アクセスが許可されていません
          </h1>
          <p className="text-sm text-muted-foreground">
            このアプリケーションを利用する権限がありません。
            <br />
            管理者にアクセス権の付与を依頼してください。
          </p>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            別のアカウントでログイン
          </button>
        </div>
      </div>
    </div>
  )
}
