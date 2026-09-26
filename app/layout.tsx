import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { Analytics } from '@/components/site/Analytics';
import { RevealObserver } from '@/components/site/RevealObserver';
import { SaleBanner } from '@/components/site/SaleBanner';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { brand, siteUrl } from '@/lib/site-config';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const defaultTitle = `${brand.name} — ${brand.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${brand.name}` },
  description: brand.description,
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: defaultTitle,
    description: 'Personalized gifts for the moments you never want to forget.',
    images: ['/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: 'Personalized gifts for the moments you never want to forget.',
    images: ['/og.jpg'],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#faf5ef',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <SaleBanner />
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
