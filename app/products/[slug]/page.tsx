import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import { findBySlug } from '@/lib/catalog';
import { formatMoney } from '@/lib/money';
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

export default async function ProductPage({ params }: Props) {
  const data = await load((await params).slug);
  if (!data) notFound();
  const { product, entry } = data;

  const variant = product.variants.find(v => v.availableForSale) ?? product.variants[0];
  if (!variant) notFound();

  const item = {
    productId: product.id,
    variantId: variant.id,
    handle: product.handle,
    title: product.title,
  };
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
      <section className="product-hero">
        <ProductGallery media={product.media} title={product.title} />
        <div className="product-summary">
          <span className="eyebrow">{entry.kind === 'bundle' ? 'GIFT BUNDLE' : 'PERSONALIZED DIGITAL GIFT'}</span>
          <h1>{product.title}</h1>
          <ProductPurchase item={item} available={product.availableForSale && variant.availableForSale} priceLabel={formatMoney(variant.price)} />
          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        </div>
      </section>
    </main>
  );
}
