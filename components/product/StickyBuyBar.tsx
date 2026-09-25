'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';

type Props = { item: PurchasableItem; priceLabel: string; image?: string; available: boolean };

// Phone-only bar that appears once the main purchase buttons scroll out of
// view, so Add to cart is always one tap away.
export function StickyBuyBar({ item, priceLabel, image, available }: Props) {
  const { cart, addItem, openCart, busy, pendingVariantId } = useCart();
  const [visible, setVisible] = useState(false);
  const inCart = Boolean(cart?.lines.some(line => line.merchandise.id === item.variantId));
  const pending = pendingVariantId === item.variantId;

  useEffect(() => {
    const target = document.querySelector('.purchase-actions');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Show only after the buttons have scrolled up past the viewport.
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!available) return null;

  return (
    <div className={`sticky-buy ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      {image && <span className="sticky-buy-thumb"><Image src={image} alt="" fill sizes="44px" /></span>}
      <span className="sticky-buy-price">{priceLabel}</span>
      {inCart ? (
        <button type="button" className="button-primary sticky-buy-button" onClick={openCart} tabIndex={visible ? 0 : -1}><Check size={15} /> In cart</button>
      ) : (
        <button type="button" className="button-primary sticky-buy-button" onClick={() => addItem(item)} disabled={busy} tabIndex={visible ? 0 : -1}>
          {pending ? 'Adding…' : 'Add to cart'} {!pending && <ArrowRight size={15} />}
        </button>
      )}
    </div>
  );
}
