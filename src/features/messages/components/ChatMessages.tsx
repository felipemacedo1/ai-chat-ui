"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "flowbite-react";
import { MessageResponse } from "../dto/response";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  messages: MessageResponse[];
  isLoading: boolean;
  isSending: boolean;
}

/**
 * ChatMessages component - displays list of messages with auto-scroll
 * Requirements: 2.4, 4.4, 5.3
 */
export function ChatMessages({ messages, isLoading, isSending }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
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
        <p className="text-lg font-medium">Start a conversation</p>
        <p className="text-sm">Send a message to begin chatting with the AI assistant</p>
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col gap-4 overflow-y-auto p-4"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Loading indicator while waiting for AI response */}
      {isSending && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
            <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Assistant
            </div>
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Thinking...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
