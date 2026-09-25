'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Shown if Shopify is unreachable and there is no cached copy of the page.
export default function ProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="product-page">
      <section className="status-page">
        <span className="eyebrow">SOMETHING WENT WRONG</span>
        <h1>We couldn’t load this gift <em>just now.</em></h1>
        <p>Our store is taking a moment to respond. Please try again — nothing in your cart has been lost.</p>
        <div className="status-actions">
          <button type="button" className="button-primary" onClick={reset}>Try again <ArrowRight size={16} /></button>
          <Link href="/" className="status-link">Back to home</Link>
        </div>
      </section>
    </main>
  );
}
