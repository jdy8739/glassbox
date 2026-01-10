/**
 * Gradient System - Background gradients for pages and sections
 *
 * Philosophy: Subtle, nature-inspired gradients
 * Creates depth and visual interest without overpowering content
 *
 * Usage:
 * - page: Main page backgrounds (fixed attachment)
 * - hero: Hero sections
 * - section: Section backgrounds
 * - rain: Overlay effects
 *
 * @example
 * ```tsx
 * <body style={{ background: gradients.page, backgroundAttachment: 'fixed' }}>
 *   Page content with fixed gradient background
 * </body>
 * ```
 */
export const gradients = {
  /** Page background - sky to grass to sky */
  page: 'linear-gradient(135deg, #e5ecf4 0%, #d1f0dd 50%, #cbd8e9 100%)',
  /** Hero section - vertical sky to grass */
  hero: 'linear-gradient(180deg, #f4f7fb 0%, #f0f9f4 100%)',
  /** Section background - subtle warm gradient */
  section: 'linear-gradient(135deg, #fafbfc 0%, #f9f7f4 100%)',
  /** Rain overlay - subtle blue tint */
  rain: 'linear-gradient(180deg, rgba(123, 155, 196, 0.1) 0%, rgba(177, 188, 199, 0.05) 100%)',
};
