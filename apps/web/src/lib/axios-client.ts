/**
 * Axios API Client - Robust HTTP client with interceptors
 * Works seamlessly with TanStack Query
 * Uses httpOnly cookies for secure authentication
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// Types
// ============================================================================

/**
 * Custom Axios instance that unwraps response.data automatically
 * All HTTP methods return Promise<T> instead of Promise<AxiosResponse<T>>
 */
interface ApiClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
}

interface ErrorResponse {
  message?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================================================
// Error Handler
// ============================================================================

const handleError = (error: AxiosError<ErrorResponse>): never => {
  if (error.response) {
    const message = error.response.data?.message
      || error.response.statusText
      || 'Request failed';
    throw new Error(message);
  }

  if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  }

  throw new Error(error.message || 'Request failed');
};

// ============================================================================
// Client Instance
// ============================================================================

const instance = axios.create(axiosConfig);

// Unwrap response data automatically
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  handleError
);

// ============================================================================
// Export
// ============================================================================

const axiosClient = instance as unknown as ApiClient;

export default axiosClient;

// Helper types for API responses
// Note: accessToken is now stored in httpOnly cookie, not in response body
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  tokenType: string;
  expiresIn: number;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
