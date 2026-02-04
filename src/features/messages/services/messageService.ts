import { httpClient } from '@/shared/lib/httpClient';
import { CreateMessageRequest } from '../dto/request';
import { MessageResponse } from '../dto/response';

/**
 * Message service - 1:1 mapping with MessageController
 * Requirements: 2.1, 5.1
 */
export const messageService = {
  /**
   * GET /api/conversations/{conversationId}/messages
   * Gets all messages for a conversation in chronological order
   * Requirements: 5.1, 5.3
   */
  async getByConversation(conversationId: string): Promise<MessageResponse[]> {
    const response = await httpClient.get<MessageResponse[]>(
      `/api/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  /**
   * POST /api/conversations/{conversationId}/messages
   * Creates a new user message and gets AI response
   * Requirements: 2.1, 5.1
   */
  async create(conversationId: string, request: CreateMessageRequest): Promise<MessageResponse[]> {
    const response = await httpClient.post<MessageResponse[]>(
      `/api/conversations/${conversationId}/messages`,
      request
    );
    return response.data;
  },
};
