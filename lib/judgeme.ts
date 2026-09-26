import 'server-only';
import { shopifyConfig } from './shopify/config';

// Judge.me reviews written on this site or through Judge.me's review request
// emails. Etsy reviews stay in product-content.ts; the two are never merged
// into one rating.
//
// The public token only reads the widget API and is designed to be public.
// Never use the private token here.
const publicToken = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN || 'hNPsUR4qFPfx544CQse4-RDez74';
const API = 'https://judge.me/api/v1';

export type SiteReview = {
  id: string;
  name: string;
  date: string; // ISO date
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  text: string;
  verified: boolean;
};

export type SiteReviews = { average: number; count: number; reviews: SiteReview[] };

// Judge.me statuses that count as a verified purchase.
const VERIFIED = new Set(['confirmed-buyer', 'buyer', 'verified-purchase', 'semi-verified-purchase', 'admin']);

async function widget<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const url = new URL(`${API}${path}`);
  url.search = new URLSearchParams({ shop_domain: shopifyConfig.storeDomain, ...params }).toString();
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Api-Token': publicToken },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    return response.ok ? (await response.json()) as T : null;
  } catch {
    // Reviews are extra; a Judge.me outage must never break a product page.
    return null;
  }
}

type RawReview = {
  id?: number | string;
  rating?: number;
  title?: string | null;
  body?: string | null;
  created_at?: string;
  verified?: string;
  hidden?: boolean;
  reviewer?: { name?: string } | null;
  reviewer_name?: string;
};

function toReview(raw: RawReview): SiteReview | null {
  const rating = Math.round(Number(raw.rating));
  const text = raw.body?.trim();
  if (raw.hidden || !text || rating < 1 || rating > 5) return null;
  return {
    id: String(raw.id ?? `${raw.created_at}-${text.slice(0, 20)}`),
    name: (raw.reviewer?.name || raw.reviewer_name || 'Verified buyer').trim(),
    date: (raw.created_at ?? new Date().toISOString()).slice(0, 10),
    rating: rating as SiteReview['rating'],
    title: raw.title?.trim() || undefined,
    text,
    verified: raw.verified ? VERIFIED.has(raw.verified) : false,
  };
}

export async function getSiteReviews(handle: string): Promise<SiteReviews | null> {
  const [badge, list] = await Promise.all([
    widget<{ badge?: string }>('/widgets/preview_badge', { handle }),
    widget<{ reviews?: RawReview[] }>('/widgets/product_review', { handle, json_request: 'true', per_page: '20' }),
  ]);
  const count = Number(badge?.badge?.match(/data-number-of-reviews='(\d+)'/)?.[1] ?? 0);
  const average = Number(badge?.badge?.match(/data-average-rating='([\d.]+)'/)?.[1] ?? 0);
  const reviews = (list?.reviews ?? []).map(toReview).filter((r): r is SiteReview => r !== null);
  if (!count || !reviews.length) return null;
  return { average, count, reviews };
}

// Sends a review to Judge.me's public review form endpoint (the same one its
// on-page form uses). Judge.me marks it verified if the email matches an order.
export async function submitReview(input: {
  productId: string; // numeric Shopify product ID
  name: string;
  email: string;
  rating: number;
  title?: string;
  body: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${API}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        shop_domain: shopifyConfig.storeDomain,
        platform: 'shopify',
        id: Number(input.productId),
        name: input.name,
        email: input.email,
        rating: input.rating,
        title: input.title || undefined,
        body: input.body,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
