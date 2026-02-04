/**
 * Response DTOs for messages feature
 * Requirements: 5.4, 5.5
 */

export type MessageRole = 'USER' | 'ASSISTANT';

export interface MessageResponse {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: string;
}
