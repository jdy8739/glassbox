import type { Config } from 'tailwindcss';
import { colors, shadows, gradients, animations, darkColors, darkShadows } from '@glassbox/design-tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary neutral colors
        slate: colors.slate,
        // Primary accent color
        cyan: colors.cyan,
        // Alert color
        coral: colors.coral,
        // Semantic colors
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
        info: colors.semantic.info,
      },
      boxShadow: {
        sm: shadows.sm,
        DEFAULT: shadows.DEFAULT,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        '2xl': shadows['2xl'],
        rain: shadows.rain,
        mist: shadows.mist,
      },
      animation: {
        sway: 'sway 3s ease-in-out infinite',
        fall: 'fall 1s linear infinite',
        drift: 'drift 8s ease-in-out infinite',
        grow: 'grow 0.6s ease-out',
      },
      keyframes: animations,
    },
  },
  plugins: [
    // Dark mode color variants plugin
    function ({ addVariant, matchVariant }: any) {
      addVariant('light', 'html:not(.dark) &');
      matchVariant(
        'dark-bg',
        (value: string) => {
          return `html.dark [data-dark-bg="${value}"] &`;
        },
        {
          values: {
            primary: 'primary',
            secondary: 'secondary',
          },
        }
      );
    },
  ],
};

export default config;
