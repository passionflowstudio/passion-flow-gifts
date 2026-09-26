import { catalog, findBySlug } from '@/lib/catalog';
import { submitReview } from '@/lib/judgeme';
import { getProduct } from '@/lib/shopify/products';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Light per-instance throttle: at most 5 reviews per IP per hour.
const recent = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter(t => now - t < 3_600_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    // Honeypot: real visitors never see or fill this field.
    if (clean(body.website, 200)) return Response.json({ success: true });

    const ip = request.headers.get('x-nf-client-connection-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (throttled(ip)) return Response.json({ error: 'Too many reviews from this connection. Please try again later.' }, { status: 429 });

    const slug = clean(body.product, 100);
    const entry = findBySlug(slug);
    const name = clean(body.name, 60);
    const email = clean(body.email, 200);
    const title = clean(body.title, 100);
    const text = clean(body.body, 2000);
    const rating = Number(body.rating);

    if (!entry || !catalog.includes(entry)) return Response.json({ error: 'Please choose the gift you bought.' }, { status: 400 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ error: 'Please choose a star rating.' }, { status: 400 });
    if (!name) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
    if (!emailPattern.test(email)) return Response.json({ error: 'Please enter the email you ordered with.' }, { status: 400 });
    if (text.length < 10) return Response.json({ error: 'Please write at least a sentence about your gift.' }, { status: 400 });

    const product = await getProduct(entry.handle);
    const productId = product?.id.split('/').pop();
    if (!productId) return Response.json({ error: 'That gift isn’t available for reviews right now.' }, { status: 400 });

    const ok = await submitReview({ productId, name, email, rating, title, body: text });
    if (!ok) return Response.json({ error: 'We couldn’t send your review. Please try again in a minute.' }, { status: 502 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'We couldn’t send your review. Please try again in a minute.' }, { status: 500 });
  }
}
