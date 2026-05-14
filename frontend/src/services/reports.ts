import { apiClient } from './api';

interface Report {
  id: string;
  name: string;
  type: 'cost' | 'security' | 'performance';
  period: string;
  generated_at: string;
  pages: number;
  status: 'ready' | 'generating' | 'failed';
}

interface GenerateReportRequest {
  report_type: string;
  account_id?: string;
  period?: 'weekly' | 'monthly' | 'quarterly';
}

export const reportService = {
  async getReports(reportType?: string, limit: number = 20): Promise<Report[]> {
    const params = new URLSearchParams();
    if (reportType) params.append('report_type', reportType);
    params.append('limit', limit.toString());

    const response = await apiClient.get<Report[]>(`/reports/?${params}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch reports');
    }

    return response.data;
  },

  async getReport(reportId: string): Promise<Report> {
    const response = await apiClient.get<Report>(`/reports/${reportId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch report');
    }

    return response.data;
  },

  async generateReport(request: GenerateReportRequest): Promise<Report> {
    const response = await apiClient.post<Report>('/reports/generate', request);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to generate report');
    }

    return response.data;
  },

  async downloadReport(reportId: string): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`/api/reports/${reportId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return await response.blob();
  },

  async deleteReport(reportId: string): Promise<void> {
    const response = await apiClient.delete(`/reports/${reportId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete report');
    }
  },

  async scheduleReport(
    reportType: string,
    schedule: 'weekly' | 'monthly' | 'quarterly'
  ): Promise<void> {
    const response = await apiClient.post('/reports/schedule', {
      report_type: reportType,
      schedule,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to schedule report');
    }
  },

  async shareReport(reportId: string, email: string): Promise<void> {
    const response = await apiClient.post(`/reports/${reportId}/share`, {
      email,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to share report');
    }
  },
};
