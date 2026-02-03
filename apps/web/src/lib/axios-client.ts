/**
 * Axios API Client - Robust HTTP client with interceptors
 * Works seamlessly with TanStack Query
 * Uses httpOnly cookies for secure authentication
 */
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // Send cookies with requests
});

// Response interceptor - Handle errors
axiosClient.interceptors.response.use(
  (response) => response.data, // Return data directly
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'Request failed';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Request failed');
    }
  }
);

export default axiosClient;

// Helper types for API responses
// Note: accessToken is now stored in httpOnly cookie, not in response body
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture: string | null;
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
