'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type OfferKey = 'single' | 'bundle';

type Selection = { selected: OfferKey; setSelected: (key: OfferKey) => void };

const OfferSelectionContext = createContext<Selection | null>(null);

// Shares the chosen offer (single gift vs bundle) between the purchase box
// and the gallery, so picking the bundle also shows the bundle photos.
export function OfferSelectionProvider({ initial = 'single', children }: { initial?: OfferKey; children: ReactNode }) {
  const [selected, setSelected] = useState<OfferKey>(initial);
  return <OfferSelectionContext.Provider value={{ selected, setSelected }}>{children}</OfferSelectionContext.Provider>;
}

export function useOfferSelection(fallback: OfferKey): Selection {
  const context = useContext(OfferSelectionContext);
  const [local, setLocal] = useState<OfferKey>(fallback);
  return context ?? { selected: local, setSelected: setLocal };
}
