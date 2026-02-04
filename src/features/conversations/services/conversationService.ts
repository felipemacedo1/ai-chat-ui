import { httpClient } from '@/shared/lib/httpClient';
import { CreateConversationRequest, UpdateConversationRequest } from '../dto/request';
import { ConversationResponse, PaginatedResponse } from '../dto/response';

const BASE_URL = '/api/conversations';

export const conversationService = {
  /**
   * GET /api/conversations
   * Lists all conversations for the authenticated user with pagination
   * Requirements: 3.2, 6.4
   */
  async getAll(page = 0, limit = 20): Promise<PaginatedResponse<ConversationResponse>> {
    const response = await httpClient.get<PaginatedResponse<ConversationResponse>>(BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * GET /api/conversations/{id}
   * Gets a specific conversation by ID
   * Requirements: 3.2
   */
  async getById(id: string): Promise<ConversationResponse> {
    const response = await httpClient.get<ConversationResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * POST /api/conversations
   * Creates a new conversation
   * Requirements: 3.1
   */
  async create(request?: CreateConversationRequest): Promise<ConversationResponse> {
    const response = await httpClient.post<ConversationResponse>(BASE_URL, request || {});
    return response.data;
  },

  /**
   * PATCH /api/conversations/{id}
   * Updates a conversation (rename)
   * Requirements: 3.4
   */
  async update(id: string, request: UpdateConversationRequest): Promise<ConversationResponse> {
    const response = await httpClient.patch<ConversationResponse>(`${BASE_URL}/${id}`, request);
    return response.data;
  },

  /**
   * DELETE /api/conversations/{id}
   * Deletes a conversation and all its messages
   * Requirements: 3.3
   */
  async delete(id: string): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
  },
};
