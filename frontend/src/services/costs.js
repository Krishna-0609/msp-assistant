import { apiClient } from './api';
export const costService = {
    async getCosts(accountId, service, limit = 100, offset = 0) {
        const params = new URLSearchParams();
        if (accountId)
            params.append('account_id', accountId);
        if (service)
            params.append('service', service);
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        const response = await apiClient.get(`/costs/?${params}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch costs');
        }
        return response.data;
    },
    async getCostSummary(accountId) {
        const params = accountId ? `?account_id=${accountId}` : '';
        const response = await apiClient.get(`/costs/summary${params}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch cost summary');
        }
        return response.data;
    },
    async getCost(costId) {
        const response = await apiClient.get(`/costs/${costId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch cost');
        }
        return response.data;
    },
    async analyzeCosts(accountId) {
        const response = await apiClient.post('/costs/analyze', {
            account_id: accountId,
        });
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to analyze costs');
        }
        return response.data;
    },
    async detectAnomalies(accountId, threshold = 30) {
        const response = await apiClient.post('/costs/anomalies', {
            account_id: accountId,
            threshold_percent: threshold,
        });
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to detect anomalies');
        }
        return response.data;
    },
    async getHistoricalTrend(accountId, days = 30) {
        const response = await apiClient.get(`/costs/trend?account_id=${accountId}&days=${days}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch trends');
        }
        return response.data;
    },
    async exportCosts(format = 'csv', accountId) {
        const params = accountId ? `?account_id=${accountId}` : '';
        const response = await fetch(`/api/costs/export?format=${format}${params}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to export costs');
        }
        return await response.blob();
    },
};
