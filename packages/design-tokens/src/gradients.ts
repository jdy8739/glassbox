/**
 * Gradient System - Background gradients for pages and sections
 *
 * Philosophy: Clean, glassmorphism-friendly gradients
 * Creates depth and visual interest without overpowering glassmorphic content
 *
 * Usage:
 * - page: Main page backgrounds (fixed attachment)
 * - hero: Hero sections
 * - section: Section backgrounds
 * - overlay: Subtle overlay effects
 *
 * @example
 * ```tsx
 * <body style={{ background: gradients.page, backgroundAttachment: 'fixed' }}>
 *   Page content with fixed gradient background
 * </body>
 * ```
 */
export const gradients = {
  /** Page background - light slate gray gradient (light mode) */
  page: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
  /** Hero section - vertical light slate gradient */
  hero: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  /** Section background - subtle gradient */
  section: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  /** Overlay - subtle slate tint */
  overlay: 'linear-gradient(180deg, rgba(71, 85, 105, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)',
};
