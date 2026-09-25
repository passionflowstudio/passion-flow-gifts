'use client';

import type { GalleryMedia } from '@/lib/shopify/types';
import { ProductGallery } from './ProductGallery';
import { useOfferSelection, type OfferKey } from './OfferSelection';

type GallerySet = { media: GalleryMedia[]; title: string; badge?: string };

// Shows the photos for whichever offer is selected; falls back to the single
// gift's photos if the other set is missing.
export function OfferGallery({ sets }: { sets: Partial<Record<OfferKey, GallerySet>> & { single: GallerySet } }) {
  const { selected } = useOfferSelection('single');
  const set = sets[selected] ?? sets.single;
  // Keyed so switching offers starts that gallery at its first photo.
  return <ProductGallery key={selected} media={set.media} title={set.title} badge={set.badge} />;
}
