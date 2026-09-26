'use client';

import { Fragment } from 'react';
import { useMidnightCountdown } from '@/hooks/useMidnightCountdown';
import { saleBanner } from '@/lib/site-config';

const Dot = () => <i>·</i>;

export function SaleBanner() {
  const countdown = useMidnightCountdown();

  if (!saleBanner.enabled) return null;

  return (
    <div className="sale-banner" aria-label={saleBanner.ariaLabel}>
      <div className="sale-track">
        {[0, 1, 2, 3].map(item => (
          <p key={item} aria-hidden={item > 0}>
            {saleBanner.parts.map(part => <Fragment key={part}>{part} <Dot /> </Fragment>)}
            {saleBanner.countdownLabel} <strong>{countdown}</strong>
            {saleBanner.trailing.map(part => <Fragment key={part}> <Dot /> {part}</Fragment>)}
          </p>
        ))}
      </div>
    </div>
  );
}
