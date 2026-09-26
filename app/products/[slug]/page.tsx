import type { Metadata } from 'next';
import type { GalleryMedia, Product } from '@/lib/shopify/types';
import { notFound, permanentRedirect } from 'next/navigation';
import { AllAccessTeaser } from '@/components/allaccess/AllAccessTeaser';
import { BundleUpsell } from '@/components/product/BundleUpsell';
import { ProductDescription } from '@/components/product/ProductDescription';
import { ProductFaq } from '@/components/product/ProductFaq';
import { OfferGallery } from '@/components/product/OfferGallery';
import { OfferSelectionProvider } from '@/components/product/OfferSelection';
import { StickyBuyBar } from '@/components/product/StickyBuyBar';
import { ProductPurchase, type PurchaseOption } from '@/components/product/ProductPurchase';
import { ReviewHighlight } from '@/components/product/ReviewHighlight';
import { ProductReviews } from '@/components/product/ProductReviews';
import { SiteReviews } from '@/components/product/SiteReviews';
import { getSiteReviews } from '@/lib/judgeme';
import { Stars } from '@/components/product/Stars';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import { findByHandle, findBySlug, type CatalogEntry } from '@/lib/catalog';
import { formatMoney } from '@/lib/money';
import { productContent, visibleMedia } from '@/lib/product-content';
import { getProduct } from '@/lib/shopify/products';
import { brand, siteUrl } from '@/lib/site-config';

// Pages render on first request (not at build, so a Shopify hiccup can't fail
// a deploy), then cache; prices and availability refresh at most every 60s.
// If a refresh fails, the last good page keeps being served.
export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const entry = findBySlug(slug);
  if (!entry) return null;
  const product = await getProduct(entry.handle);
  return product ? { entry, product } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const { product, entry } = data;
  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description.slice(0, 160);
  const image = product.featuredImage?.url;
  return {
    // Shopify SEO titles often already end with the brand; don't append it twice.
    title: title.includes(brand.name) ? { absolute: title } : title,
    description,
    alternates: { canonical: `/products/${entry.slug}` },
    openGraph: { type: 'website', title, description, images: image ? [image] : undefined },
  };
}

// The bundle option shown next to a single product in the offer picker.
async function bundleOption(entry: CatalogEntry): Promise<{ option: PurchaseOption; media: GalleryMedia[]; title: string; badge?: string } | null> {
  const bundleEntry = entry.bundle ? findBySlug(entry.bundle) : undefined;
  if (!bundleEntry) return null;
  const bundle: Product | null = await getProduct(bundleEntry.handle);
  const variant = bundle?.variants.find(v => v.availableForSale);
  if (!bundle || !variant || !bundle.availableForSale) return null;
  const names = (bundleEntry.includes ?? []).map(slug => findBySlug(slug)?.name).filter((n): n is string => Boolean(n));
  return {
    option: {
      key: 'bundle',
      item: { productId: bundle.id, variantId: variant.id, handle: bundle.handle, title: bundle.title },
      label: `Complete ${bundleEntry.name}`,
      detail: `${names.length} gifts in 1, ready to wrap`,
      includes: names,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: bundle.featuredImage?.url,
    },
    media: visibleMedia(bundleEntry.slug, bundle.media),
    title: bundle.title,
    badge: productContent(bundleEntry.slug).badge,
  };
}

