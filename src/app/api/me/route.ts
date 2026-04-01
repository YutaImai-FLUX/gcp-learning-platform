import { NextResponse } from "next/server"
import { headers, cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

const SESSION_COOKIE_NAME = "__session"

export async function GET() {
  // 1. Firebase Auth セッションCookieから取得（優先）
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
      return NextResponse.json({
        email: decoded.email ?? null,
        name: decoded.name ?? null,
        picture: decoded.picture ?? null,
        source: "firebase",
      })
    } catch {
      // Cookie無効 → IAP fallback
    }
  }

  // 2. IAP ヘッダーから取得（フォールバック）
  const headersList = headers()
  const raw = headersList.get("x-goog-authenticated-user-email") ?? ""
  const email = raw.replace("accounts.google.com:", "")

  return NextResponse.json({
    email: email || null,
    name: null,
    picture: null,
    source: email ? "iap" : null,
  })
}
