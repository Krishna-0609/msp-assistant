import { apiClient } from './api';
export const accountService = {
    async getAccounts() {
        const response = await apiClient.get('/accounts/');
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch accounts');
        }
        return response.data;
    },
    async getAccount(accountId) {
        const response = await apiClient.get(`/accounts/${accountId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch account');
        }
        return response.data;
    },
    async createAccount(account) {
        const response = await apiClient.post('/accounts/', account);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to create account');
        }
        return response.data;
    },
    async deleteAccount(accountId) {
        const response = await apiClient.delete(`/accounts/${accountId}`);
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete account');
        }
    },
    async updateAccount(accountId, data) {
        const response = await apiClient.put(`/accounts/${accountId}`, data);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to update account');
        }
        return response.data;
    },
    async testConnection(accountId) {
        const response = await apiClient.post(`/accounts/${accountId}/test-connection`, {});
        if (!response.success || !response.data) {
            return false;
        }
        return response.data.connected;
    },
};
