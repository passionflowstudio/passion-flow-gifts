'use client';

import Image from 'next/image';
import { ArrowRight, Check, CirclePlay, Download, Pencil } from 'lucide-react';
import { useCart, type PurchasableItem } from '@/components/cart/CartProvider';
import { track } from '@/lib/analytics/track';
import { formatMoney } from '@/lib/money';
import type { Money } from '@/lib/shopify/types';
import { useMidnightCountdown } from '@/hooks/useMidnightCountdown';
import { saleBanner } from '@/lib/site-config';
import { useOfferSelection } from './OfferSelection';

// One purchasable choice in the offer picker. Prices always come from Shopify.
export type PurchaseOption = {
  key: 'single' | 'bundle';
  item: PurchasableItem;
  label: string;
  detail: string;
  price: Money;
  // Shopify "Compare-at price". A sale/saving shows only when set and higher.
  compareAtPrice: Money | null;
  image?: string;
  includes?: string[];
};

type Props = {
  slug: string;
  options: PurchaseOption[]; // first option is the default selection
  available: boolean;
};

const features = [
  { icon: Download, label: 'Instant Digital Download' },
  { icon: Pencil, label: 'Edit with Canva Free' },
  { icon: CirclePlay, label: 'Includes Video Tutorial' },
];

const saleInfo = (price: Money, compareAtPrice: Money | null) => {
  const now = Number(price.amount);
  const was = compareAtPrice ? Number(compareAtPrice.amount) : 0;
  if (was <= now) return null;
  return {
    percentOff: Math.round((1 - now / was) * 100),
    saved: { amount: (was - now).toFixed(2), currencyCode: price.currencyCode } as Money,
  };
};

function PriceBlock({ price, compareAtPrice }: { price: Money; compareAtPrice: Money | null }) {
  const sale = saleInfo(price, compareAtPrice);
  const countdown = useMidnightCountdown();
  if (!sale) return <p className="purchase-price"><span className="price-now">{formatMoney(price)}</span></p>;
  return (
    <div className="purchase-price-block">
      <p className="purchase-price" aria-label={`Sale price ${formatMoney(price)}, was ${formatMoney(compareAtPrice!)}, ${sale.percentOff}% off`}>
        <span className="price-now">Now {formatMoney(price)}</span>
        <s className="price-was">{formatMoney(compareAtPrice!)}</s>
      </p>
      <p className="price-sale-line">
        <span>{sale.percentOff}% off</span>
        {saleBanner.enabled && <><i aria-hidden="true" /><span>Sale ends in <strong>{countdown}</strong></span></>}
      </p>
    </div>
  );
}

function OfferPicker({ options, selected, onSelect }: { options: PurchaseOption[]; selected: string; onSelect: (key: PurchaseOption['key']) => void }) {
  return (
    <div className="offer-picker" role="radiogroup" aria-label="Choose your gift">
      {options.map(option => {
        const sale = saleInfo(option.price, option.compareAtPrice);
        const isBundle = option.key === 'bundle';
        const isSelected = option.key === selected;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`offer-card ${isSelected ? 'is-selected' : ''} ${isBundle ? 'is-bundle' : ''}`}
            onClick={() => onSelect(option.key)}
          >
            {isBundle && sale && <span className="offer-flag">Best value · Save {formatMoney(sale.saved)}</span>}
            <span className="offer-radio" aria-hidden="true" />
            {option.image && <span className="offer-image"><Image src={option.image} alt="" fill sizes="64px" /></span>}
            <span className="offer-text">
              <span className="offer-label">{option.label}</span>
              <span className="offer-detail">{option.detail}</span>
              {option.includes && <span className="offer-includes">{option.includes.join('\u00a0· ')}</span>}
            </span>
            <span className="offer-price">
              <strong>{formatMoney(option.price)}</strong>
              {sale && <s>{formatMoney(option.compareAtPrice!)}</s>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ProductPurchase({ slug, options, available }: Props) {
  const { cart, addItem, buyNow, upgradeToBundle, busy, pendingVariantId, error, isOpen, openCart, clearError } = useCart();
  const { selected: selectedKey, setSelected: setSelectedKey } = useOfferSelection(options[0].key);
  const selected = options.find(o => o.key === selectedKey) ?? options[0];
  const single = options.find(o => o.key === 'single');
  const bundle = options.find(o => o.key === 'bundle');

  const inCart = (option?: PurchaseOption) => Boolean(option && cart?.lines.some(line => line.merchandise.id === option.item.variantId));
  const bundleInCart = inCart(bundle);
  const pending = pendingVariantId === selected.item.variantId;
  // Cart errors show in the drawer when it's open, otherwise here.
  const inlineError = !isOpen ? error : null;

  const select = (key: PurchaseOption['key']) => {
    setSelectedKey(key);
    if (key === 'bundle') track({ name: 'upsell_clicked', offer: 'bundle', fromProduct: slug, action: 'select' });
  };

  const add = () => {
    clearError();
    // Choosing the bundle after adding the single gift swaps it instead of adding both.
    if (selected.key === 'bundle' && single && inCart(single)) {
      track({ name: 'upsell_clicked', offer: 'bundle', fromProduct: slug, action: 'upgrade' });
      upgradeToBundle(single.item.variantId, selected.item);
      return;
    }
    if (selected.key === 'bundle') track({ name: 'upsell_clicked', offer: 'bundle', fromProduct: slug, action: 'add' });
    addItem(selected.item);
  };

  if (!available) {
    return (
      <div className="purchase">
        <PriceBlock price={options[0].price} compareAtPrice={null} />
        <p className="purchase-unavailable" role="status">This gift is currently unavailable. Please check back soon.</p>
      </div>
    );
  }

  // The single gift is already part of a bundle in the cart.
  const coveredByBundle = selected.key === 'single' && bundleInCart;
  const selectedInCart = inCart(selected);

  return (
    <div className="purchase">
      <PriceBlock price={selected.price} compareAtPrice={selected.compareAtPrice} />
      {options.length > 1 && <OfferPicker options={options} selected={selected.key} onSelect={select} />}
      <div className="purchase-actions">
        {selectedInCart || coveredByBundle ? (
          <button type="button" className="button-primary purchase-add" onClick={openCart}>
            <Check size={16} /> {coveredByBundle ? 'Included in your bundle — view cart' : 'In your cart — view'}
          </button>
        ) : (
          <button type="button" className="button-primary purchase-add" onClick={add} disabled={busy} aria-busy={pending}>
            {pending ? 'Adding…' : <>Add to cart · {formatMoney(selected.price)}</>} {!pending && <ArrowRight size={16} />}
          </button>
        )}
        {!coveredByBundle && (
          <button type="button" className="purchase-buy" onClick={() => { clearError(); buyNow(selected.item); }} disabled={busy}><span>Buy it now</span></button>
        )}
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
