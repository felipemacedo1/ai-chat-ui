"use client";

import { MessageResponse, MessageRole } from "../dto/response";

interface MessageBubbleProps {
  message: MessageResponse;
}

/**
 * MessageBubble component - displays a single message with role-based styling
 * Requirements: 2.3, 4.3
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "USER";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
        }`}
      >
        {/* Role indicator */}
        <div
          className={`mb-1 text-xs font-medium ${
            isUser
              ? "text-blue-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isUser ? "You" : "Assistant"}
        </div>

        {/* Message content with markdown-like formatting */}
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          <MessageContent content={message.content} />
        </div>

        {/* Timestamp */}
        <div
          className={`mt-2 text-xs ${
            isUser
              ? "text-blue-200"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}


/**
 * MessageContent component - renders message with basic markdown support
 * Requirements: 2.3 - Display response with proper formatting (markdown, code blocks)
 */
function MessageContent({ content }: { content: string }) {
  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Code block
          const codeContent = part.slice(3, -3);
          const firstNewline = codeContent.indexOf("\n");
          const language = firstNewline > 0 ? codeContent.slice(0, firstNewline).trim() : "";
          const code = firstNewline > 0 ? codeContent.slice(firstNewline + 1) : codeContent;

          return (
            <pre
              key={index}
              className="my-2 overflow-x-auto rounded-lg bg-gray-800 p-3 text-sm text-gray-100"
            >
              {language && (
                <div className="mb-2 text-xs text-gray-400">{language}</div>
              )}
              <code>{code}</code>
            </pre>
          );
        }

        // Regular text with inline code support
        return (
          <span key={index}>
            {part.split(/(`[^`]+`)/g).map((segment, segIndex) => {
              if (segment.startsWith("`") && segment.endsWith("`")) {
                return (
                  <code
                    key={segIndex}
                    className="rounded bg-gray-200 px-1 py-0.5 text-sm dark:bg-gray-600"
                  >
                    {segment.slice(1, -1)}
                  </code>
                );
              }
              return segment;
            })}
          </span>
        );
      })}
    </>
  );
}

/**
 * Format timestamp for display
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
