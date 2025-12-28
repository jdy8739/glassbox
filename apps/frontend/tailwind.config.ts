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
        // Light mode colors (default)
        grass: colors.grass,
        sky: colors.sky,
        earth: colors.earth,
        rain: colors.rain,
        // Accent colors (light mode)
        purple: { 300: colors.accent.purple },
        coral: { 300: colors.accent.coral },
        gold: { 300: colors.accent.gold },
        cyan: { 300: colors.accent.cyan },
        pink: { 300: colors.accent.pink },
        indigo: { 300: colors.accent.indigo },
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
