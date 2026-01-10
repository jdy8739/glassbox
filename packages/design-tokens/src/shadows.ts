/**
 * Shadow System - Depth and elevation
 *
 * Philosophy: Soft, natural shadows that enhance glassmorphism
 * Use warm, nature-tinted shadows for organic feel
 *
 * Scale: sm → 2xl (subtle → pronounced)
 * Special: rain, mist (thematic shadows)
 *
 * Usage:
 * - sm: Subtle depth (inputs, small cards)
 * - DEFAULT: Standard cards, buttons
 * - md, lg: Floating panels, important cards
 * - xl, 2xl: Modals, hero sections
 * - rain, mist: Special effects (optional)
 *
 * @example
 * ```tsx
 * <div className="shadow-lg hover:shadow-xl transition-shadow">
 *   Elevated glass card
 * </div>
 * ```
 */
export const shadows = {
  /** Subtle shadow - inputs, small elements */
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  /** Standard shadow - cards, buttons (default) */
  DEFAULT: '0 2px 8px 0 rgba(27, 58, 45, 0.08)',
  /** Medium shadow - important cards */
  md: '0 4px 16px 0 rgba(27, 58, 45, 0.10)',
  /** Large shadow - floating panels */
  lg: '0 8px 24px 0 rgba(27, 58, 45, 0.12)',
  /** Extra large shadow - modals, overlays */
  xl: '0 12px 32px 0 rgba(27, 58, 45, 0.15)',
  /** Huge shadow - hero sections */
  '2xl': '0 20px 48px 0 rgba(27, 58, 45, 0.20)',
  /** Rain-tinted shadow - special effect */
  rain: '0 4px 20px 0 rgba(123, 155, 196, 0.15)',
  /** Mist-tinted shadow - special effect */
  mist: '0 8px 32px 0 rgba(177, 188, 199, 0.20)',
};
