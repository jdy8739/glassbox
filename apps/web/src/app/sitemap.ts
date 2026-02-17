import { MetadataRoute } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glassbox.space';
  const lastModified = new Date();

  // Base routes to be localized
  const routes = ['', '/portfolio/new', '/portfolios'];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add localized versions for each route
  SUPPORTED_LANGUAGES.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${lang}${route}`,
        lastModified,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  // Add root redirect path
  sitemapEntries.push({
    url: siteUrl,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.5,
  });

  return sitemapEntries;
}
