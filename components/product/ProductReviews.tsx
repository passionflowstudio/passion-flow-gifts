'use client';

import { useState } from 'react';
import { BadgeCheck, Check } from 'lucide-react';
import type { ReviewSummary } from '@/lib/product-content';
import { Stars } from './Stars';

const INITIAL_VISIBLE = 4;

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function StatRing({ value, label }: { value: string; label: string }) {
  return (
    <div className="review-stat">
      <span className="review-stat-ring">{value}</span>
      <span className="review-stat-label">{label}</span>
    </div>
  );
}

export function ProductReviews({ summary }: { summary: ReviewSummary }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? summary.reviews : summary.reviews.slice(0, INITIAL_VISIBLE);
  const hidden = summary.reviews.length - INITIAL_VISIBLE;

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews-head">
        <h2 id="reviews-title" className="heading-inline">{summary.about === 'shop' ? <>Reviews from <em>our shop</em></> : <>Reviews for <em>this gift</em></>}</h2>
        <p className="reviews-source"><BadgeCheck size={15} /> Verified purchases from our {summary.source} shop{summary.note ? `\u00a0· ${summary.note}` : ''}</p>
      </div>

      <div className="reviews-summary">
        <div className="reviews-score">
          <strong>{summary.average.toFixed(1)}</strong>
          <div>
            <Stars rating={summary.average} size={18} />
            <span>{summary.scope === 'shop' ? `Shop rating · ${summary.count} reviews` : `${summary.count} reviews`}</span>
          </div>
        </div>
        <div className="review-stats">
          {summary.itemQuality && <StatRing value={summary.itemQuality.toFixed(1)} label="Item quality" />}
          {summary.customerService && <StatRing value={summary.customerService.toFixed(1)} label="Customer service" />}
          {summary.recommendPercent !== undefined && <StatRing value={`${summary.recommendPercent}%`} label="Buyers recommend" />}
        </div>
      </div>

      {summary.highlights?.length ? (
        <ul className="review-highlights" aria-label="What buyers say">
          <li className="review-highlights-label">What buyers say</li>
          {summary.highlights.map(h => <li key={h}><Check size={14} /> {h}</li>)}
        </ul>
      ) : null}

      <ol className="review-list">
        {visible.map((review, i) => (
          <li key={`${review.name}-${review.date}-${i}`} className="review-card">
            <div className="review-card-top">
              <Stars rating={review.rating} size={15} />
              <span className="review-recommends"><Check size={13} /> Recommends</span>
            </div>
            {review.product && <span className="review-product">{review.product}</span>}
            <p className="review-text">“{review.text}”</p>
            <div className="review-meta">
              <span className="review-avatar" aria-hidden="true">{review.name.charAt(0).toUpperCase()}</span>
              <span className="review-name">{review.name}</span>
              <time dateTime={review.date}>{formatDate(review.date)}</time>
            </div>
            {review.response && (
              <div className="review-response">
                <strong>Response from Passion Flow Studio</strong>
                <p>{review.response}</p>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="reviews-foot">
        {hidden > 0 && (
          <button type="button" className="reviews-more" onClick={() => setExpanded(v => !v)} aria-expanded={expanded}>
            {expanded ? 'Show fewer reviews' : `Show all ${summary.reviews.length} reviews`}
          </button>
        )}
      </div>
    </section>
  );
}
