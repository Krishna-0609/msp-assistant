import { apiClient } from './api';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', credentials);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    // Store tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('token_expiry', String(Date.now() + response.data.expires_in * 1000));

    return response.data;
  },

  async signup(data: SignUpRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/signup', data);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Signup failed');
    }

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
  },

  async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>('/auth/me');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get user info');
    }

    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry, 10);
  },

  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<TokenResponse>('/auth/refresh', {
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
