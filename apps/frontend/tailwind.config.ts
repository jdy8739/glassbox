import type { Config } from 'tailwindcss';
import { colors, shadows, gradients, animations } from '@glassbox/design-tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        grass: colors.grass,
        sky: colors.sky,
        earth: colors.earth,
        rain: colors.rain,
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
  plugins: [],
};

export default config;
