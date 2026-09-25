'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track } from '@/lib/analytics/track';
import { allAccess } from '@/lib/catalog';

export function AllAccessLink({ fromProduct, className, children }: { fromProduct: string; className?: string; children: ReactNode }) {
  return (
    <Link
      href={allAccess.path}
      className={className}
      onClick={() => track({ name: 'upsell_clicked', offer: 'all_access', fromProduct, action: 'view' })}
    >
      {children}
    </Link>
  );
}
