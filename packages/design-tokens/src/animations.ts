/**
 * Animation Keyframes - Nature-inspired motion
 *
 * Philosophy: Gentle, organic animations that mimic natural movement
 * Use for subtle UI enhancements, not overwhelming effects
 *
 * Animations:
 * - sway: Grass swaying in wind (subtle movement)
 * - fall: Rain falling (decorative effect)
 * - drift: Clouds drifting (slow horizontal movement)
 * - grow: Elements growing into view (entrance animation)
 *
 * @example Tailwind Usage
 * ```tsx
 * // In tailwind.config.ts
 * animation: {
 *   sway: 'sway 3s ease-in-out infinite',
 *   grow: 'grow 0.6s ease-out',
 * }
 *
 * // In components
 * <div className="animate-sway">🌿</div>
 * <div className="animate-grow">Content fades in</div>
 * ```
 */
export const animations = {
  /** Sway - Gentle side-to-side like grass in wind */
  sway: {
    '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
    '50%': { transform: 'translateX(2px) rotate(1deg)' },
  },
  /** Fall - Vertical drop like falling rain */
  fall: {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '50%': { opacity: '0.5' },
    '100%': { transform: 'translateY(100vh)', opacity: '0' },
  },
  /** Drift - Slow horizontal movement like clouds */
  drift: {
    '0%, 100%': { transform: 'translateX(0)' },
    '50%': { transform: 'translateX(20px)' },
  },
  /** Grow - Scale up with fade in (entrance animation) */
  grow: {
    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
};
