"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { AuthProvider, useAuthContext } from "@/features/auth/context/AuthContext";

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/chat");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        AI Chat Interface
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        Start a conversation with our AI assistant. Sign in to access your chat history.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")}>Sign In</Button>
        <Button color="gray" onClick={() => router.push("/register")}>
          Create Account
        </Button>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
