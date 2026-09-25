// Store domain and API version are public. Tokens are optional: without them
// the Storefront API runs in tokenless mode (products, collections, cart),
// which is enough for this storefront. Add Headless-channel tokens for higher
// limits and per-storefront reporting.

export const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'wa6e8d-0m.myshopify.com',
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07',
  publicToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
};

export const storefrontEndpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;
