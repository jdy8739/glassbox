/**
 * API Client - Wrapper around fetch for communicating with Nest.js backend
 * Works seamlessly with TanStack Query
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Makes an API call to the backend
 * @param endpoint - API endpoint (e.g., '/api/portfolios')
 * @param options - Fetch options
 * @returns JSON response from API
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // Merge headers
  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(url.toString(), {
    ...rest,
    headers: mergedHeaders,
    credentials: 'include',
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null as any;
  }

  // Handle errors
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    // Try to parse error response
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If can't parse, use default message
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    throw error;
  }

  // Return JSON response
  return response.json();
}

/**
 * GET request helper
 */
export function get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export function post<T>(
  endpoint: string,
  data?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 */
export function put<T>(
  endpoint: string,
  data?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request helper
 */
export function patch<T>(
  endpoint: string,
  data?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 */
export function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * User API methods
 */
export const userApi = {
  getProfile: () => get<{
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }>('/users/me'),

  updateProfile: (name: string) =>
    patch<{
      id: string;
      email: string;
      name: string;
    }>('/users/me', { name }),

  deleteAccount: async () => {
    await del('/users/me');
    return null;
  },
};
