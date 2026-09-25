'use client';

import { Fragment, useEffect, useState } from 'react';
import { saleBanner } from '@/lib/site-config';

function timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const remaining = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const Dot = () => <i>·</i>;

export function SaleBanner() {
  const [countdown, setCountdown] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setCountdown(timeUntilMidnight());
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, []);

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
