// Maps short, ad-friendly URLs (/products/<slug>) to Shopify product handles.
// Shopify stays the source of truth for price, availability and variants —
// nothing commercial is stored here.

export type CatalogEntry = {
  slug: string;
  handle: string;
  // Short display name for tiles and bundle breakdowns.
  name: string;
  // Local image used only while the Shopify product has no photo (e.g. draft).
  fallbackImage?: string;
  kind: 'product' | 'bundle';
  collections: ('couples' | 'best-friends' | 'birthdays')[];
  // For bundles: slugs of the products included.
  includes?: string[];
  // For products: the bundle to offer as the upgrade.
  bundle?: string;
};

export const catalog: CatalogEntry[] = [
  { slug: 'couple-matchbook', name: 'Matchbook Poster', handle: 'couple-matchbook-custom-printable-art-poster', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'playing-cards', name: 'Playing Card Poster', handle: 'custom-playing-cards-personalized-couple-gift', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couple-photo-book', name: 'Couple Photo Book', handle: 'couple-photo-book-custom-printable-memory-book', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couple-newspaper', name: 'Newspaper Print', handle: 'couple-newspaper-custom-printable-newspaper-print', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couples-gift-bundle', name: 'Couple Gift Bundle', handle: 'couple-gift-bundle-4-in-1-romantic-digital-gift-set', kind: 'bundle', collections: ['couples'], includes: ['couple-matchbook', 'playing-cards', 'couple-photo-book', 'couple-newspaper'] },
  { slug: 'bestie-matchbook', name: 'Bestie Matchbook Poster', handle: 'best-friend-matchbook-poster-custom-birthday-gift', kind: 'product', collections: ['best-friends', 'birthdays'], bundle: 'best-friend-birthday-bundle' },
  { slug: 'bestie-playing-cards', name: 'Playing Card Poster', handle: 'bestie-playing-cards-custom-photo-gift', kind: 'product', collections: ['best-friends', 'birthdays'], bundle: 'best-friend-birthday-bundle' },
  { slug: 'birthday-photo-book', name: 'Birthday Photo Book', handle: 'best-friend-photo-book-custom-birthday-keepsake', kind: 'product', collections: ['best-friends', 'birthdays'], bundle: 'best-friend-birthday-bundle' },
  { slug: 'bestie-newspaper', name: 'Newspaper Print', handle: 'bestie-newspaper-custom-birthday-gift', kind: 'product', collections: ['best-friends', 'birthdays'], bundle: 'best-friend-birthday-bundle' },
  { slug: 'best-friend-birthday-bundle', name: 'Best Friend Birthday Bundle', handle: 'best-friend-birthday-gift-bundle-4-in-1', kind: 'bundle', collections: ['best-friends', 'birthdays'], includes: ['bestie-matchbook', 'bestie-playing-cards', 'birthday-photo-book', 'bestie-newspaper'] },
];

export const findBySlug = (slug: string) => catalog.find(entry => entry.slug === slug);
export const findByHandle = (handle: string) => catalog.find(entry => entry.handle === handle);
export const slugForHandle = (handle: string) => findByHandle(handle)?.slug ?? handle;

// Passion Flow Studio All Access: yearly membership, sold as a Shopify
// subscription (selling plan). Configure the price in Shopify, not here.
export const allAccess = {
  handle: 'passion-flow-studio-all-access',
  path: '/all-access',
};
