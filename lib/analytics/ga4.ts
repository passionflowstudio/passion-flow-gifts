import type { AnalyticsAdapter, CommerceItem, TrackedEvent } from './events';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const toGaItem = (item: CommerceItem) => ({
  item_id: item.variantId,
  item_name: item.title,
  item_group_id: item.productId,
  price: item.price,
  quantity: item.quantity,
});

// GA4 recommended ecommerce events.
export const ga4Adapter: AnalyticsAdapter = {
  name: 'ga4',
  send(event: TrackedEvent) {
    const gtag = window.gtag;
    if (!gtag) return;
    switch (event.name) {
      case 'product_viewed':
        return gtag('event', 'view_item', { currency: event.item.currency, value: event.item.price, items: [toGaItem(event.item)] });
      case 'product_added_to_cart':
        return gtag('event', 'add_to_cart', { currency: event.item.currency, value: event.item.price * event.item.quantity, items: [toGaItem(event.item)], method: event.source });
      case 'product_removed_from_cart':
        return gtag('event', 'remove_from_cart', { currency: event.item.currency, value: event.item.price * event.item.quantity, items: [toGaItem(event.item)] });
      case 'cart_viewed':
        return gtag('event', 'view_cart', { currency: event.currency, value: event.value, items: event.items.map(toGaItem) });
      case 'upsell_viewed':
        return gtag('event', 'upsell_viewed', { offer: event.offer, from_product: event.fromProduct });
      case 'upsell_clicked':
        return gtag('event', 'upsell_clicked', { offer: event.offer, from_product: event.fromProduct, action: event.action });
      case 'checkout_started':
        return gtag('event', 'begin_checkout', { currency: event.currency, value: event.value, items: event.items.map(toGaItem), method: event.source });
    }
  },
};
