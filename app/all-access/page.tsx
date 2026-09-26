import type { Metadata } from 'next';
import { Check, Gift, Infinity as InfinityIcon, RefreshCw, Sparkles } from 'lucide-react';
import { AllAccessJoin } from '@/components/allaccess/AllAccessJoin';
import { allAccessPerks, perMonth } from '@/components/allaccess/content';
import { ProductFaq } from '@/components/product/ProductFaq';
import { GiftGrid } from '@/components/site/GiftGrid';
import { SignupForm } from '@/components/site/SignupForm';
import { allAccess, findBySlug } from '@/lib/catalog';
import { formatMoney } from '@/lib/money';
import { getProduct, getSubscriptionOffer } from '@/lib/shopify/products';
import type { Money } from '@/lib/shopify/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Access: Every Gift Template, All Year',
  description: 'Passion Flow Studio All Access: every Passion Flow gift template for couples, birthdays and best friends, plus new releases, for one yearly price.',
  alternates: { canonical: allAccess.path },
};

const faqs = [
  { q: 'What do I get with All Access?', a: 'Every gift template in the Passion Flow library, plus new designs as we release them during your membership. Each one is editable in free Canva and comes with a video tutorial.' },
  { q: 'How does renewal work?', a: 'All Access is billed once a year. It renews automatically at the same yearly price until you cancel, and we’ll email you before it renews.' },
  { q: 'How do I cancel?', a: 'Cancel anytime from your account, or email passionflow.studio@gmail.com and we’ll cancel it for you. You keep access until the end of the year you’ve paid for.' },
  { q: 'How do I get the templates?', a: 'Right after checkout you’ll get a link to the full template library on your order confirmation page and by email.' },
  { q: 'Do I need Canva Pro?', a: 'No. Every template works with a free Canva account.' },
];

const steps = [
  { icon: Sparkles, title: 'Join once', text: 'One yearly payment through secure Shopify checkout.' },
  { icon: Gift, title: 'Open the library', text: 'Get your link to every template instantly after checkout.' },
  { icon: InfinityIcon, title: 'Make gifts all year', text: 'Anniversaries, birthdays, holidays or just because, ready in minutes.' },
];

async function livePrice(slug: string): Promise<Money | null> {
  const entry = findBySlug(slug);
  const product = entry ? await getProduct(entry.handle) : null;
  return product?.variants[0]?.price ?? null;
}

export default async function AllAccessPage() {
  const [offer, singlePrice, bundlePrice] = await Promise.all([
    getSubscriptionOffer(allAccess.handle),
    livePrice('couple-matchbook'),
    livePrice('couples-gift-bundle'),
  ]);
  const plan = offer?.plans[0];

  return (
    <main className="aa-page">
      <section className="aa-hero">
        <div className="aa-hero-copy">
          <span className="eyebrow">PASSION FLOW STUDIO · ALL ACCESS{offer?.preview && <span className="aa-preview-tag">Preview</span>}</span>
          <h1>Never run out of <em>meaningful gift ideas.</em></h1>
          <p>Want a thoughtful gift ready for every occasion this year? All Access gives you every Passion Flow template, and every new one we release, for one yearly price.</p>
          <ul className="aa-perks">{allAccessPerks.map(perk => <li key={perk}><Check size={16} /> {perk}</li>)}</ul>

          {plan ? (
            <div className="aa-buy">
              <p className="aa-price"><strong>{formatMoney(plan.price)}</strong> / year <span>about {perMonth(plan.price)} a month</span></p>
              {offer!.preview ? (
                <p className="aa-renewal">Design preview. Joining turns on once the subscription is set up in Shopify.</p>
              ) : (
                <AllAccessJoin
                  item={{ productId: offer!.product!.id, variantId: offer!.variantId, handle: offer!.product!.handle, title: offer!.product!.title, sellingPlanId: plan.id }}
                  renewalNote={`Billed ${formatMoney(plan.price)} yearly. Renews automatically until you cancel. Cancel anytime.`}
                />
              )}
            </div>
          ) : (
            <div className="aa-soon">
              <p><strong>All Access is opening soon.</strong> Join the list to be first in.</p>
              <SignupForm />
            </div>
          )}
        </div>
        <div className="aa-hero-art">
          <GiftGrid lead="This could be" message="all your gifts." priority sizes="(max-width: 900px) 30vw, 16vw" />
        </div>
      </section>

      <section className="aa-steps" aria-label="How All Access works">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></div>
        ))}
      </section>

      {plan && singlePrice && bundlePrice && (
        <section className="aa-compare" aria-labelledby="aa-compare-title">
          <h2 id="aa-compare-title">One gift, a set, <em>or everything.</em></h2>
          <div className="aa-compare-grid">
            <div><span>One gift</span><strong>{formatMoney(singlePrice)}</strong><p>A single template, like the Couple Matchbook.</p></div>
            <div><span>Gift bundle</span><strong>{formatMoney(bundlePrice)}</strong><p>Four matching gifts for one occasion.</p></div>
            <div className="is-featured"><span>All Access</span><strong>{formatMoney(plan.price)}<small> / year</small></strong><p>Every template, every occasion, plus new releases all year.</p><RefreshCw size={14} aria-hidden="true" /></div>
          </div>
        </section>
      )}

      <div className="aa-faq"><ProductFaq faqs={faqs} title={<>Before you <em>join All Access.</em></>} /></div>
    </main>
  );
}
