import { Star } from 'lucide-react';

export function Stars({ rating, size = 16, label }: { rating: number; size?: number; label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} strokeWidth={0} fill="currentColor" className={i <= Math.round(rating) ? 'is-on' : ''} aria-hidden="true" />
      ))}
    </span>
  );
}
