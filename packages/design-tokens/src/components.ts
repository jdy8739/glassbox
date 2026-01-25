import { colors } from './colors';

/**
 * Component Tokens - Predefined component styles
 *
 * Philosophy: Semantic component-level tokens for common UI patterns
 * Black/white primary colors with cyan accents and higher glass opacity
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
      bg: colors.black,
      hover: colors.slate[800],
      text: colors.white,
      border: 'rgba(6, 182, 212, 0.3)',
    },
    secondary: {
      bg: colors.cyan[500],
      hover: colors.cyan[600],
      text: colors.white,
    },
    outline: {
      bg: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.3)',
      hover: 'rgba(255, 255, 255, 0.2)',
      text: colors.white,
    },
  },
  panel: {
    bg: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.4)',
    text: colors.slate[900],
    backdropBlur: '12px',
  },
  input: {
    bg: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.3)',
    focus: colors.cyan[500],
    placeholder: colors.slate[400],
    text: colors.slate[900],
    backdropBlur: '8px',
  },
};
