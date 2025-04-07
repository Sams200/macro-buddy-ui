import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { HttpResponse, ApiError } from '../models/common';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export const checkAuthStatus = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/authenticated`, {
            withCredentials: true
        });
        console.log("Authentication status:", response.data);
        return true;
    } catch (error) {
        console.error("Authentication check failed:", error);
        return false;
    }
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - add CSRF token
apiClient.interceptors.request.use(
    async (config) => {
        // Only check authentication status for non-authentication endpoints
        if (!config.url?.includes('/authentication/')) {
            try {
                await checkAuthStatus();
            } catch (error) {
                console.error("Authentication check failed:", error);
            }
        }

        try {
            // Only fetch CSRF token for methods that require it
            if (config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
                console.log(`Fetching CSRF token for ${config.method} ${config.url}`);
                const csrfResponse = await axios.get(`${API_BASE_URL}/csrf`, {
                    withCredentials: true
                });

                if (!csrfResponse.data || !csrfResponse.data.token) {
                    console.error("CSRF response did not contain token:", csrfResponse.data);
                } else {
                    console.log("CSRF token obtained successfully");
                    config.headers['X-XSRF-TOKEN'] = csrfResponse.data.token;
                }
            }
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// handle common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            status: error.response?.status || 500,
        };

        if (error.response) {
            const data = error.response.data as any;

            // 403 Invalid Login
            if (error.response.status === 403) {
                apiError.message = 'Invalid Login Credentials';
            } else {
                apiError.message = data.responseMessage || data.message || apiError.message;
            }

            apiError.timestamp = data.timestamp;

        }

        return Promise.reject(apiError);
    }
);

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<HttpResponse<T>> = await apiClient.get(url, config);
    return response.data.body as T;
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<HttpResponse<T>> = await apiClient.post(url, data, config);
    return response.data.body as T;
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<HttpResponse<T>> = await apiClient.put(url, data, config);
    return response.data.body as T;
};

export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<HttpResponse<T>> = await apiClient.patch(url, data, config);
    return response.data.body as T;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<HttpResponse<T>> = await apiClient.delete(url, config);
    return response.data.body as T;
};

export default apiClient;