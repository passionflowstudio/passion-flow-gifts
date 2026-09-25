'use client';

import { ArrowRight } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';

// Membership goes straight to Shopify checkout (its own cart), where the
// subscription terms are confirmed and billing is handled by Shopify.
export function AllAccessJoin({ item, renewalNote }: { item: PurchasableItem; renewalNote: string }) {
  const { buyNow, busy, pendingVariantId, error } = useCart();
  const pending = pendingVariantId === item.variantId;
  return (
    <div className="aa-join">
      <button type="button" className="button-primary aa-join-button" onClick={() => buyNow(item)} disabled={busy} aria-busy={pending}>
        {pending ? 'Opening secure checkout…' : 'Join All Access'} {!pending && <ArrowRight size={16} />}
      </button>
      <p className="aa-renewal">{renewalNote}</p>
      {error && <p className="purchase-error" role="alert">{error}</p>}
    </div>
  );
}
