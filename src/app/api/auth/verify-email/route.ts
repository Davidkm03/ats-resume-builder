import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/rate-limit";

// Validation schema
const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await withRateLimit(request, "auth");
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    
    // Validate input data
    const validatedFields = verifyEmailSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid verification token",
            details: validatedFields.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { token } = validatedFields.data;

    // Find the verification token
    const verificationSession = await prisma.userSession.findFirst({
      where: {
        token: `verify_${token}`,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationSession) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired verification token",
          },
        },
        { status: 400 }
      );
    }

    // Update user as verified (we'll add this field to the schema if needed)
    // For now, we'll just delete the verification token to mark as verified
    await prisma.userSession.delete({
      where: { id: verificationSession.id },
    });

    console.log(`Email verified for user: ${verificationSession.user.email}`);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: verificationSession.user.id,
          email: verificationSession.user.email,
          name: verificationSession.user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);

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
  // Handle GET request for email verification links
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/error?error=MissingToken", request.url));
  }

  try {
    // Find the verification token
    const verificationSession = await prisma.userSession.findFirst({
      where: {
        token: `verify_${token}`,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationSession) {
      return NextResponse.redirect(new URL("/auth/error?error=InvalidToken", request.url));
    }

    // Delete the verification token to mark as verified
    await prisma.userSession.delete({
      where: { id: verificationSession.id },
    });

    console.log(`Email verified for user: ${verificationSession.user.email}`);

    // Redirect to success page
    return NextResponse.redirect(new URL("/auth/signin?message=Email verified successfully. Please sign in.", request.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL("/auth/error?error=VerificationFailed", request.url));
  }
}