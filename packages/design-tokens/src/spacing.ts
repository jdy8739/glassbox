/**
 * Spacing System - Based on 4px baseline grid
 *
 * Scale: 0 → 24 (0px → 96px)
 * Base unit: 4 = 1rem (16px)
 *
 * Usage:
 * - 0-2: Tight spacing (borders, small gaps)
 * - 3-6: Component spacing (padding, small margins)
 * - 8-12: Section spacing (large gaps, layout)
 * - 16-24: Page spacing (major sections, hero)
 *
 * @example
 * ```tsx
 * <div className="p-6 mb-8">
 *   <h2 className="mb-4">Section Title</h2>
 *   <p className="mb-2">Content with consistent rhythm</p>
 * </div>
 * ```
 */
export const spacing = {
  /** 1px - Hairline borders, fine adjustments */
  px: '1px',
  /** 0px - No spacing */
  0: '0',
  /** 2px - Minimal spacing */
  0.5: '0.125rem',
  /** 4px - Tiny gaps */
  1: '0.25rem',
  /** 8px - Small gaps */
  2: '0.5rem',
  /** 12px - Comfortable spacing */
  3: '0.75rem',
  /** 16px - Base unit spacing */
  4: '1rem',
  /** 20px - Comfortable padding */
  5: '1.25rem',
  /** 24px - Card padding, section spacing */
  6: '1.5rem',
  /** 32px - Large component spacing */
  8: '2rem',
  /** 40px - Section gaps */
  10: '2.5rem',
  /** 48px - Major section spacing */
  12: '3rem',
  /** 64px - Large layout spacing */
  16: '4rem',
  /** 80px - Hero section spacing */
  20: '5rem',
  /** 96px - Major page sections */
  24: '6rem',
};
