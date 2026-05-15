import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_ATTEMPTS, RETRY_DELAY } from '../utils/constants';
class ApiClient {
    constructor(baseURL = API_BASE_URL, timeout = REQUEST_TIMEOUT) {
        Object.defineProperty(this, "baseURL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseURL = baseURL;
        this.timeout = timeout;
    }
    async request(method, endpoint, data, retries = RETRY_ATTEMPTS) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('authToken');
        const headers = {
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
                const error = {
                    code: `HTTP_${response.status}`,
                    message: response.statusText,
                };
                return { success: false, error: error.message };
            }
            const responseData = await response.json();
            return { success: true, data: responseData };
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (retries > 0 && error instanceof Error && error.name !== 'AbortError') {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return this.request(method, endpoint, data, retries - 1);
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, error: errorMessage };
        }
    }
    async get(endpoint) {
        return this.request('GET', endpoint);
    }
    async post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }
    async put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }
    async patch(endpoint, data) {
        return this.request('PATCH', endpoint, data);
    }
    async delete(endpoint) {
        return this.request('DELETE', endpoint);
    }
}
export const apiClient = new ApiClient();
