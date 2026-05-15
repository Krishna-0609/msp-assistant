import { apiClient } from './api';
export const authService = {
    async login(credentials) {
        const response = await apiClient.post('/auth/login', credentials);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Login failed');
        }
        // Store tokens
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('token_expiry', String(Date.now() + response.data.expires_in * 1000));
        return response.data;
    },
    async signup(data) {
        const response = await apiClient.post('/auth/signup', data);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Signup failed');
        }
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data;
    },
    async getCurrentUser() {
        const response = await apiClient.get('/auth/me');
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to get user info');
        }
        return response.data;
    },
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('user');
    },
    getAccessToken() {
        return localStorage.getItem('access_token');
    },
    isTokenExpired() {
        const expiry = localStorage.getItem('token_expiry');
        if (!expiry)
            return true;
        return Date.now() > parseInt(expiry, 10);
    },
    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
        });
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Token refresh failed');
        }
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('token_expiry', String(Date.now() + response.data.expires_in * 1000));
        return response.data;
    },
};
