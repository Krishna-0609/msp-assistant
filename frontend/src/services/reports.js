import { apiClient } from './api';
export const reportService = {
    async getReports(reportType, limit = 20) {
        const params = new URLSearchParams();
        if (reportType)
            params.append('report_type', reportType);
        params.append('limit', limit.toString());
        const response = await apiClient.get(`/reports/?${params}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch reports');
        }
        return response.data;
    },
    async getReport(reportId) {
        const response = await apiClient.get(`/reports/${reportId}`);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch report');
        }
        return response.data;
    },
    async generateReport(request) {
        const response = await apiClient.post('/reports/generate', request);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to generate report');
        }
        return response.data;
    },
    async downloadReport(reportId) {
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
    async deleteReport(reportId) {
        const response = await apiClient.delete(`/reports/${reportId}`);
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete report');
        }
    },
    async scheduleReport(reportType, schedule) {
        const response = await apiClient.post('/reports/schedule', {
            report_type: reportType,
            schedule,
        });
        if (!response.success) {
            throw new Error(response.error || 'Failed to schedule report');
        }
    },
    async shareReport(reportId, email) {
        const response = await apiClient.post(`/reports/${reportId}/share`, {
            email,
        });
        if (!response.success) {
            throw new Error(response.error || 'Failed to share report');
        }
    },
};
