import 'server-only';
import { storefrontFetch } from './client';
import { PRODUCT_FRAGMENT } from './fragments';
import type { GalleryMedia, Money, Product, ProductVariant, ShopifyImage, VideoSource } from './types';

type RawMedia = {
  mediaContentType: string;
  alt: string | null;
  previewImage: ShopifyImage | null;
  image?: ShopifyImage;
  sources?: VideoSource[];
};

type RawProduct = Omit<Product, 'images' | 'variants' | 'media'> & {
  images: { nodes: ShopifyImage[] };
  media: { nodes: RawMedia[] };
  variants: { nodes: ProductVariant[] };
};

// Keep images and Shopify-hosted videos; skip media types we don't render (3D, external embeds).
function toGalleryMedia(node: RawMedia, title: string): GalleryMedia | null {
  const alt = node.alt || title;
  if (node.mediaContentType === 'IMAGE' && node.image) return { kind: 'image', alt, image: node.image };
  if (node.mediaContentType === 'VIDEO' && node.sources?.some(s => s.mimeType === 'video/mp4')) {
    // Progressive MP4s only, smallest first, so phones can pick a lighter file.
    const sources = node.sources.filter(s => s.mimeType === 'video/mp4').sort((a, b) => a.height - b.height);
    return { kind: 'video', alt, poster: node.previewImage, sources };
  }
  return null;
}

const normalize = (raw: RawProduct): Product => ({
  ...raw,
  images: raw.images.nodes,
  media: raw.media.nodes.map(node => toGalleryMedia(node, raw.title)).filter((m): m is GalleryMedia => m !== null),
  variants: raw.variants.nodes,
});

const privateToken = () => process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || undefined;

// Returns null when the product doesn't exist or isn't published to the
// storefront (e.g. still a draft) so callers can render a not-found state.
export async function getProduct(handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: RawProduct | null }>(
    `${PRODUCT_FRAGMENT} query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`,
    { variables: { handle }, privateToken: privateToken() },
  );
  return data.product ? normalize(data.product) : null;
}

export async function getProducts(handles: string[]): Promise<Record<string, Product | null>> {
  const entries = await Promise.all(handles.map(async handle => [handle, await getProduct(handle)] as const));
  return Object.fromEntries(entries);
}

export type SubscriptionPlan = { id: string; name: string; price: Money };

export type SubscriptionOffer = {
  product: Product;
  variantId: string;
  plans: SubscriptionPlan[];
};

type RawAllocations = {
  product: {
    variants: {
      nodes: {
        id: string;
        sellingPlanAllocations: { nodes: { sellingPlan: { id: string; name: string }; priceAdjustments: { price: Money }[] }[] };
      }[];
    };
  } | null;
};

// A subscription product (All Access) plus its purchasable plans. Returns null
// until the product is published AND has a selling plan (created in the
// Shopify Subscriptions app), so the site never offers something that can't
// actually be bought as a subscription.
export async function getSubscriptionOffer(handle: string): Promise<SubscriptionOffer | null> {
  const product = await getProduct(handle);
  if (!product?.availableForSale) return null;
  const data = await storefrontFetch<RawAllocations>(
    `query Plans($handle: String!) {
      product(handle: $handle) {
        variants(first: 1) {
          nodes {
            id
            sellingPlanAllocations(first: 5) {
              nodes { sellingPlan { id name } priceAdjustments { price { amount currencyCode } } }
            }
          }
        }
      }
    }`,
    { variables: { handle }, privateToken: privateToken() },
  );
  const variant = data.product?.variants.nodes[0];
  const plans = (variant?.sellingPlanAllocations.nodes ?? []).map(allocation => ({
    id: allocation.sellingPlan.id,
    name: allocation.sellingPlan.name,
    price: allocation.priceAdjustments[0]?.price ?? product.priceRange.minVariantPrice,
  }));
  if (!variant || plans.length === 0) return null;
  return { product, variantId: variant.id, plans };
}
