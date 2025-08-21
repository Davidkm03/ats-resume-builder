"use client";

import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
  fallback?: ReactNode;
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  requirePremium = false,
  fallback 
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated, isPremium } = useAuth(requireAuth);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check premium requirement
  if (requirePremium && isAuthenticated && !isPremium) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Premium Subscription Required
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is only available to premium subscribers.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components
export function ProtectedPage({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  );
}

export function PremiumPage({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requirePremium={true}>
      {children}
    </AuthGuard>
  );
}