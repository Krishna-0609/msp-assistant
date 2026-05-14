import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_ATTEMPTS, RETRY_DELAY } from '../utils/constants';
import type { ApiResponse, ApiError } from '../types/api';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = REQUEST_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    retries: number = RETRY_ATTEMPTS
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        const error: ApiError = {
          code: `HTTP_${response.status}`,
          message: response.statusText,
        };

        return { success: false, error: error.message };
      }

      const responseData = await response.json();
      return { success: true, data: responseData };
    } catch (error) {
      clearTimeout(timeoutId);

      if (retries > 0 && error instanceof Error && error.name !== 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.request<T>(method, endpoint, data, retries - 1);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  public async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  public async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient();
