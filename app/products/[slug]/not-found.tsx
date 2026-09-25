import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Unknown slug, or a product that is unpublished / still a draft in Shopify.
export default function ProductNotFound() {
  return (
    <main className="product-page">
      <section className="status-page">
        <span className="eyebrow">GIFT NOT AVAILABLE</span>
        <h1>This gift isn’t <em>available right now.</em></h1>
        <p>It may have sold out or been retired. Take a look at our other personalized gifts.</p>
        <div className="status-actions">
          <Link href="/#couples" className="button-primary">Shop gifts <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
