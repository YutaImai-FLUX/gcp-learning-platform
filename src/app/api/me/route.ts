import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  const headersList = headers()
  const raw = headersList.get("x-goog-authenticated-user-email") ?? ""
  const email = raw.replace("accounts.google.com:", "")

  return NextResponse.json({
    email: email || null,
  })
}
