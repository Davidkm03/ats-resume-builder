import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").toLowerCase(),
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
    const validatedFields = registerSchema.safeParse(body);
    
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

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: "USER_EXISTS",
            message: "A user with this email already exists",
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        subscriptionTier: "free",
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store verification token in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: `verify_${verificationToken}`,
        expiresAt: verificationTokenExpiry,
      },
    });

    // TODO: Send verification email
    // This would typically use SendGrid or another email service
    console.log(`New user registered: ${email}`);
    console.log(`Verification token: ${verificationToken}`);
    console.log(`Verification link: ${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`);
    
    // In a real implementation, you would send an email here:
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user,
        // In development, include the verification link for testing
        ...(process.env.NODE_ENV === "development" && {
          verificationLink: `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: {
            code: "USER_EXISTS",
            message: "A user with this email already exists",
          },
        },
        { status: 409 }
      );
    }

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