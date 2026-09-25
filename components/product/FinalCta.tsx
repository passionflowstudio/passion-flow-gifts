'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';

type Props = { item: PurchasableItem; headline: ReactNode; priceLabel: string; image?: string; available: boolean; bundleVariantId?: string };

// Closing call to action at the bottom of the product page.
export function FinalCta({ item, headline, priceLabel, image, available, bundleVariantId }: Props) {
  const { cart, addItem, openCart, busy, pendingVariantId } = useCart();
  // Also counts as in the cart when its bundle is.
  const inCart = Boolean(cart?.lines.some(line => line.merchandise.id === item.variantId || (bundleVariantId && line.merchandise.id === bundleVariantId)));
  const pending = pendingVariantId === item.variantId;
  if (!available) return null;

  return (
    <section className="final-cta" aria-label="Get this gift">
      {image && <span className="final-cta-image"><Image src={image} alt="" fill sizes="(max-width: 680px) 30vw, 180px" /></span>}
      <div className="final-cta-copy">
        <span className="eyebrow">READY IN ABOUT 5 MINUTES</span>
        <h2>{headline}</h2>
        <p className="final-cta-price">{priceLabel} · Instant digital download</p>
      </div>
      {inCart ? (
        <button type="button" className="button-primary final-cta-button" onClick={openCart}><Check size={16} /> In your cart — view</button>
      ) : (
        <button type="button" className="button-primary final-cta-button" onClick={() => addItem(item)} disabled={busy}>
          {pending ? 'Adding…' : 'Add to cart'} {!pending && <ArrowRight size={16} />}
        </button>
      )}
    </section>
  );
}
