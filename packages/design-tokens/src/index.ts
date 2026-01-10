/**
 * Glassbox Design Tokens - Glassmorphic Nature Theme
 *
 * Design Philosophy:
 * - Transparent glass cards over nature backgrounds with grass accents
 * - Evokes premium, clean, professional feel with natural grounding
 * - WCAG AA compliant color combinations
 *
 * @packageDocumentation
 * @module @glassbox/design-tokens
 * @version 0.1.0
 *
 * @example Basic Usage
 * ```typescript
 * import { colors, typography, spacing } from '@glassbox/design-tokens';
 *
 * // Use in JavaScript
 * element.style.color = colors.grass[500];
 *
 * // Use with Tailwind
 * <button className="bg-grass-500 text-white">Click me</button>
 * ```
 */

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

/**
 * Typography System - Font families, sizes, weights, and line heights
 *
 * Font Stack Philosophy:
 * - Display: Serif for elegance and sophistication (headings)
 * - Body: Sans-serif for readability and modern feel (content)
 * - Mono: Monospace for code and numerical data
 *
 * @example
 * ```tsx
 * <h1 className="font-display text-5xl">Portfolio Optimization</h1>
 * <p className="font-body text-base">Analyze your investments...</p>
 * <code className="font-mono text-sm">AAPL: $150.25</code>
 * ```
 */
export const typography = {
  /**
   * Font Families
   *
   * Usage:
   * - display: Hero headings, page titles, marketing copy
   * - body: All body text, UI labels, descriptions
   * - mono: Code blocks, numerical data, technical content
   */
  fontFamily: {
    /** Elegant serif for headings - Newsreader with fallback to Georgia */
    display: '"Newsreader", Georgia, serif',
    /** Clean sans-serif for body text - Inter with system font fallback */
    body: '"Inter", system-ui, sans-serif',
    /** Monospace for code and data - JetBrains Mono with fallback */
    mono: '"JetBrains Mono", monospace',
  },

  /**
   * Font Sizes - Type scale based on 4px baseline
   *
   * Scale: xs → 6xl (12px → 60px)
   * Base: 1rem (16px) - default body text size
   *
   * Usage:
   * - xs, sm: Labels, captions, small UI elements
   * - base, lg: Body text, UI content
   * - xl, 2xl: Section headings, large UI elements
   * - 3xl, 4xl: Page headings
   * - 5xl, 6xl: Hero headings, marketing
   */
  fontSize: {
    /** 12px - Small labels, hints */
    xs: '0.75rem',
    /** 14px - Secondary text, captions */
    sm: '0.875rem',
    /** 16px - Body text (default) */
    base: '1rem',
    /** 18px - Large body, section intro */
    lg: '1.125rem',
    /** 20px - Small headings */
    xl: '1.25rem',
    /** 24px - Section headings */
    '2xl': '1.5rem',
    /** 30px - Page sections */
    '3xl': '1.875rem',
    /** 36px - Page headings */
    '4xl': '2.25rem',
    /** 48px - Hero headings */
    '5xl': '3rem',
    /** 60px - Main titles */
    '6xl': '3.75rem',
  },

  /**
   * Line Heights - Vertical rhythm
   *
   * Usage:
   * - tight: Code, dense information
   * - snug: Headings
   * - normal: Body text (default)
   * - relaxed: Long-form content
   * - loose: Very open, airy layouts
   */
  lineHeight: {
    /** 1.25 - Code blocks, dense data tables */
    tight: '1.25',
    /** 1.375 - Headings */
    snug: '1.375',
    /** 1.5 - Body text (default) */
    normal: '1.5',
    /** 1.625 - Long-form content, articles */
    relaxed: '1.625',
    /** 2.0 - Very open layouts */
    loose: '2',
  },

  /**
   * Font Weights - Text emphasis
   *
   * Usage:
   * - light: De-emphasized text
   * - normal: Body text (default)
   * - medium: Subtle emphasis
   * - semibold: UI labels, strong emphasis
   * - bold: Headings, important text
   * - extrabold: Hero headings, major emphasis
   */
  fontWeight: {
    /** 300 - De-emphasized text */
    light: '300',
    /** 400 - Body text (default) */
    normal: '400',
    /** 500 - Subtle emphasis */
    medium: '500',
    /** 600 - UI labels, buttons */
    semibold: '600',
    /** 700 - Headings */
    bold: '700',
    /** 800 - Hero headings */
    extrabold: '800',
  },
};

