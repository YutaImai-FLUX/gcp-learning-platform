import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "__session"
const SESSION_EXPIRY_DAYS = 5
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    const decoded = await adminAuth.verifyIdToken(idToken)
    const email = decoded.email

    if (!email) {
      return NextResponse.json({ error: "メールアドレスが取得できません" }, { status: 400 })
    }

    // Firestore allowedUsers コレクションで許可チェック
    const snapshot = await adminDb
      .collection("allowedUsers")
      .where("email", "==", email.toLowerCase())
      .where("active", "==", true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json({ error: "アクセスが許可されていません" }, { status: 403 })
    }

    // セッションCookie作成
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    })

    cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json({ status: "ok" })
  } catch (err) {
    const message = err instanceof Error ? err.message : "認証エラー"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

export async function DELETE() {
  cookies().delete(SESSION_COOKIE_NAME)
  return NextResponse.json({ status: "ok" })
}
