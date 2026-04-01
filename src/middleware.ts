import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "__session"

const PUBLIC_PATHS = ["/login", "/unauthorized", "/api/auth/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公開パスはスキップ
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 静的アセット・Next.js内部はスキップ
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/icons/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // セッションCookieの存在チェック
  const session = request.cookies.get(SESSION_COOKIE_NAME)

  if (!session?.value) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
