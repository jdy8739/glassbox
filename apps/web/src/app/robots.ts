import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glassbox.space';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
