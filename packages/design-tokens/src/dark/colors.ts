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
