'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { track } from '@/lib/analytics/track';

// Shopify description split into the persuasive preview (hook, promise,
// benefits) and the details (what's included, how it works, fine print).
// Everything stays in the page for SEO; the details are just collapsed.
export function ProductDescription({ previewHtml, moreHtml, slug }: { previewHtml: string; moreHtml: string; slug: string }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!open) track({ name: 'description_expanded', fromProduct: slug });
    setOpen(!open);
  };

  return (
    <div className={`product-description ${moreHtml && !open ? 'is-collapsed' : ''}`}>
      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      {moreHtml && (
        <>
          <div className="product-description-more" id="product-description-more" hidden={!open} dangerouslySetInnerHTML={{ __html: moreHtml }} />
          <button type="button" className="description-toggle" onClick={toggle} aria-expanded={open} aria-controls="product-description-more">
            {open ? 'Show less' : 'Learn more about this item'}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
