"use client";

import { useEffect, useCallback } from "react";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { ConversationResponse } from "@/features/conversations/dto/response";

/**
 * useChat hook - Controller that orchestrates active conversation
 * Integrates useConversations and useMessages hooks
 * Requirements: 3.2
 */
export function useChat() {
  const {
    conversations,
    pagination,
    activeConversation,
    activeConversationId,
    isLoading: isLoadingConversations,
    error: conversationsError,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    selectConversation,
    clearError: clearConversationsError,
  } = useConversations();

  const {
    messages,
    isLoading: isLoadingMessages,
    isSending,
    error: messagesError,
    fetchMessages,
    sendMessage,
    clearMessages,
    clearError: clearMessagesError,
  } = useMessages();

  /**
   * Load messages when active conversation changes
   * Requirements: 3.2 - WHEN a user selects a conversation from the sidebar
   * THEN the System SHALL load and display all messages from that conversation
   */
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      clearMessages();
    }
  }, [activeConversationId, fetchMessages, clearMessages]);

  /**
   * Handle sending a message in the active conversation
   * Requirements: 2.1, 2.2
   */
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId) {
        return;
      }
      await sendMessage(activeConversationId, content);
    },
    [activeConversationId, sendMessage]
  );

  /**
   * Handle creating a new conversation and selecting it
   * Requirements: 3.1
   */
  const handleCreateConversation = useCallback(async (): Promise<ConversationResponse | null> => {
    const newConversation = await createConversation();
    return newConversation;
  }, [createConversation]);

  /**
   * Handle selecting a conversation
   * Requirements: 3.2
   */
  const handleSelectConversation = useCallback(
    (id: string) => {
      selectConversation(id);
    },
    [selectConversation]
  );

  /**
   * Handle deleting a conversation
   * Requirements: 3.3
   */
  const handleDeleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      const success = await deleteConversation(id);
      return success;
    },
    [deleteConversation]
  );

  /**
   * Handle renaming a conversation
   * Requirements: 3.4
   */
  const handleRenameConversation = useCallback(
    async (id: string, title: string): Promise<ConversationResponse | null> => {
      return await renameConversation(id, title);
    },
    [renameConversation]
  );

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    clearConversationsError();
    clearMessagesError();
  }, [clearConversationsError, clearMessagesError]);

  // Combine loading states
  const isLoading = isLoadingConversations || isLoadingMessages;

  // Combine errors (prioritize messages error as it's more immediate)
  const error = messagesError || conversationsError;

  return {
    // Conversation state
    conversations,
    pagination,
    activeConversation,
    activeConversationId,
    
    // Message state
    messages,
    
    // Loading states
    isLoading,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    
    // Error state
    error,
    conversationsError,
    messagesError,
    
    // Conversation actions
    handleCreateConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleRenameConversation,
    fetchConversations,
    
    // Message actions
    handleSendMessage,
    
    // Error actions
    clearAllErrors,
    clearConversationsError,
    clearMessagesError,
  };
}
