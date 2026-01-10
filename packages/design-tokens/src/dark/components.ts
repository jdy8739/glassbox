import { darkColors } from './colors';

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
