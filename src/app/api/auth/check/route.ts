import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "__session"

export async function GET() {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

    return NextResponse.json({
      authenticated: true,
      email: decoded.email,
      name: decoded.name ?? null,
      picture: decoded.picture ?? null,
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
