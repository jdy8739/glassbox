/**
 * Parses Accept-Language header and returns the best matching supported language
 *
 * @param acceptLanguageHeader - The Accept-Language header value
 * @param supportedLanguages - Array of supported language codes (e.g., ['en', 'ko'])
 * @param defaultLanguage - Fallback language if no match found
 * @returns Best matching language code
 *
 * @example
 * detectLanguage('ko-KR,ko;q=0.9,en;q=0.8', ['en', 'ko'], 'en') // Returns 'ko'
 * detectLanguage('en-US,en;q=0.9', ['en', 'ko'], 'en') // Returns 'en'
 * detectLanguage('fr-FR,fr;q=0.9', ['en', 'ko'], 'en') // Returns 'en' (fallback)
 */
export function detectLanguage(
  acceptLanguageHeader: string,
  supportedLanguages: string[] = ['en', 'ko'],
  defaultLanguage: string = 'en'
): string {
  if (!acceptLanguageHeader) {
    return defaultLanguage;
  }

  // Parse Accept-Language header into array of { lang, quality }
  const languages = acceptLanguageHeader
    .split(',')
    .map((lang) => {
      const parts = lang.trim().split(';');
      const code = parts[0].toLowerCase();
      const qMatch = parts[1]?.match(/q=([0-9.]+)/);
      const quality = qMatch ? parseFloat(qMatch[1]) : 1.0;

      return { code, quality };
    })
    // Sort by quality (highest first)
    .sort((a, b) => b.quality - a.quality);

  // Find first language that matches our supported languages
  for (const { code } of languages) {
    // Extract base language code (e.g., 'ko' from 'ko-KR')
    const baseCode = code.split('-')[0];

    // Check if base code matches any supported language
    if (supportedLanguages.includes(baseCode)) {
      return baseCode;
    }

    // Also check exact match for region-specific codes
    if (supportedLanguages.includes(code)) {
      return code;
    }
  }

  // No match found, return default
  return defaultLanguage;
}
