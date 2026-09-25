import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Faq } from '@/lib/product-content';

// Native <details> accordion: accessible and works without JavaScript.
export function ProductFaq({ faqs, title = <>Questions? <em>We’ve got you.</em></> }: { faqs: Faq[]; title?: ReactNode }) {
  if (!faqs.length) return null;
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq-head">
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2 id="faq-title">{title}</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.q} className="faq-item" open={index === 0}>
            <summary>{faq.q}<Plus size={18} aria-hidden="true" /></summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
