// Browser-side Shopify cart operations. Every function returns the cart exactly
// as Shopify confirmed it, or throws CartError — callers must never assume
// success without a returned cart.
import { storefrontFetch } from './client';
import { CART_FRAGMENT } from './fragments';
import type { Cart, CartAttribute, CartLine, CartLineInput, CartWarning, UserError } from './types';

export class CartError extends Error {
  constructor(message: string, readonly code: 'not_found' | 'rejected' | 'unavailable' | 'network') {
    super(message);
    this.name = 'CartError';
  }
}

type RawCart = Omit<Cart, 'lines'> & { lines: { nodes: CartLine[] } };
type Payload = { cart: RawCart | null; userErrors: UserError[]; warnings?: CartWarning[] };

const normalize = (raw: RawCart): Cart => ({ ...raw, lines: raw.lines.nodes });

async function mutate(name: string, query: string, variables: Record<string, unknown>): Promise<{ cart: Cart; warnings: CartWarning[] }> {
  let data: Record<string, Payload>;
  try {
    data = await storefrontFetch<Record<string, Payload>>(`${CART_FRAGMENT} ${query}`, { variables });
  } catch (error) {
    throw new CartError(error instanceof Error ? error.message : 'Could not reach the store.', 'network');
  }
  const payload = data[name];
  const errors = payload?.userErrors ?? [];
  if (errors.length) {
    // Classify by the field Shopify flags, not the wording: a missing cart is
    // reported on `cartId` (and Shopify may still return an unrelated new cart,
    // which we ignore); unavailable products are reported on `merchandiseId`.
    const onField = (name: string) => errors.some(e => e.field?.includes(name));
    if (onField('cartId')) throw new CartError('Your cart expired.', 'not_found');
    if (onField('merchandiseId')) throw new CartError('This item is no longer available.', 'unavailable');
    throw new CartError(errors.map(e => e.message).join(' '), 'rejected');
  }
  if (!payload?.cart) throw new CartError('The store did not confirm your cart. Please try again.', 'not_found');
  return { cart: normalize(payload.cart), warnings: payload.warnings ?? [] };
}

export async function fetchCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await storefrontFetch<{ cart: RawCart | null }>(`${CART_FRAGMENT} query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }`, { variables: { cartId } });
    return data.cart ? normalize(data.cart) : null;
  } catch (error) {
    throw new CartError(error instanceof Error ? error.message : 'Could not load your cart.', 'network');
  }
}

export function createCart(lines: CartLineInput[], attributes: CartAttribute[]) {
  return mutate('cartCreate', `mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) { cart { ...CartFields } userErrors { field message code } warnings { code message target } }
  }`, { input: { lines, attributes } });
}

export function addLines(cartId: string, lines: CartLineInput[]) {
  return mutate('cartLinesAdd', `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message code } warnings { code message target } }
  }`, { cartId, lines });
}

// Can also swap a line's product in place (merchandiseId), e.g. single product → bundle.
export function updateLines(cartId: string, lines: { id: string; quantity: number; merchandiseId?: string }[]) {
  return mutate('cartLinesUpdate', `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message code } warnings { code message target } }
  }`, { cartId, lines });
}

export function removeLines(cartId: string, lineIds: string[]) {
  return mutate('cartLinesRemove', `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message code } warnings { code message target } }
  }`, { cartId, lineIds });
}

export function updateAttributes(cartId: string, attributes: CartAttribute[]) {
  return mutate('cartAttributesUpdate', `mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ...CartFields } userErrors { field message code } }
  }`, { cartId, attributes });
}

// The cart ID's `?key=` part is a secret; strip it before it goes anywhere
// outside Shopify calls (analytics, logs).
export const publicCartToken = (cartId: string) => cartId.split('?')[0].split('/').pop() ?? '';
