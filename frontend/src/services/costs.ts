import { apiClient } from './api';
import type { CostData } from '../types/models';

interface CostResponse {
  id: string;
  service: string;
  amount: number;
  currency: string;
  date: string;
  account_id: string;
  region: string;
  trend: 'up' | 'down' | 'neutral';
  trend_percent: number;
}

interface CostSummary {
  total_cost: number;
  highest_cost_service: string;
  highest_cost_amount: number;
  potential_savings: number;
  services_count: number;
  period_start: string;
  period_end: string;
}

interface CostAnalysis {
  recommendations: Array<{
    title: string;
    savings: number;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  total_potential_savings: number;
}

interface CostAnomaly {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  percent_change: number;
  baseline: number;
  current: number;
  account_id: string;
}

export const costService = {
  async getCosts(
    accountId?: string,
    service?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<CostResponse[]> {
    const params = new URLSearchParams();
    if (accountId) params.append('account_id', accountId);
    if (service) params.append('service', service);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await apiClient.get<CostResponse[]>(`/costs/?${params}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch costs');
    }

    return response.data;
  },

  async getCostSummary(accountId?: string): Promise<CostSummary> {
    const params = accountId ? `?account_id=${accountId}` : '';
    const response = await apiClient.get<CostSummary>(`/costs/summary${params}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch cost summary');
    }

    return response.data;
  },

  async getCost(costId: string): Promise<CostResponse> {
    const response = await apiClient.get<CostResponse>(`/costs/${costId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch cost');
    }

    return response.data;
  },

  async analyzeCosts(accountId: string): Promise<CostAnalysis> {
    const response = await apiClient.post<CostAnalysis>('/costs/analyze', {
      account_id: accountId,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze costs');
    }

    return response.data;
  },

  async detectAnomalies(accountId: string, threshold: number = 30): Promise<CostAnomaly[]> {
    const response = await apiClient.post<CostAnomaly[]>('/costs/anomalies', {
      account_id: accountId,
      threshold_percent: threshold,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to detect anomalies');
    }

    return response.data;
  },

  async getHistoricalTrend(accountId: string, days: number = 30): Promise<Array<{ date: string; amount: number }>> {
    const response = await apiClient.get<Array<{ date: string; amount: number }>>(
      `/costs/trend?account_id=${accountId}&days=${days}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch trends');
    }

    return response.data;
  },

  async exportCosts(format: 'csv' | 'pdf' = 'csv', accountId?: string): Promise<Blob> {
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
