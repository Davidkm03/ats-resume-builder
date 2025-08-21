"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  subscriptionExpiresAt: Date | null;
}

export function useAuth(requireAuth: boolean = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name || null,
    subscriptionTier: session.user.subscriptionTier,
    subscriptionExpiresAt: session.user.subscriptionExpiresAt,
  } : null;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Check if user has premium subscription
  const isPremium = user ? (
    (user.subscriptionTier === "premium" || user.subscriptionTier === "pro") &&
    (user.subscriptionExpiresAt ? new Date() < user.subscriptionExpiresAt : false)
  ) : false;

  // Redirect to sign in if authentication is required but user is not authenticated
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [requireAuth, isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isPremium,
  };
}

export function useRequireAuth() {
  const authData = useAuth(true);
  return {
    ...authData,
    isPremium: authData.isPremium
  };
}

export function usePremium() {
  const { user, isAuthenticated, isPremium } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isPremium,
    requiresPremium: isAuthenticated && !isPremium,
  };
}