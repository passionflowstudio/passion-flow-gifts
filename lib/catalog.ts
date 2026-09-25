// Maps short, ad-friendly URLs (/products/<slug>) to Shopify product handles.
// Shopify stays the source of truth for price, availability and variants —
// nothing commercial is stored here.

export type CatalogEntry = {
  slug: string;
  handle: string;
  kind: 'product' | 'bundle';
  collections: ('couples' | 'best-friends' | 'birthdays')[];
  // For bundles: slugs of the products included.
  includes?: string[];
  // For products: the bundle to offer as the upgrade.
  bundle?: string;
};

export const catalog: CatalogEntry[] = [
  { slug: 'couple-matchbook', handle: 'couple-matchbook-custom-printable-art-poster', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'playing-cards', handle: 'custom-playing-cards-personalized-couple-gift', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couple-photo-book', handle: 'couple-photo-book-custom-printable-memory-book', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couple-newspaper', handle: 'couple-newspaper-custom-printable-newspaper-print', kind: 'product', collections: ['couples'], bundle: 'couples-gift-bundle' },
  { slug: 'couples-gift-bundle', handle: 'couple-gift-bundle-4-in-1-romantic-digital-gift-set', kind: 'bundle', collections: ['couples'], includes: ['couple-matchbook', 'playing-cards', 'couple-photo-book', 'couple-newspaper'] },
  { slug: 'bestie-matchbook', handle: 'best-friend-matchbook-poster-custom-birthday-gift', kind: 'product', collections: ['best-friends', 'birthdays'] },
  { slug: 'birthday-photo-book', handle: 'best-friend-photo-book-custom-birthday-keepsake', kind: 'product', collections: ['best-friends', 'birthdays'] },
];

export const findBySlug = (slug: string) => catalog.find(entry => entry.slug === slug);
export const findByHandle = (handle: string) => catalog.find(entry => entry.handle === handle);
export const slugForHandle = (handle: string) => findByHandle(handle)?.slug ?? handle;
