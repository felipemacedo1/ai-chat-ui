"use client";

import { useChat } from "../hooks/useChat";
import { ChatSidebar } from "@/features/conversations/components/ChatSidebar";
import { ChatMessages } from "@/features/messages/components/ChatMessages";
import { ChatInput } from "@/features/messages/components/ChatInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "flowbite-react";

/**
 * ChatLayout component - Main layout integrating Sidebar, Messages and Input
 * Requirements: 3.2, 4.1
 */
export function ChatLayout() {
  const { user, handleLogout, isLoading: isAuthLoading } = useAuth();
  
  const {
    // Conversation state
    conversations,
    activeConversation,
    activeConversationId,
    
    // Message state
    messages,
    
    // Loading states
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    
    // Error state
    conversationsError,
    messagesError,
    
    // Conversation actions
    handleCreateConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleRenameConversation,
    
    // Message actions
    handleSendMessage,
    
    // Error actions
    clearConversationsError,
    clearMessagesError,
  } = useChat();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isLoading={isLoadingConversations}
        error={conversationsError}
        onSelect={handleSelectConversation}
        onRename={handleRenameConversation}
        onDelete={handleDeleteConversation}
        onCreate={handleCreateConversation}
        onClearError={clearConversationsError}
      />

      {/* Main chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            {/* Spacer for mobile menu button */}
            <div className="w-8 md:hidden" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeConversation?.title || "New Chat"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name}
            </span>
            <Button
              size="sm"
              color="gray"
              onClick={handleLogout}
              disabled={isAuthLoading}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          {activeConversationId ? (
            <ChatMessages
              messages={messages}
              isLoading={isLoadingMessages}
              isSending={isSending}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg
                className="mb-4 h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">Welcome to AI Chat</p>
              <p className="mb-4 text-sm">
                Select a conversation or create a new one to get started
              </p>
              <Button color="blue" onClick={handleCreateConversation}>
                Start New Chat
              </Button>
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput
          onSend={handleSendMessage}
          isSending={isSending}
          error={messagesError}
          onClearError={clearMessagesError}
          disabled={!activeConversationId}
        />
      </main>
    </div>
  );
}
