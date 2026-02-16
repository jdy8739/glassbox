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
 * Change password DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * User profile response (without sensitive data)
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  googleId?: string; // Present if user signed up via Google OAuth
  createdAt: string;
}
