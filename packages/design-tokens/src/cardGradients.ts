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
 * - cyanBlue: Modern tech, primary features, data analysis
 * - cyanPurple: Premium features, advanced tools
 * - coralPink: Risk, hedging, urgent features, alerts
 * - slateGlow: Neutral, grounding elements
 *
 * @example CSS Implementation
 * ```css
 * .feature-card::before {
 *   content: '';
 *   position: absolute;
 *   inset: 0;
 *   background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
 *   border-radius: inherit;
 * }
 * ```
 */
export const cardGradients = {
  /** Cyan to Blue - Modern tech, primary features, data analysis */
  cyanBlue: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
  /** Cyan to Purple - Premium features, advanced tools */
  cyanPurple: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  /** Coral to Pink - Risk, hedging, urgent features */
  coralPink: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
  /** Slate Glow - Neutral, grounding elements, subtle highlight */
  slateGlow: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(203, 213, 225, 0.05) 100%)',
};
