import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add future logic like auth, rate limiting, etc. here
  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}