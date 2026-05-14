import { apiClient } from './api';
import type { ChatMessage } from '../types/models';

interface ChatRequest {
  message: string;
  conversation_id?: string;
  account_id: string;
}

interface ChatResponse {
  conversation_id: string;
  message: ChatMessage;
  response: ChatMessage;
}

interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ConversationDetail {
  id: string;
  messages: ChatMessage[];
  message_count: number;
}

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/chat/', request);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to send message');
    }

    return response.data;
  },

  async getConversation(conversationId: string): Promise<ConversationDetail> {
    const response = await apiClient.get<ConversationDetail>(`/chat/conversations/${conversationId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch conversation');
    }

    return response.data;
  },

  async listConversations(limit: number = 20): Promise<string[]> {
    const response = await apiClient.get<{ total: number; conversations: string[] }>(
      `/chat/conversations?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to list conversations');
    }

    return response.data.conversations;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const response = await apiClient.delete(`/chat/conversations/${conversationId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete conversation');
    }
  },

  async startNewConversation(accountId: string): Promise<string> {
    // Generate a new conversation ID
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  async analyzeWithAI(text: string, accountId: string, conversationId?: string): Promise<string> {
    const response = await this.sendMessage({
      message: text,
      conversation_id: conversationId,
      account_id: accountId,
    });

    return response.response.content;
  },
};
