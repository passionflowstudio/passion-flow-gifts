// Normalized storefront commerce events. Components emit these; adapters map
// them to each destination. Purchase is intentionally absent: completed orders
// are reported by Shopify checkout (and the ad platforms' Shopify apps).

export type CommerceItem = {
  productId: string; // Shopify Product GID
  variantId: string; // Shopify ProductVariant GID
  handle: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
};

export type CommerceEvent =
  | { name: 'product_viewed'; item: CommerceItem }
  | { name: 'product_added_to_cart'; item: CommerceItem; cartToken: string; source: 'add_to_cart' | 'buy_now' | 'bundle_upgrade' | 'upsell' }
  | { name: 'product_removed_from_cart'; item: CommerceItem; cartToken: string }
  | { name: 'cart_viewed'; items: CommerceItem[]; value: number; currency: string; cartToken: string }
  | { name: 'checkout_started'; items: CommerceItem[]; value: number; currency: string; cartToken: string; source: 'cart' | 'buy_now' }
  // Funnel steps after the main product: bundle and All Access offers.
  | { name: 'upsell_viewed'; offer: UpsellOffer; fromProduct: string }
  | { name: 'upsell_clicked'; offer: UpsellOffer; fromProduct: string; action: 'add' | 'upgrade' | 'view' };

export type UpsellOffer = 'bundle' | 'all_access';

export type TrackedEvent = CommerceEvent & { eventId: string; at: string };

export type AnalyticsAdapter = { name: string; send: (event: TrackedEvent) => void };
