import type { NextConfig } from 'next';

// Default image formats (WebP). AVIF is intentionally off: the local encoder
// hangs on some source images at specific widths.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com' }],
  },
};

export default nextConfig;
