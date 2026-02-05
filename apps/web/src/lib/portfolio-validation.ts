import type { PortfolioItem } from '@glassbox/types';
import type { TFunction } from 'i18next';

interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Pure validation function for portfolio analysis
 * Returns error message string if invalid, null if valid
 */
export function validatePortfolioAnalysis(
  items: PortfolioItem[],
  dateRange: DateRange,
  t: TFunction
): string | null {
  // Filter out zero quantities
  const nonZeroItems = items.filter((item) => item.quantity > 0);

  if (nonZeroItems.length === 0) {
    return t('portfolio.builder.validation.no-positive-quantity');
  }

  // Check if dates are missing
  if (!dateRange.startDate || !dateRange.endDate) {
    return t('portfolio.builder.analysis.dates-required');
  }

  // Validate date range order
  if (dateRange.startDate >= dateRange.endDate) {
    return t('portfolio.builder.validation.start-before-end');
  }

  // Check for future dates
  const endDate = new Date(dateRange.endDate);
  const startDate = new Date(dateRange.startDate);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (endDate > todayDate) {
    return t('portfolio.builder.validation.end-not-future');
  }

  if (startDate > todayDate) {
    return t('portfolio.builder.validation.start-not-future');
  }

  // Check for minimum date range (45 days)
  const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 45) {
    return t('portfolio.builder.validation.date-range-minimum');
  }

  return null; // No errors
}

/**
 * Check if end date is today (requires user confirmation)
 */
export function isEndDateToday(dateRange: DateRange): boolean {
  if (!dateRange.endDate) return false;

  const endDate = new Date(dateRange.endDate);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return endDate.getTime() === todayDate.getTime();
}
