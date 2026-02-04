"use client";

import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
