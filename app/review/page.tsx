import type { Metadata } from 'next';
import { ReviewForm } from '@/components/site/ReviewForm';
import { catalog, findBySlug } from '@/lib/catalog';
import { getProduct } from '@/lib/shopify/products';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Tell us how your Passion Flow Studio gift turned out.',
  robots: { index: false },
  alternates: { canonical: '/review' },
};

// Stable review link used in every PDF. Reviews go to Judge.me.
export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const products = (await Promise.all(catalog.map(async entry => {
    const live = await getProduct(entry.handle);
    // Drop the ": Editable Canva Template"-style subtitle for a short label.
    return live ? { slug: entry.slug, label: live.title.split(':')[0].trim() } : null;
  }))).filter((p): p is { slug: string; label: string } => p !== null);

  return (
    <main className="review-page">
      <div className="review-page-head">
        <span className="eyebrow">LOVED YOUR TEMPLATE?</span>
        <h1>Tell us how <em>your gift turned out.</em></h1>
        <p>It would mean the world to us. Your review helps our small shop grow and helps others find a gift they’ll love too.</p>
      </div>
      <ReviewForm products={products} initialProduct={product && findBySlug(product) ? product : undefined} />
    </main>
  );
}
