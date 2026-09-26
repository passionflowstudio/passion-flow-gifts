import Link from 'next/link';

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="Passion Flow Studio home">
      <span>PASSION FLOW</span><small>STUDIO</small>
    </Link>
  );
}
