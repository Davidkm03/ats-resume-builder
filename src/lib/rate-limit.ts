import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Create Redis instance - with fallback for development
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Different rate limits for different endpoints
export const rateLimits = redis ? {
  // Authentication endpoints - stricter limits
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 requests per 15 minutes
    analytics: true,
  }),
  
  // General API endpoints
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
    analytics: true,
  }),
  
  // AI endpoints - more restrictive
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
  }),
  
  // Premium AI endpoints - less restrictive for premium users
  aiPremium: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 m"), // 50 requests per minute
    analytics: true,
  }),
} : null;

/**
 * Apply rate limiting to a request
 */
export async function withRateLimit(
  request: NextRequest,
  limitType: string,
  identifier?: string
): Promise<NextResponse | null> {
  try {
    // Skip rate limiting if Redis is not configured (development mode)
    if (!rateLimits) {
      console.log("Rate limiting disabled: Redis not configured");
      return null;
    }
    
    // Use IP address as default identifier
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const id = identifier || ip;
    
    const rateLimit = rateLimits[limitType as keyof typeof rateLimits];
    if (!rateLimit) {
      console.log(`Rate limiter not found for type: ${limitType}`);
      return null;
    }
    const { success, limit, reset, remaining } = await rateLimit.limit(id);

    if (!success) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
            details: {
              limit,
              remaining,
              reset: new Date(reset),
            },
          },
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return null; // No rate limit exceeded
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Don't block requests if rate limiting fails
    return null;
  }
}

/**
 * Middleware wrapper for rate limiting
 */
export function createRateLimitedHandler(
  limitType: string,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = await withRateLimit(request, limitType);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(request);
  };
}

/**
 * Get user-specific rate limit identifier
 */
export function getUserRateLimitId(userId: string, ip: string): string {
  return `user:${userId}:${ip}`;
}