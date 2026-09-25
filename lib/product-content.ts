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
  product?: string; // set when a review is about a specific gift (e.g. on bundle pages)
};

export type ReviewSummary = {
  source: 'Etsy';
  // Shown under the heading, e.g. to explain reviews are for gifts in a bundle.
  note?: string;
  sourceUrl: string;
  average: number;
  count: number;
  itemQuality?: number;
  customerService?: number;
  recommendPercent?: number;
  highlights?: string[];
  reviews: Review[];
};

export type Faq = { q: string; a: string };

export type ProductContent = {
  badge?: string;
  // Short benefit tags shown under the title.
  tags?: string[];
  // Second line on this product's card in the offer picker.
  offerDetail?: string;
  // Shopify media hidden on the site (matched against the image URL), e.g.
  // Etsy graphics that show Etsy prices. The media stays in Shopify.
  hiddenMedia?: string[];
  // Index into reviews.reviews of the quote shown under the buy buttons.
  highlightReview?: number;
  reviews?: ReviewSummary;
  faqs?: Faq[];
};

// Shared answers for every Canva template product.
const templateFaqs: Faq[] = [
  { q: 'Do I need Canva Pro?', a: 'No. Everything works with a free Canva account. You just need an internet browser or the Canva app.' },
  { q: 'How do I get my template?', a: 'Right after checkout you’ll get a download link on your order confirmation page and by email. It opens a PDF with your Canva template link and the video tutorial.' },
  { q: 'How long does it take to make?', a: 'Most people finish in about 5 minutes. The design is already done, so you just drop in your photos and change the names, dates and words.' },
  { q: 'How do I print it?', a: 'Download your finished design as a PDF or PNG and print at home, order through Canva Print, or take it to any local print shop.' },
  { q: 'Will anything be shipped to me?', a: 'No. This is a digital download, so nothing physical ships. Printing, frames and flowers aren’t included.' },
  { q: 'What if I need help?', a: 'Email us at passionflow.studio@gmail.com and we’ll help you get it just right.' },
];

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

const coupleBundleReviews: ReviewSummary = {
  source: 'Etsy',
  sourceUrl: 'https://www.etsy.com/listing/4486111419/couple-gift-bundle-4-in-1-romantic-gift',
  note: 'Includes reviews of the gifts in this bundle',
  average: 5.0,
  count: 16,
  reviews: [
    { name: 'Sydney', date: '2026-06-08', rating: 5, text: 'great quick template for what I needed', product: 'Couple Gift Bundle' },
    ...coupleMatchbookReviews.reviews.map(review => ({ ...review, product: 'Matchbook Poster' })),
  ],
};

const content: Record<string, ProductContent> = {
  'couple-matchbook': {
    badge: 'Bestseller',
    tags: ['Ready in 5 min', 'No design skills', 'Print any size'],
    offerDetail: '3 designs + bonus anniversary edition',
    highlightReview: 1,
    reviews: coupleMatchbookReviews,
    faqs: [
      { q: 'What’s included?', a: '3 matchbook poster designs (blush pink, red “The Perfect Match” and blue “How Lucky Are We”), a bonus Anniversary Edition design, your editable Canva link, a video tutorial and 5 print sizes from 8×10 to 20×30.' },
      ...templateFaqs,
    ],
  },
  'couples-gift-bundle': {
    badge: 'Best value',
    // Shows the Etsy price ("$18.99 / Save Over 50%").
    hiddenMedia: ['7944361983'],
    tags: ['4 gifts in 1', 'Ready in minutes', 'No design skills'],
    highlightReview: 0,
    reviews: coupleBundleReviews,
    faqs: [
      { q: 'What’s in the bundle?', a: 'Four gifts: a custom matchbook poster, a playing card poster, a 50+ page couple photo book and a “The Couple Post” newspaper bouquet wrap. You get an editable Canva link for each one.' },
      ...templateFaqs,
    ],
  },
};

export const productContent = (slug: string): ProductContent => content[slug] ?? {};

// Drop media the site shouldn't show (see ProductContent.hiddenMedia).
export function visibleMedia<T extends { kind: string; image?: { url: string }; poster?: { url: string } | null }>(slug: string, media: T[]): T[] {
  const hidden = productContent(slug).hiddenMedia ?? [];
  if (!hidden.length) return media;
  return media.filter(item => {
    const url = item.kind === 'image' ? item.image?.url : item.poster?.url;
    return !hidden.some(id => url?.includes(id));
  });
}
