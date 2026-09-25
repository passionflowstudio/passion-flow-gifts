'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';
import { track } from '@/lib/analytics/track';

type Props = {
  fromSlug: string;
  fromVariantId: string;
  bundle: PurchasableItem;
  bundleSlug: string;
  upgradeLabel: string;
};

export function BundleUpsellActions({ fromSlug, fromVariantId, bundle, bundleSlug, upgradeLabel }: Props) {
  const { cart, addItem, upgradeToBundle, openCart, busy, pendingVariantId } = useCart();
  const hasBundle = Boolean(cart?.lines.some(line => line.merchandise.id === bundle.variantId));
  const hasSingle = Boolean(cart?.lines.some(line => line.merchandise.id === fromVariantId));
  const pending = pendingVariantId === bundle.variantId;

  if (hasBundle) {
    return (
      <div className="bundle-actions">
        <button type="button" className="button-primary bundle-cta" onClick={openCart}><Check size={16} /> Bundle in your cart — view</button>
      </div>
    );
  }

  const onClick = () => {
    // Already chose the single gift: swap it for the bundle instead of adding both.
    track({ name: 'upsell_clicked', offer: 'bundle', fromProduct: fromSlug, action: hasSingle ? 'upgrade' : 'add' });
    if (hasSingle) upgradeToBundle(fromVariantId, bundle);
    else addItem(bundle);
  };

  return (
    <div className="bundle-actions">
      <button type="button" className="button-primary bundle-cta" onClick={onClick} disabled={busy} aria-busy={pending}>
        {pending ? 'Updating…' : hasSingle ? upgradeLabel : 'Get the complete bundle'} {!pending && <ArrowRight size={16} />}
      </button>
      <Link
        className="bundle-link"
        href={`/products/${bundleSlug}`}
        onClick={() => track({ name: 'upsell_clicked', offer: 'bundle', fromProduct: fromSlug, action: 'view' })}
      >
        See everything in the bundle
      </Link>
    </div>
  );
}