/**
 * Spacing System - Based on 4px baseline grid
 *
 * Scale: 0 → 24 (0px → 96px)
 * Base unit: 4 = 1rem (16px)
 *
 * Usage:
 * - 0-2: Tight spacing (borders, small gaps)
 * - 3-6: Component spacing (padding, small margins)
 * - 8-12: Section spacing (large gaps, layout)
 * - 16-24: Page spacing (major sections, hero)
 *
 * @example
 * ```tsx
 * <div className="p-6 mb-8">
 *   <h2 className="mb-4">Section Title</h2>
 *   <p className="mb-2">Content with consistent rhythm</p>
 * </div>
 * ```
 */
export const spacing = {
  /** 1px - Hairline borders, fine adjustments */
  px: '1px',
  /** 0px - No spacing */
  0: '0',
  /** 2px - Minimal spacing */
  0.5: '0.125rem',
  /** 4px - Tiny gaps */
  1: '0.25rem',
  /** 8px - Small gaps */
  2: '0.5rem',
  /** 12px - Comfortable spacing */
  3: '0.75rem',
  /** 16px - Base unit spacing */
  4: '1rem',
  /** 20px - Comfortable padding */
  5: '1.25rem',
  /** 24px - Card padding, section spacing */
  6: '1.5rem',
  /** 32px - Large component spacing */
  8: '2rem',
  /** 40px - Section gaps */
  10: '2.5rem',
  /** 48px - Major section spacing */
  12: '3rem',
  /** 64px - Large layout spacing */
  16: '4rem',
  /** 80px - Hero section spacing */
  20: '5rem',
  /** 96px - Major page sections */
  24: '6rem',
};

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

/**
 * Gradient System - Background gradients for pages and sections
 *
 * Philosophy: Subtle, nature-inspired gradients
 * Creates depth and visual interest without overpowering content
 *
 * Usage:
 * - page: Main page backgrounds (fixed attachment)
 * - hero: Hero sections
 * - section: Section backgrounds
 * - rain: Overlay effects
 *
 * @example
 * ```tsx
 * <body style={{ background: gradients.page, backgroundAttachment: 'fixed' }}>
 *   Page content with fixed gradient background
 * </body>
 * ```
 */
export const gradients = {
  /** Page background - sky to grass to sky */
  page: 'linear-gradient(135deg, #e5ecf4 0%, #d1f0dd 50%, #cbd8e9 100%)',
  /** Hero section - vertical sky to grass */
  hero: 'linear-gradient(180deg, #f4f7fb 0%, #f0f9f4 100%)',
  /** Section background - subtle warm gradient */
  section: 'linear-gradient(135deg, #fafbfc 0%, #f9f7f4 100%)',
  /** Rain overlay - subtle blue tint */
  rain: 'linear-gradient(180deg, rgba(123, 155, 196, 0.1) 0%, rgba(177, 188, 199, 0.05) 100%)',
};

/**
 * Animation Keyframes - Nature-inspired motion
 *
 * Philosophy: Gentle, organic animations that mimic natural movement
 * Use for subtle UI enhancements, not overwhelming effects
 *
 * Animations:
 * - sway: Grass swaying in wind (subtle movement)
 * - fall: Rain falling (decorative effect)
 * - drift: Clouds drifting (slow horizontal movement)
 * - grow: Elements growing into view (entrance animation)
 *
 * @example Tailwind Usage
 * ```tsx
 * // In tailwind.config.ts
 * animation: {
 *   sway: 'sway 3s ease-in-out infinite',
 *   grow: 'grow 0.6s ease-out',
 * }
 *
 * // In components
 * <div className="animate-sway">🌿</div>
 * <div className="animate-grow">Content fades in</div>
 * ```
 */
