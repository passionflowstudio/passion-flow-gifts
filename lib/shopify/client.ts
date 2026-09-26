import { shopifyConfig, storefrontEndpoint } from './config';

export class ShopifyError extends Error {
  constructor(message: string, readonly kind: 'network' | 'http' | 'graphql') {
    super(message);
    this.name = 'ShopifyError';
  }
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  // Server-side caching (ignored in the browser).
  revalidate?: number | false;
  privateToken?: string;
};

// Minimal Storefront API client usable from server and browser. Throws
// ShopifyError on network, HTTP and top-level GraphQL errors; mutation
// userErrors are returned in data for callers to handle.
export async function storefrontFetch<T>(query: string, { variables, revalidate, privateToken }: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (privateToken) headers['Shopify-Storefront-Private-Token'] = privateToken;
  else if (shopifyConfig.publicToken) headers['X-Shopify-Storefront-Access-Token'] = shopifyConfig.publicToken;

  // Read queries retry once on a dropped connection; mutations never retry
  // (a retried cart mutation could apply twice).
  const attempts = /\bmutation\b/.test(query) ? 1 : 2;
  const init = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    ...(typeof window === 'undefined'
      ? { next: revalidate === false ? undefined : { revalidate: revalidate ?? 60, tags: ['shopify'] }, cache: revalidate === false ? 'no-store' : undefined }
      : { cache: 'no-store' }),
  } as RequestInit;

  let response: Response | undefined;
  for (let attempt = 1; attempt <= attempts && !response; attempt++) {
    try {
      response = await fetch(storefrontEndpoint, init);
    } catch {
      // fall through to retry, or to the error below
    }
  }
  if (!response) throw new ShopifyError('Could not reach the store. Check your connection and try again.', 'network');

  if (!response.ok) throw new ShopifyError(`Store request failed (${response.status}).`, 'http');

  const body = await response.json() as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new ShopifyError(body.errors.map(e => e.message).join('; '), 'graphql');
  if (!body.data) throw new ShopifyError('Store returned no data.', 'graphql');
  return body.data;
}
