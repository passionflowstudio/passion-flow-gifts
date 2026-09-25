import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-config';

// Product and collection routes are added here as they ship (Phase 2+).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: 'weekly', priority: 1 }];
}