export const animations = {
  /** Sway - Gentle side-to-side like grass in wind */
  sway: {
    '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
    '50%': { transform: 'translateX(2px) rotate(1deg)' },
  },
  /** Fall - Vertical drop like falling rain */
  fall: {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '50%': { opacity: '0.5' },
    '100%': { transform: 'translateY(100vh)', opacity: '0' },
  },
  /** Drift - Slow horizontal movement like clouds */
  drift: {
    '0%, 100%': { transform: 'translateX(0)' },
    '50%': { transform: 'translateX(20px)' },
  },
  /** Grow - Scale up with fade in (entrance animation) */
  grow: {
    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
};

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

/**
 * ====================
 * DARK MODE TOKENS
 * ====================
 *
 * Philosophy: Inverted color palette for dark theme
 * - Darker backgrounds (#0f1419 to #1a2a24)
 * - Lighter text (white with opacity)
 * - Brighter accent colors for contrast
 * - Adjusted glassmorphism (lighter overlays on dark)
 *
 * Usage:
 * Apply when html.dark class is present
 * Tailwind handles automatically with dark: variant
 *
 * @example
 * ```tsx
 * <div className="bg-earth-200 dark:bg-white/[0.08]">
 *   Adapts to light/dark mode
 * </div>
 * ```
 */

/**
 * Dark Mode Color Palette
 *
 * Inverted scale: 50 (darkest) to 900 (lightest)
 * Use brighter values (400-700) for good contrast on dark backgrounds
 */
export const darkColors = {
  /** Primary Colors - Lighter Grass for better contrast on dark backgrounds */
  grass: {
    50: '#144d2b',
    100: '#185f33',
    200: '#1d7a42',
    300: '#22944f',
    400: '#2fb866',
    500: '#4aca80',
    600: '#70d99f',
    700: '#a8e6c1',
    800: '#d1f0dd',
    900: '#f0f9f4',
  },

  /** Secondary Colors - Lighter Sky for information and secondary actions */
  sky: {
    50: '#2b3950',
    100: '#334461',
    200: '#3d5276',
    300: '#4a6690',
    400: '#5b80ad',
    500: '#7a9bc4',
    600: '#a7bdd8',
    700: '#cbd8e9',
    800: '#e5ecf4',
    900: '#f4f7fb',
  },

  /** Accent Colors - Lighter Earth for warnings and warm accents */
  earth: {
    50: '#3a3023',
    100: '#473b28',
    200: '#584932',
    300: '#6e5a3e',
    400: '#8c7350',
    500: '#a88f68',
    600: '#c4ae8e',
    700: '#dccfbb',
    800: '#ede7dd',
    900: '#f9f7f4',
  },

  /** Neutral Colors - Lighter neutrals for text and borders on dark backgrounds */
  rain: {
    50: '#343d43',
    100: '#424c54',
    200: '#55606a',
    300: '#6b7885',
    400: '#8895a3',
    500: '#b1bcc7',
    600: '#cfd6dd',
    700: '#e3e7eb',
    800: '#f1f3f5',
    900: '#fafbfc',
  },

  /** Accent Colors - Brighter for better contrast on dark backgrounds */
  accent: {
    /** Lighter purple - premium features */
    purple: '#d8bffd',
    /** Lighter coral - hedging, risk indicators */
    coral: '#ff8a8a',
    /** Lighter gold - value highlights */
    gold: '#fcd34d',
    /** Lighter cyan - data, analysis */
    cyan: '#22d3ee',
    /** Lighter pink - special highlights */
    pink: '#f472b6',
    /** Lighter indigo - advanced features */
    indigo: '#a5b4fc',
  },

  /** Semantic Colors - Dark Mode variants with better contrast */
  semantic: {
    /** Success - Lighter grass for visibility */
    success: '#4aca80',
    /** Warning - Earth tone */
    warning: '#a88f68',
    /** Error - Lighter coral for urgency */
    error: '#ff8a8a',
    /** Info - Sky blue */
    info: '#7a9bc4',
  },

  /** Pure white - same in all modes */
  white: '#ffffff',
  /** Pure black - same in all modes */
  black: '#000000',
  /** Transparent - same in all modes */
  transparent: 'transparent',
};

/**
 * Dark Mode Gradients - Deep, night-time backgrounds
 * Very dark navy-green evokes deep night sky with nature
 */
export const darkGradients = {
  page: 'linear-gradient(135deg, #0f1419 0%, #1a2a24 50%, #141a1f 100%)',
  hero: 'linear-gradient(180deg, #151b22 0%, #1a2a24 100%)',
  section: 'linear-gradient(135deg, #0f1419 0%, #1a1f24 100%)',
  rain: 'linear-gradient(180deg, rgba(91, 128, 173, 0.1) 0%, rgba(177, 188, 199, 0.05) 100%)',
};

/**
 * Dark Mode Shadows - Enhanced for depth perception on dark backgrounds
 * Stronger, more pronounced shadows needed for dark mode
 */
export const darkShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  DEFAULT: '0 2px 8px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 16px 0 rgba(0, 0, 0, 0.5)',
  lg: '0 8px 24px 0 rgba(0, 0, 0, 0.6)',
  xl: '0 12px 32px 0 rgba(0, 0, 0, 0.7)',
  '2xl': '0 20px 48px 0 rgba(0, 0, 0, 0.8)',
  rain: '0 4px 20px 0 rgba(26, 42, 36, 0.5)',
  mist: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
};

