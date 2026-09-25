'use client';

import { useEffect, useState } from 'react';

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

// Daily sale countdown to the shopper's local midnight (shared by the top
// banner and the product price so both always show the same time).
export function useMidnightCountdown() {
  const [countdown, setCountdown] = useState('--:--:--');
  useEffect(() => {
    const tick = () => setCountdown(timeUntilMidnight());
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, []);
  return countdown;
}
