import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { findBySlug } from '@/lib/catalog';
import { formatMoney } from '@/lib/money';
import { getProduct } from '@/lib/shopify/products';
import type { Money, Product } from '@/lib/shopify/types';
import { BundleUpsellActions } from './BundleUpsellActions';
import { UpsellViewTracker } from './UpsellViewTracker';

const money = (amount: number, currencyCode: string): Money => ({ amount: amount.toFixed(2), currencyCode });
const firstVariant = (product: Product) => product.variants.find(v => v.availableForSale) ?? product.variants[0];

type Props = {
  bundleSlug: string;
  // The product page this appears on; omitted on the bundle's own page.
  current?: { slug: string; variantId: string; price: Money };
};

// "Make it the complete gift": the bundle's gifts side by side with live prices
// and real savings. On a product page it offers the add/upgrade; on the bundle
// page it's the "what's inside" breakdown.
export async function BundleUpsell({ bundleSlug, current }: Props) {
  const bundleEntry = findBySlug(bundleSlug);
  if (!bundleEntry?.includes) return null;

  const [bundle, ...parts] = await Promise.all([
    getProduct(bundleEntry.handle),
    ...bundleEntry.includes.map(slug => {
      const entry = findBySlug(slug);
      return entry ? getProduct(entry.handle).then(product => ({ slug, name: entry.name, product })) : Promise.resolve({ slug, name: slug, product: null });
    }),
  ]) as [Product | null, ...{ slug: string; name: string; product: Product | null }[]];

  const bundleVariant = bundle && firstVariant(bundle);
  if (!bundle || !bundleVariant || !bundle.availableForSale) return null;

  const currency = bundleVariant.price.currencyCode;
  const bundlePrice = Number(bundleVariant.price.amount);
  // Savings only when every gift is a live product we can price.
  const allPriced = parts.every(p => p.product && firstVariant(p.product));
  const separateTotal = allPriced ? parts.reduce((sum, p) => sum + Number(firstVariant(p.product!).price.amount), 0) : 0;
  const savings = separateTotal - bundlePrice;
  const showSavings = allPriced && savings > 0;
  const upgradeCost = current ? bundlePrice - Number(current.price.amount) : 0;

  return (
    <section className="bundle-upsell" aria-labelledby="bundle-upsell-title">
      {current && <UpsellViewTracker offer="bundle" fromProduct={current.slug} />}
      <div className="upsell-head">
        <span className="eyebrow">{current ? 'MAKE IT THE COMPLETE GIFT' : 'WHAT’S INSIDE'}</span>
        <h2 id="bundle-upsell-title">
          {current ? <>Give them the whole <em>romantic surprise.</em></> : <>Four gifts, <em>one love story.</em></>}
        </h2>
        <p>{current
          ? 'Add three more keepsakes made from the same memories: wall art, a book they can hold and a bouquet to hand them.'
          : 'Each gift is its own editable Canva template, ready in minutes with your photos.'}</p>
      </div>

      <ol className="bundle-items">
        {parts.map(({ slug, name, product }, index) => {
          const variant = product && firstVariant(product);
          const image = product?.featuredImage;
          const isCurrent = current?.slug === slug;
          const tile = (
            <>
              <span className="bundle-item-image">
                {image && <Image src={image.url} alt={image.altText ?? name} fill sizes="(max-width: 680px) 50vw, 22vw" />}
                <span className="bundle-item-number">{index + 1}</span>
                {isCurrent && <span className="bundle-item-flag">You’re viewing</span>}
              </span>
              <span className="bundle-item-name">{name}</span>
              <span className="bundle-item-price">{variant ? formatMoney(variant.price) : 'Included'}</span>
            </>
          );
          return (
            <li key={slug} className={`bundle-item ${isCurrent ? 'is-current' : ''}`}>
              {product && !isCurrent ? <Link href={`/products/${slug}`}>{tile}</Link> : <div>{tile}</div>}
            </li>
          );
        })}
      </ol>

      <div className="bundle-offer">
        <div className="bundle-offer-math">
          {showSavings && <p><span>Bought separately</span><s>{formatMoney(money(separateTotal, currency))}</s></p>}
          <p className="bundle-offer-price"><span>Bundle price</span><strong>{formatMoney(bundleVariant.price)}</strong></p>
          {showSavings && <p className="bundle-offer-save"><Check size={15} /> You save {formatMoney(money(savings, currency))} ({Math.round((savings / separateTotal) * 100)}%)</p>}
        </div>
        {current && (
          <BundleUpsellActions
            fromSlug={current.slug}
            fromVariantId={current.variantId}
            bundle={{ productId: bundle.id, variantId: bundleVariant.id, handle: bundle.handle, title: bundle.title }}
            bundleSlug={bundleSlug}
            upgradeLabel={upgradeCost > 0 ? `Upgrade for ${formatMoney(money(upgradeCost, currency))} more` : 'Upgrade to the bundle'}
          />
        )}
      </div>
    </section>
  );
}
