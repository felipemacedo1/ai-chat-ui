"use client";

import { ChatLayout } from "@/features/chat";

/**
 * Chat page - Main chat interface
 * Requirements: 2.1, 2.2, 2.5, 3.2
 * 
 * Route protection is handled by the parent layout (app/(chat)/layout.tsx)
 * which wraps this page with AuthProvider and ProtectedRoute
 */
export default function ChatPage() {
  return <ChatLayout />;
}
