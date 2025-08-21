import { NextRequest, NextResponse } from "next/server";
import { withPremium, AuthenticatedRequest } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

async function handler(request: AuthenticatedRequest) {
  try {
    // This is a premium-only endpoint
    const premiumFeatures = {
      aiAnalysis: true,
      advancedTemplates: true,
      exportFormats: ["pdf", "docx", "latex"],
      customBranding: true,
      prioritySupport: true,
    };

    return NextResponse.json({
      message: "Premium features accessed successfully",
      features: premiumFeatures,
      user: {
        id: request.user.id,
        subscriptionTier: request.user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error("Premium features error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An internal server error occurred",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withPremium(request, handler);
}