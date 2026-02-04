// Messages feature exports

// DTOs
export type { CreateMessageRequest } from './dto/request';
export type { MessageResponse, MessageRole } from './dto/response';

// Services
export { messageService } from './services/messageService';

// Hooks
export { useMessages } from './hooks/useMessages';

// Components
export { ChatMessages } from './components/ChatMessages';
export { MessageBubble } from './components/MessageBubble';
export { ChatInput } from './components/ChatInput';
