"use client";

import { Spinner } from "flowbite-react";
import { ConversationResponse } from "../dto/response";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: ConversationResponse[];
  activeConversationId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => Promise<ConversationResponse | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export function ConversationList({
  conversations,
  activeConversationId,
  isLoading,
  onSelect,
  onRename,
  onDelete,
}: ConversationListProps) {
  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No conversations yet.
        <br />
        Start a new chat!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
