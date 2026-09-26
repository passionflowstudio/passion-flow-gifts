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
  // 'item' = this listing's own rating; 'shop' = the Etsy shop-wide rating,
  // always labeled as such (used when the listing has few written reviews).
  scope?: 'item' | 'shop';
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

// Shows the shop-wide Etsy rating (4.9 from 86 reviews), clearly labeled, with
// selected written reviews. The listing's own average is 4.1 — never show a
// made-up item rating.
const shopRating = { scope: 'shop' as const, average: 4.9, count: 86 };

const playingCardsReviews: ReviewSummary = {
  source: 'Etsy',
  sourceUrl: 'https://www.etsy.com/listing/4382477069/custom-playing-cards-bundle-giftful-for',
  note: 'Selected reviews',
  ...shopRating,
  reviews: [
    { name: 'Avery', date: '2026-07-22', rating: 5, text: 'Absolutely amazing. Customized it with my own pictures and letters on the cards and it was the perfect gift.', response: 'thank you! we are glad your gift turned out amazing:)' },
    { name: 'Walter', date: '2026-02-17', rating: 5, text: 'Great template and easy to use!' },
    { name: 'Leah', date: '2026-02-12', rating: 5, text: 'Wow I’m honestly blown away by how beautiful this turned out! Definitely the best custom playing cards I’ve found so far. 🥹' },
    { name: 'Julia', date: '2026-02-02', rating: 5, text: 'awesome, aesthetic, creative freedom at large', response: 'thank you Julia:) I’m glad our designs have given you creative freedom! we hope your poster turned out beautiful🤍' },
    { name: 'benjamin', date: '2026-01-30', rating: 5, text: 'great work good quality product' },
    { name: 'Jessica', date: '2026-01-19', rating: 5, text: 'Great and easy to use :) instructions were very helpful to follow - I can’t wait to get it printed and framed !' },
    { name: 'Tiffany', date: '2025-12-16', rating: 5, text: 'Great product. Would buy again', response: 'thanks Tiffany! we hope your frame turns out beautiful:)' },
    { name: 'Jordan', date: '2025-11-18', rating: 5, text: 'Good product and was really cute' },
  ],
};

// Etsy listing stats: 4.9 average, 17 reviews. Shown as selected reviews
// (one mildly critical review and one pending owner confirmation omitted).
const couplePhotoBookReviews: ReviewSummary = {
  source: 'Etsy',
  sourceUrl: 'https://www.etsy.com/listing/4348775091/couple-photo-book-o-custom-gifts',
  note: 'Selected reviews',
  average: 4.9,
  count: 17,
  itemQuality: 4.9,
  customerService: 5.0,
  recommendPercent: 100,
  reviews: [
    { name: 'Kungkea', date: '2025-11-16', rating: 5, text: 'Surprised my bf with it and he cried looking through the book', response: 'aww we’re so glad🥹it makes us so happy. we hope your photo book turned out beautiful🩷' },
    { name: 'Zaara', date: '2026-06-02', rating: 5, text: 'amazing product and very easy to use' },
    { name: 'Ashleigh', date: '2026-05-15', rating: 5, text: 'I am very happy with my order. The seller is fantastic and delivers quality goods with no surprises - You get what you pay for! I could even say what I got was even better than I anticipated. Thanks!! Another day, another satisfied customer :)' },
    { name: 'Etsy buyer', date: '2026-04-08', rating: 5, text: 'As soon as I paid for it, I received it. The template was amazing. It made it so easy to just go ahead and make my boyfriend‘s gift. Thank you so much.' },
    { name: 'Jonathan', date: '2026-01-23', rating: 5, text: 'gf loved it alot - really easy to follow' },
    { name: 'Jessica', date: '2025-12-28', rating: 5, text: 'I love this product and it was great for a present' },
    { name: 'Hailey', date: '2025-12-19', rating: 5, text: 'my boyfriend loved this for our anniversary!!', response: 'I’m so glad your boyfriend loved it:) We hope your photo book turned out beautiful with your photos!' },
    { name: 'bangtanswcrld', date: '2025-12-12', rating: 5, text: 'amazing ♡ the book is so cute and well designed. super cheap considering how well its made!' },
    { name: 'catu', date: '2025-11-21', rating: 5, text: 'i found this on tiktok and its so cool' },
    { name: 'Kristina', date: '2025-11-09', rating: 5, text: 'This is literally the best' },
    { name: 'Elisa', date: '2025-10-18', rating: 5, text: 'It’s so cute, I love how you can pick and choose out of 52 diff designed pages.', response: 'thank you so muchhh! thank you for supporting our shop:)' },
    { name: 'Lily', date: '2025-10-02', rating: 5, text: 'Exactly as described, bought to use some of the slides and they’re gorgeous. Easy to download and create.' },
    { name: 'phobs', date: '2025-09-22', rating: 5, text: 'such a cute and fun template - super fun to fill out:)' },
    { name: 'HoopsHaven', date: '2025-09-06', rating: 5, text: 'so easy to use. very lovely' },
    { name: 'Nico', date: '2025-09-01', rating: 5, text: 'very cute and easy to customise' },
  ],
};

