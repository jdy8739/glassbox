/**
 * Dark Mode Glassmorphism - Lighter glass overlays on dark backgrounds
 * Semi-transparent dark surface with lighter borders for slate-based dark theme
 */
export const darkGlass = {
  sm: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  DEFAULT: {
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  lg: {
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
  },
  xl: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    shadow: '0 16px 64px rgba(0, 0, 0, 0.6)',
  },
};
