'use client';

import { ArrowRight, Check, CirclePlay, Download, Pencil } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';
import { formatMoney } from '@/lib/money';
import type { Money } from '@/lib/shopify/types';

type Props = {
  item: PurchasableItem;
  available: boolean;
  price: Money;
  // From Shopify's "Compare-at price". A sale shows only when this is set and higher.
  compareAtPrice: Money | null;
};

const features = [
  { icon: Download, label: 'Instant Digital Download' },
  { icon: Pencil, label: 'Beginner-Friendly Canva Editing' },
  { icon: CirclePlay, label: 'Includes Step-by-Step Video Tutorial' },
];

function PriceBlock({ price, compareAtPrice }: { price: Money; compareAtPrice: Money | null }) {
  const now = Number(price.amount);
  const was = compareAtPrice ? Number(compareAtPrice.amount) : 0;
  const onSale = was > now;
  const percentOff = onSale ? Math.round((1 - now / was) * 100) : 0;

  if (!onSale) return <p className="purchase-price"><span className="price-now">{formatMoney(price)}</span></p>;
  return (
    <p className="purchase-price" aria-label={`Sale price ${formatMoney(price)}, was ${formatMoney(compareAtPrice!)}, ${percentOff}% off`}>
      <span className="price-now">Now {formatMoney(price)}</span>
      <s className="price-was">{formatMoney(compareAtPrice!)}</s>
      <span className="price-off">{percentOff}% off</span>
    </p>
  );
}

export function ProductPurchase({ item, available, price, compareAtPrice }: Props) {
  const { cart, addItem, buyNow, busy, pendingVariantId, error, isOpen, openCart, clearError } = useCart();
  const pending = pendingVariantId === item.variantId;
  // Digital files: one copy per order, so a gift already in the cart links to it.
  const inCart = Boolean(cart?.lines.some(line => line.merchandise.id === item.variantId));
  // Cart errors show in the drawer when it's open, otherwise here.
  const inlineError = !isOpen ? error : null;

  if (!available) {
    return (
      <div className="purchase">
        <PriceBlock price={price} compareAtPrice={null} />
        <p className="purchase-unavailable" role="status">This gift is currently unavailable. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="purchase">
      <PriceBlock price={price} compareAtPrice={compareAtPrice} />
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
        <button type="button" className="purchase-buy" onClick={() => { clearError(); buyNow(item); }} disabled={busy}><span>Buy it now</span></button>
      </div>
      {inlineError && <p className="purchase-error" role="alert">{inlineError}</p>}
      <ul className="purchase-features">
        {features.map(({ icon: Icon, label }) => (
          <li key={label}><span className="feature-icon" aria-hidden="true"><Icon /></span>{label}</li>
        ))}
      </ul>
    </div>
  );
}
