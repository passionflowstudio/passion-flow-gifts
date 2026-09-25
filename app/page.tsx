import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CirclePlay, Download, Gift, Heart, Pencil, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/home/ProductCard';
import { SignupForm } from '@/components/site/SignupForm';
import { bundles, couples, friends, heroGrid, invites } from '@/lib/home-content';
import { etsy, socialProof } from '@/lib/site-config';

export const metadata = {
  alternates: { canonical: '/' },
};

const trustPoints = [
  { icon: Download, title: 'Instant Digital Download' },
  { icon: Pencil, title: 'Beginner-Friendly Canva Editing' },
  { icon: Sparkles, title: 'No Design Experience Needed' },
  { icon: Heart, title: 'Designed to Feel Personal' },
  { icon: CirclePlay, title: 'Step-by-Step Video Tutorial for Every Product' },
  { icon: Gift, title: 'Made for Gifting Moments of Every Occasion' },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <div className="hero-proof" aria-label={`${socialProof.label}, five stars`}>
            <span>{socialProof.label}</span><span className="hero-stars" aria-hidden="true">★★★★★</span>
          </div>
          <h1><span className="headline-line">Meaningful gifts</span><em><span className="headline-line">made from</span><span className="headline-line">your memories.</span></em></h1>
          <p>Turn your favorite photos, moments, and inside jokes into personalized gifts they’ll actually want to keep.</p>
          <a className="button-primary" href={etsy.shop} target="_blank" rel="noreferrer">Shop gifts <ArrowRight size={18} /></a>
          <div className="hero-links"><Link href="#couples">For Couples</Link><i /><Link href="#friends">For Friends</Link><i /><Link href="#invites">For Invites</Link></div>
        </div>
        <div className="hero-gallery" aria-label="A gallery of personalized Passion Flow gifts">
          <div className="hero-grid">
            {heroGrid.map((tile, index) => tile === 'message'
              ? <div className="hero-grid-message" key="message"><span>This could be</span><em>your gift.</em></div>
              : <div className="hero-grid-tile" key={tile.src}><Image src={tile.src} alt={tile.alt} fill priority={index < 3} sizes="(max-width: 680px) 32vw, (max-width: 1100px) 27vw, 216px" /></div>)}
          </div>
        </div>
      </section>

      <section className="love-divider" aria-label="Best-selling gift templates worldwide">
        <div className="marquee-track">{[0, 1, 2, 3].map(item => <p key={item} aria-hidden={item > 0}><span>Best-Selling</span> <em>Gift Templates Worldwide.</em></p>)}</div>
      </section>

      <section className="chapter couples-chapter" id="couples">
        <div className="chapter-intro reveal">
          <div><span className="eyebrow">FOR COUPLES <Heart size={15} /></span><h2><span className="headline-line">Turn your story</span><em><span className="headline-line">into something</span><span className="headline-line">they can keep.</span></em></h2></div>
          <div className="chapter-note"><p>Personalized gifts for anniversaries, milestones, Valentine’s Day, and just because.</p><a href={etsy.couplesSection} target="_blank" rel="noreferrer">Shop all couple gifts <ArrowRight size={15} /></a></div>
        </div>
        <div className="product-grid">{couples.map(product => <ProductCard key={product.name} product={product} />)}</div>
      </section>

      <section className="chapter friends-chapter" id="friends">
        <div className="chapter-intro reveal">
          <div><span className="eyebrow">FOR FRIENDS <span className="tiny-flower">✽</span></span><h2><span className="headline-line">For the friendship</span><em><span className="headline-line">you never</span><span className="headline-line">want to forget.</span></em></h2></div>
          <div className="chapter-note"><p>Personalized birthday and best-friend gifts made from your favorite memories together.</p><a href={etsy.friendsSection} target="_blank" rel="noreferrer">Shop all friend gifts <ArrowRight size={15} /></a></div>
        </div>
        <div className="product-grid">{friends.map(product => <ProductCard key={product.name} product={product} />)}</div>
      </section>

      <section className="bundles" id="bundles">
        <div className="bundle-intro reveal"><span className="eyebrow muted-label">BUNDLES · OPTIONAL UPGRADES</span><h2>More memories. <em>More ways to give them.</em></h2><p>Can’t choose just one? Get multiple personalized gifts together in one thoughtful collection.</p></div>
        {bundles.map(bundle => (
          <a className="bundle-card" key={bundle.name} href={bundle.url} target="_blank" rel="noreferrer">
            <div className="bundle-image"><Image src={bundle.image} alt={bundle.alt} fill sizes="(max-width: 680px) 50vw, 34vw" /><div className="bundle-badge">Our bestsellers · all in one</div></div>
            <span><small>{bundle.count}</small><strong>{bundle.name}</strong><em>Shop bundle <ArrowRight size={14} /></em></span>
          </a>
        ))}
      </section>

      <section className="invites" id="invites">
        <div className="invite-copy reveal"><span className="eyebrow">MAKE THE MOMENT START BEFORE THE PARTY</span><h2><span className="headline-line">Make the invitation</span><em><span className="headline-line">part of the experience.</span></em></h2><p>Interactive birthday and wedding invitations your guests can tap through, with photos, music, RSVP, directions, and all the details.</p><a className="button-primary" href={etsy.invites} target="_blank" rel="noreferrer">Explore all invites <ArrowRight size={17} /></a></div>
        <div className="invite-gallery">
          {invites.map((invite, index) => (
            <a className={`invite-phone phone-${index + 1}`} key={invite.name} href={invite.url} target="_blank" rel="noreferrer">
              <div><Image src={invite.image} alt={invite.name} fill sizes="250px" /></div>
              <span className="invite-name">{invite.name}</span>
              <span className="invite-action">Shop invite <ArrowRight size={12} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-copy reveal"><span className="eyebrow">WHY CUSTOMERS CHOOSE US</span><h2><span className="headline-line">Made for the moments</span><em><span className="headline-line">you don’t want to forget.</span></em></h2><p>Passion Flow Studio turns the photos, stories, and little details you already love into meaningful gifts that feel completely personal.</p><a className="button-primary about-button" href={etsy.shop} target="_blank" rel="noreferrer">See the whole shop <ArrowRight size={17} /></a></div>
        <div className="trust-grid">
          {trustPoints.map(({ icon: Icon, title }) => <div key={title}><span className="trust-icon"><Icon /></span><span className="trust-copy"><h3>{title}</h3></span></div>)}
        </div>
      </section>

      <section className="contact-band">
        <div className="reveal"><span className="eyebrow">STAY IN THE FLOW</span><h2>Never miss <em>a gifting moment.</em></h2><p>Get early access to new designs, seasonal gifting ideas, and special offers.</p></div>
        <SignupForm />
      </section>
    </main>
  );
}
