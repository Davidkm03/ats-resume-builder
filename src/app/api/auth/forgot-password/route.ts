import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { withRateLimit } from "@/lib/rate-limit";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
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
    const validatedFields = forgotPasswordSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid email address",
            details: validatedFields.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // but only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database (you might want to create a separate table for this)
      // For now, we'll use a simple approach with user sessions table
      await prisma.userSession.create({
        data: {
          userId: user.id,
          token: `reset_${resetToken}`,
          expiresAt: resetTokenExpiry,
        },
      });

      // TODO: Send email with reset link
      // This would typically use SendGrid or another email service
      console.log(`Password reset requested for: ${email}`);
      console.log(`Reset token: ${resetToken}`);
      
      // In a real implementation, you would send an email here:
      // await sendPasswordResetEmail(email, resetToken);
    }

    return NextResponse.json(
      {
        message: "If an account with that email exists, we have sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

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