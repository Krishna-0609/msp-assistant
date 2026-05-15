import { apiClient } from './api';
export const chatService = {
    async sendMessage(request) {
        const response = await apiClient.post('/chat/', request);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to send message');
        }
        return response.data;
    },
    async getConversation(conversationId) {
        const response = await apiClient.get(`/chat/conversations/${conversationId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch conversation');
        }
        return response.data;
    },
    async listConversations(limit = 20) {
        const response = await apiClient.get(`/chat/conversations?limit=${limit}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to list conversations');
        }
        return response.data.conversations;
    },
    async deleteConversation(conversationId) {
        const response = await apiClient.delete(`/chat/conversations/${conversationId}`);
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete conversation');
        }
    },
    async startNewConversation(_accountId) {
        // Generate a new conversation ID
        return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    async analyzeWithAI(text, accountId, conversationId) {
        const response = await this.sendMessage({
            message: text,
            conversation_id: conversationId,
            account_id: accountId,
        });
        return response.response.content;
    },
};