/**
 * Dark Mode Glassmorphism - Lighter glass overlays on dark backgrounds
 * Semi-transparent white creates frosted glass effect over dark surfaces
 */
export const darkGlass = {
  sm: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  DEFAULT: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  lg: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    shadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
  },
  xl: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    shadow: '0 16px 64px rgba(0, 0, 0, 0.6)',
  },
};

/**
 * Dark Mode Component Tokens - Adjusted colors for dark theme components
 * Brighter accent colors for better visibility on dark backgrounds
 */
export const darkComponents = {
  button: {
    primary: {
      bg: darkColors.grass[400],
      hover: darkColors.grass[500],
      text: '#000000',
    },
    secondary: {
      bg: darkColors.sky[500],
      hover: darkColors.sky[600],
      text: '#ffffff',
    },
    outline: {
      border: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.3)',
      text: darkColors.grass[600],
    },
  },
  panel: {
    bg: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.12)',
    text: '#ffffff',
    backdropBlur: '10px',
  },
  input: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    focus: darkColors.grass[600],
    placeholder: 'rgba(255, 255, 255, 0.5)',
    text: '#ffffff',
    backdropBlur: '8px',
  },
};

/**
 * Dark Mode Card Gradients - Brighter overlays for visibility
 * Increased opacity for better contrast on dark glass cards
 */
export const darkCardGradients = {
  /** Purple to Blue - Premium features (dark mode) */
  purpleBlue: 'linear-gradient(135deg, rgba(168, 160, 253, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%)',
  /** Coral to Pink - Risk indicators (dark mode) */
  coralPink: 'linear-gradient(135deg, rgba(255, 138, 138, 0.15) 0%, rgba(244, 114, 182, 0.08) 100%)',
  /** Gold to Cyan - Data features (dark mode) */
  goldCyan: 'linear-gradient(135deg, rgba(252, 211, 77, 0.15) 0%, rgba(34, 211, 238, 0.08) 100%)',
  /** Indigo to Green - Growth features (dark mode) */
  indigoGreen: 'linear-gradient(135deg, rgba(165, 180, 252, 0.15) 0%, rgba(106, 204, 128, 0.08) 100%)',
};
