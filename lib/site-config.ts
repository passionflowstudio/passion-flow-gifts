// Site-wide, non-commerce settings. Prices and product data never live here —
// those come from Shopify (Phase 1+).

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://passionflowstudio.com';

// GA4 measurement IDs are public by design; env overrides the current property.
export const ga4Id = process.env.NEXT_PUBLIC_GA4_ID ?? 'G-0YKJ2V5BFG';

export const brand = {
  name: 'Passion Flow Studio',
  tagline: 'Meaningful gifts made from your memories',
  description: 'Personalized digital gifts and invitations made from the photos, stories, and little moments you love.',
  email: 'passionflow.studio@gmail.com',
};

export const socialProof = {
  label: 'Loved by 2,800+ customers',
};

// Top marquee. Edit the text here; the countdown runs to local midnight.
// NOTE: the discount wording must match the prices shoppers actually see.
export const saleBanner = {
  enabled: true,
  parts: ['Digital Gift Sale', '60% Off'],
  countdownLabel: 'Sale ends in',
  trailing: ['Instant Download', 'Personalize in Canva'],
  ariaLabel: 'Digital gift sale, 60 percent off, sale ends tonight',
};

// Invitation websites are hidden until they're sold on this site (they
// only linked to Etsy). Set to true to bring back the homepage section and
// the nav link.
export const showInvites = false;

export const etsy = {
  shop: 'https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt',
  couplesSection: 'https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt&section_id=52763868',
  friendsSection: 'https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt&section_id=52763880',
  invites: 'https://www.etsy.com/shop/passionflowstudios?ref=shop-header-name&listing_id=4499460149&from_page=listing&section_id=58463936',
};

export const nav: { label: string; href: string }[] = [
  { label: 'For Couples', href: '/#couples' },
  { label: 'For Friends', href: '/#friends' },
  { label: 'Bundles', href: '/#bundles' },
  ...(showInvites ? [{ label: 'For Invites', href: '/#invites' }] : []),
  { label: 'About', href: '/#about' },
];

export const socials = [
  { label: '◎ Instagram', href: 'https://instagram.com/passionflow.studio' },
  { label: '@ Threads', href: 'https://www.threads.com/@passionflow.studio' },
  { label: '♪ TikTok', href: 'https://tiktok.com/@passionflow.studio' },
  { label: '◉ Pinterest', href: 'https://www.pinterest.com/passionflowstudios/' },
];
