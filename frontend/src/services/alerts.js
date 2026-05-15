import { apiClient } from './api';
export const alertService = {
    async getAlerts(accountId, severity, read, limit = 50) {
        const params = new URLSearchParams();
        if (accountId)
            params.append('account_id', accountId);
        if (severity)
            params.append('severity', severity);
        if (read !== undefined)
            params.append('read', read.toString());
        params.append('limit', limit.toString());
        const response = await apiClient.get(`/alerts/?${params}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch alerts');
        }
        return response.data;
    },
    async getAlert(alertId) {
        const response = await apiClient.get(`/alerts/${alertId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch alert');
        }
        return response.data;
    },
    async markAsRead(alertId, read = true) {
        const response = await apiClient.patch(`/alerts/${alertId}`, {
            read,
        });
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to update alert');
        }
        return response.data;
    },
    async createAlert(alert) {
        const response = await apiClient.post('/alerts/', alert);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to create alert');
        }
        return response.data;
    },
    async getCriticalAlerts(accountId) {
        const response = await apiClient.get(`/alerts/severity/critical?account_id=${accountId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch critical alerts');
        }
        return response.data;
    },
    async deleteAlert(alertId) {
        const response = await apiClient.delete(`/alerts/${alertId}`);
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete alert');
        }
    },
};
