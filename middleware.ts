import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { rateLimit, getRateLimitHeaders } from "./lib/rate-limit"

export default withAuth(
  function middleware(req) {
    // Rate limiting for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const ip = req.ip ?? "127.0.0.1"
      const { success, remaining, resetTime } = rateLimit(ip, 100, 60000) // 100 requests per minute

      if (!success) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: getRateLimitHeaders(100, remaining, resetTime),
        })
      }

      const response = NextResponse.next()
      Object.entries(getRateLimitHeaders(100, remaining, resetTime)).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect chat and profile routes
        if (req.nextUrl.pathname.startsWith("/chat") || req.nextUrl.pathname.startsWith("/profile")) {
          return !!token
        }
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/chat/:path*", "/profile/:path*", "/api/:path*"],
}
