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
