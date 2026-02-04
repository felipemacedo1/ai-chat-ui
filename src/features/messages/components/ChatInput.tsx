"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Button, Alert } from "flowbite-react";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  onClearError: () => void;
  disabled?: boolean;
}

/**
 * ChatInput component - textarea with auto-resize and Enter/Shift+Enter handling
 * Requirements: 2.1, 2.2, 4.2, 4.5
 */
export function ChatInput({
  onSend,
  isSending,
  error,
  onClearError,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight, with max height of 200px
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isSending || disabled) {
      return;
    }

    await onSend(trimmedContent);
    setContent("");
    
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };


  /**
   * Handle keyboard events
   * Requirements: 4.5 - Enter sends message, Shift+Enter for new line
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) {
      onClearError();
    }
  };

  const isSubmitDisabled = !content.trim() || isSending || disabled;

  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Error alert */}
      {error && (
        <div className="mb-3">
          <Alert color="failure" onDismiss={onClearError}>
            <span className="text-sm">{error}</span>
          </Alert>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Textarea with auto-resize */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Select a conversation to start chatting" : "Type a message..."}
            disabled={disabled || isSending}
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            style={{ minHeight: "44px", maxHeight: "200px" }}
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          color="blue"
          className="h-11 px-4"
        >
          {isSending ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
