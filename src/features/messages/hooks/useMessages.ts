"use client";

import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { messageService } from "../services/messageService";
import { MessageResponse } from "../dto/response";
import { CreateMessageRequest } from "../dto/request";

interface ApiErrorResponse {
  message?: string;
}

/**
 * useMessages hook - Controller for message operations
 * Requirements: 2.1, 2.2, 5.1, 5.3
 */
export function useMessages() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as ApiErrorResponse | undefined;
      setError(data?.message || "An unexpected error occurred");
    } else {
      setError("An unexpected error occurred");
    }
  }, []);

  /**
   * Validates message content
   * Requirements: 2.2 - Whitespace-only messages are rejected
   */
  const validateMessage = useCallback((content: string): boolean => {
    return content.trim().length > 0;
  }, []);

  /**
   * Fetch messages for a conversation
   * Requirements: 5.1, 5.3
   */
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      clearError();
      try {
        const response = await messageService.getByConversation(conversationId);
        setMessages(response);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );


  /**
   * Send a message and get AI response
   * Requirements: 2.1, 2.2
   */
  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<MessageResponse[] | null> => {
      // Validate message - reject whitespace-only messages
      if (!validateMessage(content)) {
        setError("Message cannot be empty or whitespace only");
        return null;
      }

      setIsSending(true);
      clearError();
      try {
        const request: CreateMessageRequest = { content: content.trim() };
        const newMessages = await messageService.create(conversationId, request);
        
        // Append new messages (user message + AI response) to the list
        setMessages((prev) => [...prev, ...newMessages]);
        return newMessages;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [clearError, handleError, validateMessage]
  );

  /**
   * Clear messages (when switching conversations)
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    clearError();
  }, [clearError]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    fetchMessages,
    sendMessage,
    clearMessages,
    clearError,
    validateMessage,
  };
}
