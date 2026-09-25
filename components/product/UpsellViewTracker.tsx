'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics/track';
import type { UpsellOffer } from '@/lib/analytics/events';

// Reports an offer as viewed once it's actually on screen (not just rendered),
// so upsell view → click → purchase rates are meaningful.
export function UpsellViewTracker({ offer, fromProduct }: { offer: UpsellOffer; fromProduct: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.parentElement;
    if (!section) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        track({ name: 'upsell_viewed', offer, fromProduct });
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [offer, fromProduct]);
  return <span ref={ref} hidden />;
}
