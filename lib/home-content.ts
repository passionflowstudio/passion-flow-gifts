// Homepage merchandising content. Phase 0 keeps today's Etsy destinations so
// the rebuilt page matches the live site; Phase 4 repoints these to on-site
// product pages backed by Shopify.

export type HomeCard = {
  name: string;
  image: string;
  description: string;
  url: string;
  badge?: string;
};

export const couples: HomeCard[] = [
  { name: 'Couple Matchbook Bundle', image: '/products/couple-matchbook-bundle-final.jpg', badge: '#1 BESTSELLER', description: 'All your little moments, told like a vintage matchbook.', url: 'https://www.etsy.com/listing/4383924058/custom-matchbook-art-editable-poster' },
  { name: 'Playing Cards Poster', image: '/products/image11.jpg', description: 'Your love story, designed like a deck you’ll treasure.', url: 'https://www.etsy.com/listing/4382477069/custom-playing-cards-bundle-giftful-for' },
  { name: 'Couple Photo Book', image: '/products/image12.jpg', description: 'Your favorite memories, beautifully captured in a keepsake book.', url: 'https://www.etsy.com/listing/4348775091/couple-photo-book-o-custom-gifts' },
];

export const friends: HomeCard[] = [
  { name: 'Bestie Matchbook Poster', image: '/products/image17.jpg', badge: '#1 BEST FRIEND PICK', description: 'Inside jokes, good times, and memories that stick.', url: 'https://www.etsy.com/listing/4435093798/bestfriend-matchbook-art-personable-bff' },
  { name: 'Birthday Photo Book', image: '/products/image16.jpg', badge: 'MOST LOVED', description: 'A heartfelt birthday gift they’ll keep forever.', url: 'https://www.etsy.com/listing/4355300090/bestfriend-photo-book-canva-photobook' },
  { name: 'Bestie Matchbook Bundle', image: '/products/bestie-matchbook-bundle.jpg', badge: 'NEW · 3 DESIGNS', description: 'Three custom matchbook designs for your best chapter yet.', url: 'https://www.etsy.com/listing/4565214970/matchbook-template-bundle-bestie' },
];

export const bundles = [
  { name: 'Couple Gift Bundle', image: '/bundles/couple-bundle.jpg', alt: 'Couple gift basket with four personalized gifts', count: '4 PERSONALIZED GIFTS', url: 'https://www.etsy.com/listing/4486111419/couple-gift-bundle-4-in-1-romantic-gift' },
  { name: 'Best Friend Birthday Bundle', image: '/bundles/bestfriend-bundle.jpg', alt: 'Best-friend birthday gift basket with four personalized gifts', count: '4 PERSONALIZED GIFTS', url: 'https://www.etsy.com/listing/4474049269/birthday-gift-bundle-for-best-friend' },
];

export const invites = [
  { name: 'Floral Birthday Invite', image: '/invites/floral-birthday.png', url: 'https://www.etsy.com/listing/4499460149/floral-girle-birthday-invitation-website' },
  { name: 'Sage Green Wedding Invite', image: '/invites/sage-green-wedding.png', url: 'https://www.etsy.com/listing/4511373248/floral-wedding-invite-website-sagee' },
  { name: 'Pink Floral Wedding Invite', image: '/invites/floral-wedding.png', url: 'https://www.etsy.com/listing/4506309029/floral-wedding-invite-website-goldful' },
];

export const heroGrid: ({ src: string; alt: string } | 'message')[] = [
  { src: '/hero-grid/couple-matchbook.jpg', alt: 'Personalized couple matchbook artwork in a gold frame' },
  { src: '/hero-grid/couple-bouquet.jpg', alt: 'Personalized couple newspaper wrapped around a rose bouquet' },
  { src: '/hero-grid/bestie-pink.jpg', alt: 'Pink personalized best-friend artwork in a wood frame' },
  { src: '/hero-grid/book-portrait.jpg', alt: 'Woman holding a personalized book of memories' },
  'message',
  { src: '/hero-grid/bestie-wine.jpg', alt: 'Wine-toned personalized best-friend artwork' },
  { src: '/hero-grid/birthday-book.jpg', alt: 'Personalized birthday book resting on a pink blanket' },
  { src: '/hero-grid/playing-cards.jpg', alt: 'Framed personalized couple playing-card artwork' },
  { src: '/hero-grid/book-closeup.jpg', alt: 'Smiling woman holding a personalized love-story book' },
];
