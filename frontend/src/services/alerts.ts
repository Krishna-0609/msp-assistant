import { apiClient } from './api';

interface Alert {
  id: string;
  type: 'vulnerability' | 'cost_spike' | 'performance' | 'compliance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  service?: string;
  account_id: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

interface CreateAlertRequest {
  type: string;
  severity: string;
  message: string;
  service?: string;
  account_id: string;
  metadata?: Record<string, any>;
}

export const alertService = {
  async getAlerts(
    accountId?: string,
    severity?: string,
    read?: boolean,
    limit: number = 50
  ): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (accountId) params.append('account_id', accountId);
    if (severity) params.append('severity', severity);
    if (read !== undefined) params.append('read', read.toString());
    params.append('limit', limit.toString());

    const response = await apiClient.get<Alert[]>(`/alerts/?${params}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch alerts');
    }

    return response.data;
  },

  async getAlert(alertId: string): Promise<Alert> {
    const response = await apiClient.get<Alert>(`/alerts/${alertId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch alert');
    }

    return response.data;
  },

  async markAsRead(alertId: string, read: boolean = true): Promise<Alert> {
    const response = await apiClient.patch<Alert>(`/alerts/${alertId}`, {
      read,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update alert');
    }

    return response.data;
  },

  async createAlert(alert: CreateAlertRequest): Promise<Alert> {
    const response = await apiClient.post<Alert>('/alerts/', alert);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create alert');
    }

    return response.data;
  },

  async getCriticalAlerts(accountId: string): Promise<Alert[]> {
    const response = await apiClient.get<Alert[]>(`/alerts/severity/critical?account_id=${accountId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch critical alerts');
    }

    return response.data;
  },

  async deleteAlert(alertId: string): Promise<void> {
    const response = await apiClient.delete(`/alerts/${alertId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete alert');
    }
  },
};
