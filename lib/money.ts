import type { Money } from './shopify/types';

export function formatMoney({ amount, currencyCode }: Money) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount));
}
