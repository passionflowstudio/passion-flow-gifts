import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { UpsellViewTracker } from '@/components/product/UpsellViewTracker';
import { allAccess } from '@/lib/catalog';
import { formatMoney } from '@/lib/money';
import { getSubscriptionOffer } from '@/lib/shopify/products';
import { AllAccessLink } from './AllAccessLink';
import { allAccessPerks, perMonth } from './content';

// Third step of the funnel (after the product and the bundle). Renders only
// when All Access can actually be bought as a subscription.
export async function AllAccessTeaser({ fromProduct }: { fromProduct: string }) {
  const offer = await getSubscriptionOffer(allAccess.handle);
  if (!offer) return null;
  const plan = offer.plans[0];

  return (
    <section className="aa-teaser" aria-labelledby="aa-teaser-title">
      <UpsellViewTracker offer="all_access" fromProduct={fromProduct} />
      <div className="aa-teaser-copy">
        <span className="eyebrow">PASSION FLOW MOMENTS · ALL ACCESS</span>
        <h2 id="aa-teaser-title">Never run out of <em>meaningful gift ideas.</em></h2>
        <p>Get every Passion Flow gift template for a whole year: couples, birthdays, best friends and every new release.</p>
        <ul>{allAccessPerks.slice(0, 3).map(perk => <li key={perk}><Check size={15} /> {perk}</li>)}</ul>
        <p className="aa-teaser-price">
          <strong>{formatMoney(plan.price)}</strong> / year <span>· about {perMonth(plan.price)} a month</span>
        </p>
        <AllAccessLink fromProduct={fromProduct} className="aa-teaser-cta">
          Explore All Access <ArrowRight size={16} />
        </AllAccessLink>
      </div>
      <div className="aa-teaser-art" aria-hidden="true">
        {['/hero-grid/couple-matchbook.jpg', '/hero-grid/birthday-book.jpg', '/hero-grid/bestie-pink.jpg', '/hero-grid/playing-cards.jpg'].map(src => (
          <span key={src}><Image src={src} alt="" fill sizes="(max-width: 900px) 40vw, 18vw" /></span>
        ))}
      </div>
    </section>
  );
}

