/**
 * Glassbox Design Tokens - Glassmorphic Nature Theme
 * Transparent glass cards over nature backgrounds with grass accents
 * Evokes premium, clean, professional feel with natural grounding
 */

export const colors = {
  // Primary Colors - Grass & Foliage
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

  // Secondary Colors - Rainy Sky
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

  // Accent Colors - Earth & Soil
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

  // Neutral Colors - Rain & Mist
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

  // Accent Colors - Point Colors
  accent: {
    purple: '#a78bfa',       // Elegant purple
    coral: '#ff6b6b',        // Vibrant coral/red
    gold: '#fbbf24',         // Warm gold
    cyan: '#06b6d4',         // Cool cyan
    pink: '#ec4899',         // Vibrant pink
    indigo: '#6366f1',       // Deep indigo
  },

  // Semantic Colors
  semantic: {
    success: '#2fb866',      // grass[500] - Growth, positive
    warning: '#a88f68',      // earth[400] - Caution
    error: '#ff6b6b',        // Coral red
    info: '#7a9bc4',         // sky[400] - Information
  },

  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const typography = {
  fontFamily: {
    display: '"Newsreader", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 2px 8px 0 rgba(27, 58, 45, 0.08)',
  md: '0 4px 16px 0 rgba(27, 58, 45, 0.10)',
  lg: '0 8px 24px 0 rgba(27, 58, 45, 0.12)',
  xl: '0 12px 32px 0 rgba(27, 58, 45, 0.15)',
  '2xl': '0 20px 48px 0 rgba(27, 58, 45, 0.20)',
  rain: '0 4px 20px 0 rgba(123, 155, 196, 0.15)',
  mist: '0 8px 32px 0 rgba(177, 188, 199, 0.20)',
};

export const gradients = {
  page: 'linear-gradient(135deg, #e5ecf4 0%, #d1f0dd 50%, #cbd8e9 100%)',
  hero: 'linear-gradient(180deg, #f4f7fb 0%, #f0f9f4 100%)',
  section: 'linear-gradient(135deg, #fafbfc 0%, #f9f7f4 100%)',
  rain: 'linear-gradient(180deg, rgba(123, 155, 196, 0.1) 0%, rgba(177, 188, 199, 0.05) 100%)',
};

export const animations = {
  sway: {
    '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
    '50%': { transform: 'translateX(2px) rotate(1deg)' },
  },
  fall: {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '50%': { opacity: '0.5' },
    '100%': { transform: 'translateY(100vh)', opacity: '0' },
  },
  drift: {
    '0%, 100%': { transform: 'translateX(0)' },
    '50%': { transform: 'translateX(20px)' },
  },
  grow: {
    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
};

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

// Glassmorphism Effects
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

// Gradient Overlays for Cards
export const cardGradients = {
  purpleBlue: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
  coralPink: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
  goldCyan: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
  indigoGreen: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(47, 184, 102, 0.05) 100%)',
};
