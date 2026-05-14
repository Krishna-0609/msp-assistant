import { apiClient } from './api';

interface AWSAccount {
  id: string;
  name: string;
  account_id: string;
  region: string;
  status: 'Connected' | 'Pending' | 'Failed';
}

interface CreateAccountRequest {
  name: string;
  account_id: string;
  region: string;
}

export const accountService = {
  async getAccounts(): Promise<AWSAccount[]> {
    const response = await apiClient.get<AWSAccount[]>('/accounts/');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch accounts');
    }

    return response.data;
  },

  async getAccount(accountId: string): Promise<AWSAccount> {
    const response = await apiClient.get<AWSAccount>(`/accounts/${accountId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch account');
    }

    return response.data;
  },

  async createAccount(account: CreateAccountRequest): Promise<AWSAccount> {
    const response = await apiClient.post<AWSAccount>('/accounts/', account);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create account');
    }

    return response.data;
  },

  async deleteAccount(accountId: string): Promise<void> {
    const response = await apiClient.delete(`/accounts/${accountId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }
  },

  async updateAccount(accountId: string, data: Partial<CreateAccountRequest>): Promise<AWSAccount> {
    const response = await apiClient.put<AWSAccount>(`/accounts/${accountId}`, data);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update account');
    }

    return response.data;
  },

  async testConnection(accountId: string): Promise<boolean> {
    const response = await apiClient.post<{ connected: boolean }>(
      `/accounts/${accountId}/test-connection`,
      {}
    );

    if (!response.success || !response.data) {
      return false;
    }

    return response.data.connected;
  },
};
