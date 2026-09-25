import type { Review } from '@/lib/product-content';
import { Stars } from './Stars';

// One short, real review right under the buy buttons.
export function ReviewHighlight({ review }: { review: Review }) {
  return (
    <figure className="review-highlight">
      <Stars rating={review.rating} size={13} />
      <blockquote>“{review.text}”</blockquote>
      <figcaption>{review.name} · Verified Etsy buyer</figcaption>
    </figure>
  );
}
