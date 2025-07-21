interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60000, // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier

  // Clean up expired entries
  if (store[key] && now > store[key].resetTime) {
    delete store[key]
  }

  // Initialize or get current data
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    }
  }

  const current = store[key]

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime,
    }
  }

  current.count++

  return {
    success: true,
    remaining: limit - current.count,
    resetTime: current.resetTime,
  }
}

export function getRateLimitHeaders(limit: number, remaining: number, resetTime: number): Record<string, string> {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
  }
}
