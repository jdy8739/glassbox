/**
 * Color System - Modern Glassmorphism palette
 *
 * Primary: Slate (neutrals, professional, clean)
 * Accent: Cyan (modern, tech-forward, primary actions)
 * Alert: Coral (warnings, risk indicators, alerts)
 *
 * Scale: 50 (lightest) to 950 (darkest)
 * Recommended: Use 500-600 for accents, 700-900 for text
 *
 * @example Primary Button
 * ```typescript
 * background: '#000000'  // Black primary button
 * accentBorder: colors.cyan[500]  // Cyan accent border
 * ```
 */
export const colors = {
  /**
   * Primary Colors - Slate Neutrals
   *
   * Usage:
   * - Primary text (700-900)
   * - Borders and dividers (200-400)
   * - Subtle backgrounds (50-100)
   * - Disabled states (400-500)
   *
   * Accessibility:
   * - slate-700 onwards: WCAG AA for body text on white
   * - slate-900: WCAG AAA for body text on white
   *
   * @example
   * ```tsx
   * <p className="text-slate-900">Primary text content</p>
   * <p className="text-slate-600">Secondary text</p>
   * <div className="border border-slate-300">Card border</div>
   * ```
   */
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  /**
   * Accent Colors - Cyan (Modern & Tech-forward)
   *
   * Usage:
   * - Primary CTAs and buttons
   * - Active states and focus indicators
   * - Data visualization accents
   * - Feature highlights and badges
   * - Border accents on glass components
   *
   * Accessibility:
   * - cyan-600 onwards: WCAG AA on white backgrounds
   * - Pairs well with black and slate
   *
   * @example
   * ```tsx
   * <button className="bg-cyan-500 hover:bg-cyan-600 text-white">
   *   Analyze Portfolio
   * </button>
   * <div className="border border-cyan-500/30">Accent border</div>
   * ```
   */
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  /**
   * Alert Colors - Coral/Red (Warnings & Risk)
   *
   * Usage:
   * - Warning states and alerts
   * - Risk indicators and hedging features
   * - Error messages and destructive actions
   * - Important notifications
   *
   * Accessibility:
   * - coral-600 onwards: WCAG AA on white backgrounds
   * - Use for urgent, attention-grabbing elements
   *
   * @example
   * ```tsx
   * <div className="bg-coral-100 border border-coral-400 text-coral-900">
   *   ⚠ Risk alert: High portfolio volatility
   * </div>
   * ```
   */
  coral: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  /**
   * Semantic Colors - Meaning-based colors
   *
   * Usage:
   * - Success: Positive outcomes, confirmations, growth
   * - Warning: Caution, review needed, non-critical alerts
   * - Error: Failed actions, critical alerts, destructive actions
   * - Info: Informational messages, helpful tips, neutral notifications
   *
   * Accessibility: All colors meet WCAG AA on white backgrounds
   *
   * @example
   * ```tsx
   * <div className="bg-cyan-100 text-cyan-900 border border-cyan-400">
   *   ✓ Portfolio optimized successfully
   * </div>
   * <div className="bg-coral-100 text-coral-900 border border-coral-400">
   *   ✗ Analysis failed: Invalid ticker symbols
   * </div>
   * ```
   */
  semantic: {
    /** Success state - cyan[500] - Growth, positive outcomes */
    success: '#06b6d4',
    /** Warning state - amber[500] - Caution, review needed */
    warning: '#f59e0b',
    /** Error state - coral[500] - Failed actions, critical alerts */
    error: '#ef4444',
    /** Info state - blue[500] - Information, helpful tips */
    info: '#3b82f6',
  },

  /** Pure white - use for text on dark backgrounds */
  white: '#ffffff',
  /** Pure black - use for primary buttons and dark accents */
  black: '#000000',
  /** Transparent - for overlay effects */
  transparent: 'transparent',
};
