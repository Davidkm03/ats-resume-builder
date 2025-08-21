import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name: string | null;
    subscriptionTier: string;
    subscriptionExpiresAt: Date | null;
  };
}

/**
 * Middleware to authenticate API requests
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    // Add user data to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string | null,
      subscriptionTier: token.subscriptionTier as string,
      subscriptionExpiresAt: token.subscriptionExpiresAt as Date | null,
    };

    return await handler(authenticatedRequest);
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Authentication failed",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Middleware to check if user has premium subscription
 */
export async function withPremium(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const { subscriptionTier, subscriptionExpiresAt } = req.user;

    // Check if user has premium subscription
    const isPremium = subscriptionTier === "premium" || subscriptionTier === "pro";
    const isSubscriptionActive = subscriptionExpiresAt ? new Date() < subscriptionExpiresAt : false;

    if (!isPremium || !isSubscriptionActive) {
      return NextResponse.json(
        {
          error: {
            code: "PREMIUM_REQUIRED",
            message: "This feature requires a premium subscription",
          },
        },
        { status: 403 }
      );
    }

    return await handler(req);
  });
}

/**
 * Helper function to get current user from request
 */
export async function getCurrentUser(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return null;
    }

    return {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string | null,
      subscriptionTier: token.subscriptionTier as string,
      subscriptionExpiresAt: token.subscriptionExpiresAt as Date | null,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}