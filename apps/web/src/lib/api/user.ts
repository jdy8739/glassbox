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
export const getProfile = async () => {
  return axiosClient.get<UserProfile>('/users/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (name: string) => {
  return axiosClient.patch<UserProfile>('/users/me', { name });
};

/**
 * Delete user account
 */
export const deleteAccount = async () => {
  return axiosClient.delete<void>('/users/me');
};
