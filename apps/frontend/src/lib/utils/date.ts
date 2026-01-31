/**
 * Date formatting utilities
 * Centralized date formatting functions for consistent display across the app
 */

import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a date as relative time (e.g., "2 minutes ago", "3 hours ago")
 * @param date - Date to format
 * @param addSuffix - Whether to add "ago" suffix (default: true)
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string, addSuffix: boolean = true): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix });
};

/**
 * Format a date as full datetime (e.g., "January 31, 2026 at 3:45 PM")
 * @param date - Date to format
 * @returns Formatted full datetime string
 */
export const formatFullDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPpp');
};

/**
 * Format a date as short date (e.g., "Jan 31, 2026")
 * @param date - Date to format
 * @returns Formatted short date string
 */
export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PP');
};

/**
 * Format a date as time only (e.g., "3:45 PM")
 * @param date - Date to format
 * @returns Formatted time string
 */
export const formatTimeOnly = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'p');
};

/**
 * Format a date as ISO string (e.g., "2026-01-31T15:45:00.000Z")
 * @param date - Date to format
 * @returns ISO string
 */
export const formatISO = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};
