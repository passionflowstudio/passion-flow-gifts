'use client';

import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';

type Option = { slug: string; label: string };

export function ReviewForm({ products, initialProduct }: { products: Option[]; initialProduct?: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) { setError('Please choose a star rating.'); return; }
    setStatus('sending');
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(form), rating }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error);
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'We couldn’t send your review. Please try again.');
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div className="review-form-done" role="status">
        <h2 className="heading-inline">Thank you <em>so much!</em></h2>
        <p>Your review is on its way. It helps our small shop more than you know. 💛</p>
      </div>
    );
  }

  const shown = hover || rating;
  return (
    <form className="review-form" onSubmit={onSubmit} noValidate>
      <label>
        <span>Which gift did you make?</span>
        <select name="product" defaultValue={initialProduct ?? ''} required>
          <option value="" disabled>Choose your gift</option>
          {products.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
        </select>
      </label>

      <fieldset className="review-form-stars" onMouseLeave={() => setHover(0)}>
        <legend>Your rating</legend>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={rating === n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
          >
            <Star size={30} className={n <= shown ? 'is-on' : ''} />
          </button>
        ))}
      </fieldset>

      <label><span>Review title <small>(optional)</small></span><input name="title" maxLength={100} placeholder="She cried happy tears" /></label>
      <label><span>Your review</span><textarea name="body" rows={5} maxLength={2000} required placeholder="How did making and giving it go?" /></label>
      <div className="review-form-row">
        <label><span>Your name</span><input name="name" maxLength={60} autoComplete="given-name" required /></label>
        <label><span>Email you ordered with</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <input className="review-form-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="review-form-note">We only use your email to confirm your order. It’s never shown.</p>
      {error && <p className="review-form-error" role="alert">{error}</p>}
      <button className="button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send my review'}</button>
    </form>
  );
}
