// Per-product merchandising content that isn't commerce data. Prices,
// availability and sale prices always come from Shopify.
//
// Reviews are real reviews copied from the matching Etsy listing (all 5 stars
// unless noted). Keep them verbatim and keep the Etsy attribution visible.

export type Review = {
  name: string;
  date: string; // ISO date
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  response?: string; // reply from Passion Flow Studio
};

export type ReviewSummary = {
  source: 'Etsy';
  sourceUrl: string;
  average: number;
  count: number;
  itemQuality?: number;
  customerService?: number;
  recommendPercent?: number;
  highlights?: string[];
  reviews: Review[];
};

export type ProductContent = {
  badge?: string;
  reviews?: ReviewSummary;
};

const coupleMatchbookReviews: ReviewSummary = {
  source: 'Etsy',
  sourceUrl: 'https://www.etsy.com/listing/4383924058/custom-matchbook-art-bundle-editable',
  average: 5.0,
  count: 15,
  itemQuality: 5.0,
  customerService: 5.0,
  recommendPercent: 100,
  highlights: ['Love it', 'Easy to use', 'Perfect gift'],
  reviews: [
    { name: 'Shamez', date: '2026-09-20', rating: 5, text: 'amazing present, great gift for my girlfriend!' },
    { name: 'Serena', date: '2026-05-28', rating: 5, text: 'Love it so much! My boyfriend was so in awe' },
    { name: 'Eliise', date: '2026-05-20', rating: 5, text: 'It was amazing my boyfriend loved the gift :)' },
    { name: 'Tracy', date: '2026-04-13', rating: 5, text: 'just as pictured and so easy to edit!!' },
    { name: 'Kaya', date: '2026-04-13', rating: 5, text: 'Very convenient and easy to use' },
    { name: 'Brittany', date: '2026-03-14', rating: 5, text: 'So cute! Made for my boyfriend for Valentine’s Day and he loved it' },
    { name: 'Ashton', date: '2026-03-03', rating: 5, text: 'Cute item! And very easy' },
    { name: 'Mayra', date: '2026-02-25', rating: 5, text: 'So cute and so user friendly!' },
    { name: 'Etsy buyer', date: '2026-02-10', rating: 5, text: 'Thank you, it was just what I needed. Perfect' },
    { name: 'vanessa', date: '2026-02-01', rating: 5, text: 'love it so much i recommend', response: 'thank you Vanessa!! we appreciate it:)' },
    { name: 'addyson', date: '2026-01-14', rating: 5, text: 'super cute and very easy to make' },
    { name: 'Etsy buyer', date: '2025-12-28', rating: 5, text: 'Good very good idea to do' },
    { name: 'Mia', date: '2025-12-28', rating: 5, text: 'Item matched description and very easy to use' },
    { name: 'Nathalia', date: '2025-12-28', rating: 5, text: 'Easy gift idea, easy to navigate' },
    { name: 'Shelby', date: '2025-12-01', rating: 5, text: 'I loved it so much' },
  ],
};

const content: Record<string, ProductContent> = {
  'couple-matchbook': { badge: 'Bestseller', reviews: coupleMatchbookReviews },
};

export const productContent = (slug: string): ProductContent => content[slug] ?? {};
