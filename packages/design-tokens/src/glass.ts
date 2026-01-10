/**
 * Glassmorphism Effects - Frosted glass aesthetics
 *
 * Philosophy: Core of Glassbox design system
 * Semi-transparent backgrounds with backdrop blur for depth
 *
 * Scale: sm → xl (subtle → pronounced glass effect)
 *
 * Properties:
 * - background: Semi-transparent white overlay
 * - backdropFilter: blur() for frosted glass effect
 * - border: Subtle white border for definition
 * - shadow: Depth and elevation
 *
 * Usage: Apply to cards, panels, modals for glass effect
 *
 * @example CSS Implementation
 * ```css
 * .glass-card {
 *   background: rgba(255, 255, 255, 0.12);
 *   backdrop-filter: blur(10px);
 *   border: 1px solid rgba(255, 255, 255, 0.18);
 *   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
 * }
 * ```
 */
export const glass = {
  sm: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  DEFAULT: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  lg: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
  xl: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    shadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
  },
};