const coupleBundleReviews: ReviewSummary = {
  source: 'Etsy',
  sourceUrl: 'https://www.etsy.com/listing/4486111419/couple-gift-bundle-4-in-1-romantic-gift',
  note: 'Selected reviews of the gifts in this bundle',
  ...shopRating,
  reviews: [
    { name: 'Sydney', date: '2026-06-08', rating: 5, text: 'great quick template for what I needed', product: 'Couple Gift Bundle' },
    ...coupleMatchbookReviews.reviews.map(review => ({ ...review, product: 'Matchbook Poster' })),
    ...playingCardsReviews.reviews.map(review => ({ ...review, product: 'Playing Card Poster' })),
    ...couplePhotoBookReviews.reviews.map(review => ({ ...review, product: 'Couple Photo Book' })),
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
  'playing-cards': {
    badge: 'Bestseller',
    tags: ['Ready in 5 min', 'No design skills', 'Print any size'],
    offerDetail: '6 designs + a bonus design',
    highlightReview: 0,
    reviews: playingCardsReviews,
    faqs: [
      { q: 'What’s included?', a: '6 playing card poster designs (Lucky Me, Lucky in Love, You Light Up the Room, How Lucky Are We?, I Love You More and a custom message card), a bonus My Favorite Person design, your editable Canva link, a video tutorial and 5 print sizes from 8×10 to 20×30.' },
      { q: 'Can I add our initials?', a: 'Yes. The king and queen cards are made for your initials, and you can change every word on the poster in Canva.' },
      ...templateFaqs,
    ],
  },
  'couple-photo-book': {
    badge: 'Bestseller',
    tags: ['50+ pages', 'No design skills', 'Print or share'],
    offerDetail: '50+ ready-made page designs',
    highlightReview: 0,
    reviews: couplePhotoBookReviews,
    faqs: [
      { q: 'What’s included?', a: 'One editable couple photo book template with 50+ page designs (where we first met, our first date, a letter for you, our playlist, texts that made me smile, our bucket list, a travel map and more), your Canva link, a video tutorial and square sizes: 6×6, 8×8 and 12×12.' },
      { q: 'Can I print it as a real book?', a: 'Yes. Order it as a printed photo book through Canva Print, or download a PDF and take it to any local print shop. You can also share it digitally.' },
      { q: 'Do I have to use every page?', a: 'No. Pick your favorite pages, reorder them and skip the rest. It’s your story, your way.' },
      { q: 'How long does it take to make?', a: 'It depends on how many pages you fill. Every page is already designed, so there’s no layout work, just your photos and words.' },
      ...templateFaqs.filter(faq => faq.q !== 'How long does it take to make?'),
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
