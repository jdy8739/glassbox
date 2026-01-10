/**
 * Card Gradient Overlays - Colorful accents for glass cards
 *
 * Philosophy: Add visual interest and differentiation to glass cards
 * Subtle gradient overlays that work with glassmorphism
 *
 * Usage:
 * - Apply as ::before pseudo-element on cards
 * - Use to differentiate feature categories
 * - Combine with glass backgrounds for depth
 *
 * Variants:
 * - purpleBlue: Premium, professional features
 * - coralPink: Risk, hedging, urgent features
 * - goldCyan: Value, analysis, data features
 * - indigoGreen: Advanced, growth features
 *
 * @example CSS Implementation
 * ```css
 * .feature-card::before {
 *   content: '';
 *   position: absolute;
 *   inset: 0;
 *   background: linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
 *   border-radius: inherit;
 *   opacity: 0.4;
 * }
 * ```
 */
export const cardGradients = {
  /** Purple to Blue - Premium, professional features */
  purpleBlue: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
  /** Coral to Pink - Risk, hedging, urgent actions */
  coralPink: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
  /** Gold to Cyan - Value, analysis, data */
  goldCyan: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
  /** Indigo to Green - Advanced, growth features */
  indigoGreen: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(47, 184, 102, 0.05) 100%)',
};
