'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics/track';
import type { CommerceItem } from '@/lib/analytics/events';

export function ProductViewTracker({ item }: { item: CommerceItem }) {
  const sent = useRef<string | null>(null);
  useEffect(() => {
    if (sent.current === item.variantId) return;
    sent.current = item.variantId;
    track({ name: 'product_viewed', item });
  }, [item]);
  return null;
}
