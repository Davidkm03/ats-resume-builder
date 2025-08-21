import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Check premium routes
    const premiumRoutes = [
      "/premium",
      "/ai/advanced",
      "/templates/premium",
      "/export/advanced",
    ];

    if (premiumRoutes.some(route => pathname.startsWith(route))) {
      const isPremium = token?.subscriptionTier === "premium" || token?.subscriptionTier === "pro";
      const isSubscriptionActive = token?.subscriptionExpiresAt 
        ? new Date() < new Date(token.subscriptionExpiresAt as Date)
        : false;

      if (!isPremium || !isSubscriptionActive) {
        return NextResponse.redirect(new URL("/upgrade", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
          "/auth/forgot-password",
          "/api/auth",
          "/api/health",
        ];

        // Allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};