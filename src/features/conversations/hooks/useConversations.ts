"use client";

import { useState, useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import { conversationService } from "../services/conversationService";
import { ConversationResponse, PaginationMeta } from "../dto/response";
import { CreateConversationRequest, UpdateConversationRequest } from "../dto/request";

interface ApiErrorResponse {
  message?: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
   * Fetch conversations with pagination
   * Requirements: 3.2, 5.2, 6.4
   */
  const fetchConversations = useCallback(
    async (page = 0, limit = 20) => {
      setIsLoading(true);
      clearError();
      try {
        const response = await conversationService.getAll(page, limit);
        setConversations(response.data);
        setPagination(response.meta);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  /**
   * Create a new conversation
   * Requirements: 3.1
   */
  const createConversation = useCallback(
    async (request?: CreateConversationRequest): Promise<ConversationResponse | null> => {
      setIsLoading(true);
      clearError();
      try {
        const newConversation = await conversationService.create(request);
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        return newConversation;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  /**
   * Rename a conversation
   * Requirements: 3.4
   */
  const renameConversation = useCallback(
    async (id: string, title: string): Promise<ConversationResponse | null> => {
      setIsLoading(true);
      clearError();
      try {
        const request: UpdateConversationRequest = { title };
        const updated = await conversationService.update(id, request);
        setConversations((prev) =>
          prev.map((conv) => (conv.id === id ? updated : conv))
        );
        return updated;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  /**
   * Delete a conversation
   * Requirements: 3.3
   */
  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      clearError();
      try {
        await conversationService.delete(id);
        setConversations((prev) => prev.filter((conv) => conv.id !== id));
        if (activeConversationId === id) {
          setActiveConversationId(null);
        }
        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError, activeConversationId]
  );

  /**
   * Select a conversation as active
   * Requirements: 3.2
   */
  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  /**
   * Get the active conversation object
   */
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  ) || null;

  /**
   * Load conversations on mount
   */
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    pagination,
    activeConversation,
    activeConversationId,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    selectConversation,
    clearError,
  };
}
