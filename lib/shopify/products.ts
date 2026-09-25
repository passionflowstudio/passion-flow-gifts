import 'server-only';
import { storefrontFetch } from './client';
import { PRODUCT_FRAGMENT } from './fragments';
import type { Product, ShopifyImage, ProductVariant } from './types';

type RawProduct = Omit<Product, 'images' | 'variants'> & {
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ProductVariant[] };
};

const normalize = (raw: RawProduct): Product => ({ ...raw, images: raw.images.nodes, variants: raw.variants.nodes });

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
