import Link from 'next/link';

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="PassionFlow Studio home">
      <span>PASSIONFLOW</span><small>STUDIO</small>
    </Link>
  );
}
