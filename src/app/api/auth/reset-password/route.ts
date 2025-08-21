import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/rate-limit";

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
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
    const validatedFields = resetPasswordSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: validatedFields.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { token, password } = validatedFields.data;

    // Find the reset token
    const resetSession = await prisma.userSession.findFirst({
      where: {
        token: `reset_${token}`,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetSession) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired reset token",
          },
        },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user password
    await prisma.user.update({
      where: { id: resetSession.userId },
      data: { passwordHash },
    });

    // Delete the reset token
    await prisma.userSession.delete({
      where: { id: resetSession.id },
    });

    // Delete all other sessions for this user (force re-login)
    await prisma.userSession.deleteMany({
      where: { userId: resetSession.userId },
    });

    console.log(`Password reset successful for user: ${resetSession.user.email}`);

    return NextResponse.json(
      {
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

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