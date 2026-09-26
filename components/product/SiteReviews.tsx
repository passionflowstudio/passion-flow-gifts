import { BadgeCheck, PenLine } from 'lucide-react';
import Link from 'next/link';
import type { SiteReviews as SiteReviewsData } from '@/lib/judgeme';
import { Stars } from './Stars';

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Reviews collected on this site through Judge.me. Shown above the Etsy
// reviews with their own rating; the two sources are never combined.
export function SiteReviews({ data, slug }: { data: SiteReviewsData; slug: string }) {
  return (
    <section className="reviews site-reviews" aria-labelledby="site-reviews-title">
      <div className="reviews-head">
        <h2 id="site-reviews-title" className="heading-inline">Reviews from <em>our website</em></h2>
        <p className="reviews-source"><BadgeCheck size={15} /> Collected by Judge.me from passionflowstudio.com buyers</p>
      </div>

      <div className="reviews-summary">
        <div className="reviews-score">
          <strong>{data.average.toFixed(1)}</strong>
          <div>
            <Stars rating={data.average} size={18} />
            <span>{data.count} {data.count === 1 ? 'review' : 'reviews'}</span>
          </div>
        </div>
      </div>

      <ol className="review-list">
        {data.reviews.map(review => (
          <li key={review.id} className="review-card">
            <div className="review-card-top">
              <Stars rating={review.rating} size={15} />
              {review.verified && <span className="review-recommends"><BadgeCheck size={13} /> Verified buyer</span>}
            </div>
            {review.title && <strong className="review-title">{review.title}</strong>}
            <p className="review-text">“{review.text}”</p>
            <div className="review-meta">
              <span className="review-avatar" aria-hidden="true">{review.name.charAt(0).toUpperCase()}</span>
              <span className="review-name">{review.name}</span>
              <time dateTime={review.date}>{formatDate(review.date)}</time>
            </div>
          </li>
        ))}
      </ol>

      <div className="reviews-foot">
        <Link className="reviews-more" href={`/review?product=${slug}`}><PenLine size={15} aria-hidden="true" /> Write a review</Link>
      </div>
    </section>
  );
}
