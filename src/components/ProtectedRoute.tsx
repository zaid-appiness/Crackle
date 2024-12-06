"use client";

import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not loading and we have a user, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // If not loading and no user, the useRequireAuth hook will handle the redirect
  return null;
}
