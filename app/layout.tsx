import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-0YKJ2V5BFG';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://passionflowstudio.com'),
  title: 'PassionFlow Studio — Meaningful gifts made from your memories',
  description: 'Personalized digital gifts and invitations made from the photos, stories, and little moments you love.',
  openGraph: {
    title: 'PassionFlow Studio — Meaningful gifts made from your memories',
    description: 'Personalized gifts for the moments you never want to forget.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PassionFlow Studio — Meaningful gifts made from your memories',
    description: 'Personalized gifts for the moments you never want to forget.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
