import { darkColors } from './colors';

/**
 * Dark Mode Component Tokens - Adjusted colors for dark theme components
 * White primary buttons with cyan accents, higher glass opacity for dark mode
 */
export const darkComponents = {
  button: {
    primary: {
      bg: '#ffffff',
      hover: darkColors.slate[100],
      text: '#000000',
      border: 'rgba(34, 211, 238, 0.4)',
    },
    secondary: {
      bg: darkColors.cyan[500],
      hover: darkColors.cyan[600],
      text: '#ffffff',
    },
    outline: {
      bg: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.15)',
      text: '#ffffff',
    },
  },
  panel: {
    bg: 'rgba(15, 23, 42, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    backdropBlur: '12px',
  },
  input: {
    bg: 'rgba(15, 23, 42, 0.6)',
    border: 'rgba(255, 255, 255, 0.15)',
    focus: darkColors.cyan[500],
    placeholder: 'rgba(255, 255, 255, 0.5)',
    text: '#ffffff',
    backdropBlur: '8px',
  },
};
