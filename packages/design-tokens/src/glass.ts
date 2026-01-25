/**
 * Glassmorphism Effects - Frosted glass aesthetics
 *
 * Philosophy: Core of Glassbox design system
 * Higher opacity for better visibility with black/white primary colors
 * Semi-transparent backgrounds with backdrop blur for depth
 *
 * Scale: sm → xl (subtle → pronounced glass effect)
 *
 * Properties:
 * - background: Higher opacity (0.6-0.8) for black/white contrast
 * - backdropFilter: blur() for frosted glass effect
 * - border: Semi-transparent border for definition
 * - shadow: Depth and elevation
 *
 * Usage: Apply to cards, panels, modals for glass effect
 *
 * @example CSS Implementation
 * ```css
 * .glass-card {
 *   background: rgba(255, 255, 255, 0.7);
 *   backdrop-filter: blur(12px);
 *   border: 1px solid rgba(255, 255, 255, 0.4);
 *   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
 * }
 * ```
 */
export const glass = {
  sm: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  DEFAULT: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  lg: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    shadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
  xl: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    shadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
  },
};
