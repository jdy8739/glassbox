/**
 * User API Service
 * Handles user profile management
 */
import axiosClient from '@/lib/axios-client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name: string;
}

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<UserProfile> => {
  return axiosClient.get('/users/me') as Promise<UserProfile>;
};

/**
 * Update user profile
 */
export const updateProfile = async (name: string): Promise<UserProfile> => {
  return axiosClient.patch('/users/me', { name }) as Promise<UserProfile>;
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  return axiosClient.delete('/users/me') as Promise<void>;
};
