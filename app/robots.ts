import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-config';

// Netlify sets CONTEXT at build time; only the production deploy is indexable,
// so branch previews never compete with the live site in search.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.CONTEXT === 'production';
  return isProduction
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
