/**
 * User entity - represents an authenticated user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Update user DTO
 */
export interface UpdateUserDto {
  name: string;
}

/**
 * User profile response (without sensitive data)
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
