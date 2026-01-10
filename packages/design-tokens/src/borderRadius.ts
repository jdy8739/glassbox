/**
 * Border Radius System - Organic, rounded shapes
 *
 * Philosophy: Embrace rounded corners for soft, approachable feel
 * Glass UI aesthetic relies on generous border radius (lg, xl, 2xl)
 *
 * Usage:
 * - none, sm: Sharp elements (rare)
 * - DEFAULT, md: Buttons, inputs, small cards
 * - lg, xl: Cards, panels, modals
 * - 2xl: Hero sections, large panels
 * - full: Pills, badges, avatars
 *
 * @example
 * ```tsx
 * <div className="rounded-2xl">Large glass panel</div>
 * <button className="rounded-lg">Standard button</button>
 * <span className="rounded-full">Badge</span>
 * ```
 */
export const borderRadius = {
  /** 0 - Sharp corners (use sparingly) */
  none: '0',
  /** 4px - Subtle rounding */
  sm: '0.25rem',
  /** 8px - Standard rounding (default) */
  DEFAULT: '0.5rem',
  /** 12px - Comfortable rounding */
  md: '0.75rem',
  /** 16px - Pronounced rounding (buttons, inputs) */
  lg: '1rem',
  /** 24px - Large rounding (cards, panels) */
  xl: '1.5rem',
  /** 32px - Extra large rounding (hero sections) */
  '2xl': '2rem',
  /** 9999px - Pill shape (badges, pills) */
  full: '9999px',
};
