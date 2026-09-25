'use client';

import { ArrowRight, Check, Download, Pencil } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';

type Props = {
  item: PurchasableItem;
  available: boolean;
  priceLabel: string;
};

export function ProductPurchase({ item, available, priceLabel }: Props) {
  const { cart, addItem, buyNow, busy, pendingVariantId, error, isOpen, openCart, clearError } = useCart();
  const pending = pendingVariantId === item.variantId;
  // Digital files: one copy per order, so a gift already in the cart links to it.
  const inCart = Boolean(cart?.lines.some(line => line.merchandise.id === item.variantId));
  // Cart errors show in the drawer when it's open, otherwise here.
  const inlineError = !isOpen ? error : null;

  if (!available) {
    return (
      <div className="purchase">
        <p className="purchase-price">{priceLabel}</p>
        <p className="purchase-unavailable" role="status">This gift is currently unavailable. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="purchase">
      <p className="purchase-price">{priceLabel}</p>
      <div className="purchase-actions">
        {inCart ? (
          <button type="button" className="button-primary purchase-add" onClick={openCart}>
            <Check size={16} /> In your cart — view
          </button>
        ) : (
          <button type="button" className="button-primary purchase-add" onClick={() => { clearError(); addItem(item); }} disabled={busy} aria-busy={pending}>
            {pending ? 'Adding…' : 'Add to cart'} {!pending && <ArrowRight size={16} />}
          </button>
        )}
        <button type="button" className="purchase-buy" onClick={() => { clearError(); buyNow(item); }} disabled={busy}>Buy now</button>
      </div>
      {inlineError && <p className="purchase-error" role="alert">{inlineError}</p>}
      <ul className="purchase-assurance">
        <li><Download size={15} /> Instant digital download</li>
        <li><Pencil size={15} /> Personalize in Canva — no design skills needed</li>
      </ul>
    </div>
  );
}
