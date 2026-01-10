import { colors } from './colors';

/**
 * Component Tokens - Predefined component styles
 *
 * Philosophy: Semantic component-level tokens for common UI patterns
 * Reduces repetition and ensures consistency
 *
 * Components:
 * - button: Button variants (primary, secondary, outline)
 * - panel: Glass panel styles
 * - input: Form input styles
 *
 * Note: These are design tokens, not React components
 * Use them as references when building UI components
 *
 * @example
 * ```typescript
 * // Reference in your button component
 * const primaryButton = {
 *   backgroundColor: components.button.primary.bg,
 *   color: components.button.primary.text,
 * };
 * ```
 */
export const components = {
  button: {
    primary: {
      bg: colors.grass[500],
      hover: colors.grass[600],
      text: colors.white,
    },
    secondary: {
      bg: colors.sky[400],
      hover: colors.sky[500],
      text: colors.white,
    },
    outline: {
      border: colors.rain[300],
      hover: colors.rain[100],
      text: colors.grass[700],
    },
  },
  panel: {
    bg: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
    text: colors.rain[900],
    backdropBlur: '10px',
  },
  input: {
    bg: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    focus: colors.grass[400],
    placeholder: colors.rain[400],
    text: colors.rain[900],
    backdropBlur: '8px',
  },
};
