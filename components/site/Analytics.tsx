import Script from 'next/script';
import { ga4Id } from '@/lib/site-config';

// GA4 only for now. Phase 1 adds a central commerce event layer; ad pixels
// (Meta / Pinterest / TikTok) plug into that layer in Phase 5.
export function Analytics() {
  if (!ga4Id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4Id}');`}
      </Script>
    </>
  );
}
