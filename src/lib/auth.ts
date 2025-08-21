import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Validate input
        const validatedFields = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validatedFields.success) {
          throw new Error("Invalid email or password format");
        }

        const { email, password } = validatedFields.data;

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            subscriptionTier: user.subscriptionTier,
            subscriptionExpiresAt: user.subscriptionExpiresAt,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include user data in JWT token
      if (user) {
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier;
        token.subscriptionExpiresAt = user.subscriptionExpiresAt;
      }
      return token;
    },
    async session({ session, token }) {
      // Include user data in session
      if (token) {
        session.user.id = token.id as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.subscriptionExpiresAt = token.subscriptionExpiresAt as Date | null;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User ${user.email} signed in. New user: ${isNewUser}`);
    },
    async signOut({ token }) {
      console.log(`User ${token?.email} signed out`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};