import type { Money } from '@/lib/shopify/types';

// All Access copy. Keep claims in line with what the membership library
// actually contains.
export const allAccessPerks = [
  'Every gift template in the Passion Flow library',
  'New designs added throughout your membership',
  'Couples, birthdays, best friends, anniversaries and holidays',
  'Editable in free Canva, with video tutorials',
];

export const perMonth = (price: Money) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currencyCode }).format(Number(price.amount) / 12);
