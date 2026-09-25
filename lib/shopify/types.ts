// Types for the Storefront API fields this app queries (see fragments.ts).

export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  seo: { title: string | null; description: string | null };
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; amountPerQuantity: Money };
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    image: ShopifyImage | null;
    product: { id: string; handle: string; title: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  attributes: { key: string; value: string | null }[];
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};

export type CartAttribute = { key: string; value: string };

export type UserError = { field: string[] | null; message: string; code?: string | null };
export type CartWarning = { code: string; message: string; target: string };