// Preview = everything before the "What's included" section (hook, promise,
// benefits); the rest sits behind "Learn more about this item".
function splitDescription(html: string) {
  const match = html.match(/<p>\s*<strong>\s*What(?:'|’|&#39;|&rsquo;)s included/i);
  if (!match || match.index === undefined) return { previewHtml: html, moreHtml: '' };
  return { previewHtml: html.slice(0, match.index), moreHtml: html.slice(match.index) };
}

// "Main title: Subtitle" renders as two lines, each kept on a single line.
function ProductTitle({ title }: { title: string }) {
  const split = title.indexOf(':');
  if (split === -1) return <h1 className="product-title">{title}</h1>;
  return (
    <h1 className="product-title is-split">
      <span>{title.slice(0, split + 1)}</span>
      <span>{title.slice(split + 1).trim()}</span>
    </h1>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // Shopify-style URLs (/products/<shopify-handle>, e.g. from the Online Store
  // redirect or old links) forward to the short URL.
  const byHandle = !findBySlug(slug) && findByHandle(slug);
  if (byHandle) permanentRedirect(`/products/${byHandle.slug}`);

  const data = await load(slug);
  if (!data) notFound();
  const { product, entry } = data;

  const variant = product.variants.find(v => v.availableForSale) ?? product.variants[0];
  if (!variant) notFound();

  const extra = productContent(entry.slug);
  const [upgrade, siteReviews] = await Promise.all([bundleOption(entry), getSiteReviews(product.handle)]);
  const reviews = extra.reviews;

  const item = {
    productId: product.id,
    variantId: variant.id,
    handle: product.handle,
    title: product.title,
  };
  const available = product.availableForSale && variant.availableForSale;
  const priceLabel = formatMoney(variant.price);
  const thumb = product.featuredImage?.url;
    const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images.map(image => image.url),
    brand: { '@type': 'Brand', name: brand.name },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${entry.slug}`,
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ProductViewTracker item={{ ...item, price: Number(variant.price.amount), currency: variant.price.currencyCode, quantity: 1 }} />
      <OfferSelectionProvider>
      <section className="product-hero">
        <div className="product-gallery-area">
          <OfferGallery
            sets={{
              single: { media: visibleMedia(entry.slug, product.media), title: product.title, badge: extra.badge },
              ...(upgrade ? { bundle: { media: upgrade.media, title: upgrade.title, badge: upgrade.badge } } : {}),
            }}
          />
        </div>
        <div className="product-summary">
          <span className="eyebrow">MEANINGFUL GIFTS MADE FROM YOUR MEMORIES</span>
          <ProductTitle title={product.title} />
          <a className="product-byline" href={reviews ? '#reviews' : '/'}>
            <span className="product-byline-shop">{brand.name}</span>
            {reviews && <><Stars rating={reviews.average} size={15} /><span className="product-byline-count">{reviews.scope === 'shop' ? `${reviews.average.toFixed(1)} shop rating` : `(${reviews.count})`}</span></>}
          </a>
          {extra.tags && <ul className="product-tags">{extra.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
          <ProductPurchase
            slug={entry.slug}
            available={available}
            options={[
              {
                key: 'single',
                item,
                label: entry.name,
                detail: extra.offerDetail ?? 'Instant digital download',
                price: variant.price,
                compareAtPrice: variant.compareAtPrice,
                image: thumb,
              },
              ...(upgrade ? [upgrade.option] : []),
            ]}
          />
          {reviews && extra.highlightReview !== undefined && reviews.reviews[extra.highlightReview] && (
            <ReviewHighlight review={reviews.reviews[extra.highlightReview]} />
          )}
          <ProductDescription slug={entry.slug} {...splitDescription(product.descriptionHtml)} />
        </div>
        {(siteReviews || reviews) && (
          <div className="product-reviews-area">
            {siteReviews && <SiteReviews data={siteReviews} slug={entry.slug} />}
            {reviews && <ProductReviews summary={reviews} />}
          </div>
        )}
      </section>
      </OfferSelectionProvider>

      <div className="product-sections">
        {entry.bundle && (
          <BundleUpsell bundleSlug={entry.bundle} current={{ slug: entry.slug, variantId: variant.id, price: variant.price }} />
        )}
        {entry.kind === 'bundle' && <BundleUpsell bundleSlug={entry.slug} />}
        {/* All Access after the product and bundle, then the FAQ. */}
        <AllAccessTeaser fromProduct={entry.slug} />
        {extra.faqs && <ProductFaq faqs={extra.faqs} />}
      </div>
      <StickyBuyBar item={item} priceLabel={priceLabel} image={thumb} available={available} bundleVariantId={upgrade?.option.item.variantId} />
    </main>
  );
}
