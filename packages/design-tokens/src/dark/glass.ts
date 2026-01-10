/**
 * Dark Mode Glassmorphism - Lighter glass overlays on dark backgrounds
 * Semi-transparent white creates frosted glass effect over dark surfaces
 */
export const darkGlass = {
  sm: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  DEFAULT: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  lg: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    shadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
  },
  xl: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    shadow: '0 16px 64px rgba(0, 0, 0, 0.6)',
  },
};
