"use client";

import { useState } from "react";
import { Button, Alert } from "flowbite-react";
import { ConversationResponse } from "../dto/response";
import { ConversationList } from "./ConversationList";

interface ChatSidebarProps {
  conversations: ConversationResponse[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => Promise<ConversationResponse | null>;
  onDelete: (id: string) => Promise<boolean>;
  onCreate: () => Promise<ConversationResponse | null>;
  onClearError: () => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  isLoading,
  error,
  onSelect,
  onRename,
  onDelete,
  onCreate,
  onClearError,
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = async () => {
    await onCreate();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800 md:hidden"
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      >
        <svg
          className="h-6 w-6 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCollapsed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-gray-200 bg-gray-50 transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 md:relative md:translate-x-0 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <Button
              onClick={handleNewChat}
              disabled={isLoading}
              className="w-full"
              color="light"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </Button>
          </div>

          {/* Error alert */}
          {error && (
            <div className="p-2">
              <Alert color="failure" onDismiss={onClearError}>
                <span className="text-sm">{error}</span>
              </Alert>
            </div>
          )}

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto p-2">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              isLoading={isLoading}
              onSelect={(id) => {
                onSelect(id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 768) {
                  setIsCollapsed(true);
                }
              }}
              onRename={onRename}
              onDelete={onDelete}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
