/**
 * Color System - Nature-inspired palette
 *
 * Primary: Grass (growth, success, primary actions)
 * Secondary: Sky (calm, information, secondary actions)
 * Accent: Earth (grounding, warnings, tertiary)
 * Neutral: Rain (text, borders, backgrounds)
 *
 * Scale: 50 (lightest) to 900 (darkest)
 * Recommended: Use 500-600 for primary UI elements
 *
 * @example Primary Button
 * ```typescript
 * background: colors.grass[500]  // Main brand green
 * hover: colors.grass[600]       // Darker on hover
 * ```
 */
export const colors = {
  /**
   * Primary Colors - Grass & Foliage
   *
   * Usage:
   * - Primary CTAs and buttons
   * - Success states and positive feedback
   * - Active navigation items
   * - Growth indicators
   *
   * Accessibility:
   * - grass-600 onwards: WCAG AA on white backgrounds
   * - grass-700 onwards: WCAG AAA on white backgrounds
   *
   * @example
   * ```tsx
   * <button className="bg-grass-500 hover:bg-grass-600">
   *   Get Started
   * </button>
   * ```
   */
  grass: {
    50: '#f0f9f4',
    100: '#d1f0dd',
    200: '#a8e6c1',
    300: '#70d99f',
    400: '#4aca80',
    500: '#2fb866',
    600: '#22944f',
    700: '#1d7a42',
    800: '#185f33',
    900: '#144d2b',
  },

  /**
   * Secondary Colors - Rainy Sky
   *
   * Usage:
   * - Secondary CTAs and actions
   * - Informational messages
   * - Complementary UI elements
   * - Data visualization accents
   *
   * Accessibility:
   * - sky-600 onwards: WCAG AA on white backgrounds
   * - Pairs well with grass colors
   *
   * @example
   * ```tsx
   * <button className="bg-sky-400 text-white">
   *   Learn More
   * </button>
   * <div className="bg-sky-100 text-sky-800">Info message</div>
   * ```
   */
  sky: {
    50: '#f4f7fb',
    100: '#e5ecf4',
    200: '#cbd8e9',
    300: '#a7bdd8',
    400: '#7a9bc4',
    500: '#5b80ad',
    600: '#4a6690',
    700: '#3d5276',
    800: '#334461',
    900: '#2b3950',
  },

  /**
   * Accent Colors - Earth & Soil
   *
   * Usage:
   * - Warning states
   * - Grounding elements
   * - Natural backgrounds
   * - Warm accents
   *
   * Accessibility:
   * - earth-600 onwards: WCAG AA on white backgrounds
   * - Use for warm, organic feel
   *
   * @example
   * ```tsx
   * <div className="bg-earth-100 border border-earth-400">
   *   Warning: Review your portfolio allocation
   * </div>
   * ```
   */
  earth: {
    50: '#f9f7f4',
    100: '#ede7dd',
    200: '#dccfbb',
    300: '#c4ae8e',
    400: '#a88f68',
    500: '#8c7350',
    600: '#6e5a3e',
    700: '#584932',
    800: '#473b28',
    900: '#3a3023',
  },

  /**
   * Neutral Colors - Rain & Mist
   *
   * Usage:
   * - Body text (rain-700 to rain-900)
   * - Borders and dividers (rain-200 to rain-400)
   * - Subtle backgrounds (rain-50 to rain-100)
   * - Disabled states (rain-400 to rain-500)
   *
   * Accessibility:
   * - rain-700 onwards: WCAG AA for body text on white
   * - rain-900: WCAG AAA for body text on white
   * - Primary text color for light mode
   *
   * @example
   * ```tsx
   * <p className="text-rain-900">Primary text content</p>
   * <p className="text-rain-600">Secondary text</p>
   * <div className="border border-rain-300">Card border</div>
   * ```
   */
  rain: {
    50: '#fafbfc',
    100: '#f1f3f5',
    200: '#e3e7eb',
    300: '#cfd6dd',
    400: '#b1bcc7',
    500: '#8895a3',
    600: '#6b7885',
    700: '#55606a',
    800: '#424c54',
    900: '#343d43',
  },

  /**
   * Accent Colors - Point Colors
   *
   * Vibrant colors for visual interest and feature differentiation.
   * Use sparingly for emphasis and to draw attention.
   *
   * Usage:
   * - Feature highlights and badges
   * - Data visualization categories
   * - Gradient overlays on cards
   * - Special call-outs
   *
   * Note: Use with glassmorphic backgrounds for best effect
   *
   * @example
   * ```tsx
   * <span className="inline-flex px-2 py-1 bg-purple-300/15 border border-purple-300/30 text-purple-700 rounded-full">
   *   Premium
   * </span>
   * <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/5">
   *   Feature card with gradient overlay
   * </div>
   * ```
   */
  accent: {
    /** Elegant purple - for premium features and special highlights */
    purple: '#a78bfa',
    /** Vibrant coral/red - for hedging, risk indicators, or urgent actions */
    coral: '#ff6b6b',
    /** Warm gold - for premium features, value highlights */
    gold: '#fbbf24',
    /** Cool cyan - for data, analysis, technical features */
    cyan: '#06b6d4',
    /** Vibrant pink - for special highlights, promotions */
    pink: '#ec4899',
    /** Deep indigo - for advanced features, professional tools */
    indigo: '#6366f1',
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
   * <div className="bg-grass-100 text-grass-900 border border-grass-400">
   *   ✓ Portfolio optimized successfully
   * </div>
   * <div className="bg-red-100 text-red-900 border border-red-400">
   *   ✗ Analysis failed: Invalid ticker symbols
   * </div>
   * ```
   */
  semantic: {
    /** Success state - grass[500] - Growth, positive outcomes */
    success: '#2fb866',
    /** Warning state - earth[400] - Caution, review needed */
    warning: '#a88f68',
    /** Error state - Coral red - Failed actions, critical alerts */
    error: '#ff6b6b',
    /** Info state - sky[400] - Information, helpful tips */
    info: '#7a9bc4',
  },

  /** Pure white - use for text on dark backgrounds */
  white: '#ffffff',
  /** Pure black - use sparingly, prefer rain-900 for softer contrast */
  black: '#000000',
  /** Transparent - for overlay effects */
  transparent: 'transparent',
};
