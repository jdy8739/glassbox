/**
 * Dark Mode Color Palette
 *
 * Inverted scale: 50 (darkest) to 950 (lightest)
 * Use brighter values (400-700) for good contrast on dark backgrounds
 */
export const darkColors = {
  /** Primary Colors - Lighter Slate for better contrast on dark backgrounds */
  slate: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc',
    950: '#fafbfc',
  },

  /** Accent Colors - Brighter Cyan for information and primary actions */
  cyan: {
    50: '#164e63',
    100: '#155e75',
    200: '#0e7490',
    300: '#0891b2',
    400: '#06b6d4',
    500: '#22d3ee',
    600: '#67e8f9',
    700: '#a5f3fc',
    800: '#cffafe',
    900: '#ecfeff',
  },

  /** Alert Colors - Brighter Coral for warnings and alerts */
  coral: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#f87171',
    600: '#fca5a5',
    700: '#fecaca',
    800: '#fee2e2',
    900: '#fef2f2',
  },

  /** Semantic Colors - Dark Mode variants with better contrast */
  semantic: {
    /** Success - Cyan for visibility on dark mode */
    success: '#22d3ee',
    /** Warning - Amber for caution */
    warning: '#fbbf24',
    /** Error - Brighter coral for urgency */
    error: '#f87171',
    /** Info - Bright blue for information */
    info: '#60a5fa',
  },

  /** Pure white - same in all modes */
  white: '#ffffff',
  /** Pure black - same in all modes */
  black: '#000000',
  /** Transparent - same in all modes */
  transparent: 'transparent',
};
