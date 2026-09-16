'use client';

import Image from 'next/image';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CirclePlay, Download, Gift, Heart, Pencil, Sparkles } from 'lucide-react';

const shop = 'https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt';
const inviteShop = 'https://www.etsy.com/shop/passionflowstudios?ref=shop-header-name&listing_id=4499460149&from_page=listing&section_id=58463936';
const nav = [['For Couples', '#couples'], ['For Friends', '#friends'], ['Bundles', '#bundles'], ['For Invites', '#invites'], ['About', '#about']];
const couples = [
  { name: 'Couple Matchbook Bundle', image: '/products/couple-matchbook-bundle-final.png', badge: '#1 BESTSELLER', description: 'All your little moments, told like a vintage matchbook.', url: 'https://www.etsy.com/listing/4383924058/custom-matchbook-art-editable-poster?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_3&pro=1&dd=1&logging_key=96ee8236b28f82bd84910541cb6b634dfa5c659e%3A4383924058&slug_redirect_followed=1' },
  { name: 'Playing Cards Poster', image: '/products/image11.jpg', description: 'Your love story, designed like a deck you’ll treasure.', url: 'https://www.etsy.com/listing/4382477069/custom-playing-cards-bundle-giftful-for?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_2&pro=1&dd=1&logging_key=1456b6af68aac98297cdc34907b877f7c0b9b205%3A4382477069' },
  { name: 'Couple Photo Book', image: '/products/image12.jpg', description: 'Your favorite memories, beautifully captured in a keepsake book.', url: 'https://www.etsy.com/listing/4348775091/couple-photo-book-o-custom-gifts?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_1&pro=1&dd=1&logging_key=459ae49f3859c9e5e5315aa19b12d70f82c17bce%3A4348775091' },
];
const friends = [
  { name: 'Bestie Matchbook Poster', image: '/products/image17.jpg', badge: '#1 BEST FRIEND PICK', description: 'Inside jokes, good times, and memories that stick.', url: 'https://www.etsy.com/listing/4435093798/bestfriend-matchbook-art-personable-bff' },
  { name: 'Birthday Photo Book', image: '/products/image16.jpg', badge: 'MOST LOVED', description: 'A heartfelt birthday gift they’ll keep forever.', url: 'https://www.etsy.com/listing/4355300090/bestfriend-photo-book-canva-photobook?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_1&pro=1&dd=1&logging_key=8fb70b11f57bfc97b091919d8901757024fa08d4%3A4355300090' },
  { name: 'Bestie Matchbook Bundle', image: '/products/bestie-matchbook-bundle.png', badge: 'NEW · 3 DESIGNS', description: 'Three custom matchbook designs for your best chapter yet.', url: 'https://www.etsy.com/listing/4565214970/matchbook-template-bundle-bestie?ls=r&sr_prefetch=1&pf_from=shop_home&ref=items-pagination-5&pro=1&dd=1&content_source=18288462c4ed364cfdafb61945cc5954%253ALT5c5d32bda08ae661d889ea599d6d4a73f08ac614&logging_key=18288462c4ed364cfdafb61945cc5954%3ALT5c5d32bda08ae661d889ea599d6d4a73f08ac614' },
];
const invites = [
  { name: 'Floral Birthday Invite', image: '/invites/floral-birthday.png', url: 'https://www.etsy.com/listing/4499460149/floral-girle-birthday-invitation-website?click_key=7ad6e5d3b695e56a3ba9bea6a02570beb6c51bd5%3A4499460149&click_sum=bffa6bb9&sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_3&pro=1&dd=1' },
  { name: 'Sage Green Wedding Invite', image: '/invites/sage-green-wedding.png', url: 'https://www.etsy.com/listing/4511373248/floral-wedding-invite-website-sagee?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_2&pro=1&dd=1&logging_key=f8d537ecbbc169a4344abaa306079e6f09a4ce23%3A4511373248' },
  { name: 'Pink Floral Wedding Invite', image: '/invites/floral-wedding.png', url: 'https://www.etsy.com/listing/4506309029/floral-wedding-invite-website-goldful?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_1&pro=1&dd=1&logging_key=5199e95bcfba995911528765287917c2bca24141%3A4506309029' },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saleCountdown, setSaleCountdown] = useState('--:--:--');
  const joinEmailList = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupStatus('loading');
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: subscriberEmail }) });
      if (!response.ok) throw new Error('Subscription failed');
      setSignupStatus('success');
      setSubscriberEmail('');
    } catch {
      setSignupStatus('error');
    }
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal, .product-card, .bundle-card, .invite-phone, .trust-grid > div').forEach(el => observer.observe(el));
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const remaining = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(remaining / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1_000);
      setSaleCountdown(`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(timer);
  }, []);
  return <main>
    <div className="sale-banner" aria-label="Digital gift sale, 60 percent off, sale ends tonight"><div className="sale-track">{[0,1,2,3].map(item => <p key={item} aria-hidden={item > 0}>Digital Gift Sale <i>·</i> 60% Off <i>·</i> Sale ends in <strong>{saleCountdown}</strong> <i>·</i> Instant Download <i>·</i> Personalize in Canva</p>)}</div></div>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="wordmark" aria-label="PassionFlow Studio home"><span>PASSIONFLOW</span><small>STUDIO</small></a>
      <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <a className="shop-link desktop-shop" href={shop} target="_blank" rel="noreferrer">Shop Etsy <ArrowRight size={16} /></a>
    </header>
    <section className="hero" id="top">
      <div className="hero-copy reveal">
        <div className="hero-proof" aria-label="Loved by more than 2,500 customers, five stars"><span>Loved by 2,500+ customers</span><span className="hero-stars" aria-hidden="true">★★★★★</span></div>
        <h1><span className="headline-line">Meaningful gifts</span><em><span className="headline-line">made from</span><span className="headline-line">your memories.</span></em></h1>
        <p>Turn your favorite photos, moments, and inside jokes into personalized gifts they’ll actually want to keep.</p>
        <a className="button-primary" href={shop} target="_blank" rel="noreferrer">Shop gifts <ArrowRight size={18} /></a>
        <div className="hero-links"><a href="#couples">For Couples</a><i /><a href="#friends">For Friends</a><i /><a href="#invites">For Invites</a></div>
      </div>
      <div className="hero-gallery" aria-label="A gallery of personalized PassionFlow gifts">
        <div className="hero-grid">
          <div className="hero-grid-tile"><Image src="/hero-grid/couple-matchbook.png" alt="Personalized couple matchbook artwork in a gold frame" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/couple-bouquet.png" alt="Personalized couple newspaper wrapped around a rose bouquet" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/bestie-pink.png" alt="Pink personalized best-friend artwork in a wood frame" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/book-portrait.png" alt="Woman holding a personalized book of memories" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-message"><span>This could be</span><em>your gift.</em></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/bestie-wine.png" alt="Wine-toned personalized best-friend artwork" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/birthday-book.png" alt="Personalized birthday book resting on a pink blanket" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/playing-cards.png" alt="Framed personalized couple playing-card artwork" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
          <div className="hero-grid-tile"><Image src="/hero-grid/book-closeup.png" alt="Smiling woman holding a personalized love-story book" fill priority sizes="(max-width: 900px) 30vw, 16vw" /></div>
        </div>
      </div>
    </section>
    <section className="love-divider" aria-label="Best-selling gift templates worldwide"><div className="marquee-track">{[0,1,2,3].map(item => <p key={item} aria-hidden={item > 0}><span>Best-Selling</span> <em>Gift Templates Worldwide.</em></p>)}</div></section>
    <section className="chapter couples-chapter" id="couples">
      <div className="chapter-intro reveal">
        <div><span className="eyebrow">FOR COUPLES <Heart size={15} /></span><h2><span className="headline-line">Turn your story</span><em><span className="headline-line">into something</span><span className="headline-line">they can keep.</span></em></h2></div>
        <div className="chapter-note"><p>Personalized gifts for anniversaries, milestones, Valentine’s Day, and just because.</p><a href="https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt&section_id=52763868" target="_blank" rel="noreferrer">Shop all couple gifts <ArrowRight size={15} /></a></div>
      </div>
      <div className="product-grid">{couples.map(product => <article className="product-card" key={product.name}>
        <a className="product-image" href={product.url} target="_blank" rel="noreferrer" aria-label={`Shop ${product.name} on Etsy`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 720px) 100vw, 33vw" />{product.badge && <span className="badge">{product.badge}</span>}</a>
        <div className="product-copy"><h3>{product.name}</h3><p>{product.description}</p><a href={product.url} target="_blank" rel="noreferrer">Shop now <ArrowRight size={15} /></a></div>
      </article>)}</div>
    </section>
    <section className="chapter friends-chapter" id="friends">
      <div className="chapter-intro reveal"><div><span className="eyebrow">FOR FRIENDS <span className="tiny-flower">✽</span></span><h2><span className="headline-line">For the friendship</span><em><span className="headline-line">you never</span><span className="headline-line">want to forget.</span></em></h2></div><div className="chapter-note"><p>Personalized birthday and best-friend gifts made from your favorite memories together.</p><a href="https://www.etsy.com/shop/passionflowstudios/?etsrc=sdt&section_id=52763880" target="_blank" rel="noreferrer">Shop all friend gifts <ArrowRight size={15} /></a></div></div>
      <div className="product-grid">{friends.map(product => <article className="product-card" key={product.name}><a className="product-image" href={product.url} target="_blank" rel="noreferrer" aria-label={`Shop ${product.name} on Etsy`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 720px) 100vw, 33vw" /><span className="badge">{product.badge}</span></a><div className="product-copy"><h3>{product.name}</h3><p>{product.description}</p><a href={product.url} target="_blank" rel="noreferrer">Shop now <ArrowRight size={15} /></a></div></article>)}</div>
    </section>
    <section className="bundles" id="bundles">
      <div className="bundle-intro reveal"><span className="eyebrow muted-label">BUNDLES · OPTIONAL UPGRADES</span><h2>More memories. <em>More ways to give them.</em></h2><p>Can’t choose just one? Get multiple personalized gifts together in one thoughtful collection.</p></div>
      <a className="bundle-card" href="https://www.etsy.com/listing/4486111419/couple-gift-bundle-4-in-1-romantic-gift" target="_blank" rel="noreferrer"><div className="bundle-image"><Image src="/bundles/couple-bundle.png" alt="Couple gift basket with four personalized gifts" fill sizes="(max-width: 700px) 100vw, 34vw"/><div className="bundle-badge">Our bestsellers · all in one</div></div><span><small>4 PERSONALIZED GIFTS</small><strong>Couple Gift Bundle</strong><em>Shop bundle <ArrowRight size={14}/></em></span></a>
      <a className="bundle-card" href="https://www.etsy.com/listing/4474049269/birthday-gift-bundle-for-best-friend?ref=shop_home_active_12&pro=1&dd=1&logging_key=44f6467eee627bfa81818a656e7602f6f8bd33b3%3A4474049269" target="_blank" rel="noreferrer"><div className="bundle-image"><Image src="/bundles/bestfriend-bundle.png" alt="Best-friend birthday gift basket with four personalized gifts" fill sizes="(max-width: 700px) 100vw, 34vw"/><div className="bundle-badge">Our bestsellers · all in one</div></div><span><small>4 PERSONALIZED GIFTS</small><strong>Best Friend Birthday Bundle</strong><em>Shop bundle <ArrowRight size={14}/></em></span></a>
    </section>
    <section className="invites" id="invites">
      <div className="invite-copy reveal"><span className="eyebrow">MAKE THE MOMENT START BEFORE THE PARTY</span><h2><span className="headline-line">Make the invitation</span><em><span className="headline-line">part of the experience.</span></em></h2><p>Interactive birthday and wedding invitations your guests can tap through, with photos, music, RSVP, directions, and all the details.</p><a className="button-primary" href={inviteShop} target="_blank" rel="noreferrer">Explore all invites <ArrowRight size={17}/></a></div>
      <div className="invite-gallery">{invites.map((invite,index) => <a className={`invite-phone phone-${index+1}`} key={invite.name} href={invite.url} target="_blank" rel="noreferrer"><div><Image src={invite.image} alt={invite.name} fill sizes="220px" /></div><span className="invite-name">{invite.name}</span><span className="invite-action">Shop invite <ArrowRight size={12}/></span></a>)}</div>
    </section>
    <section className="about" id="about">
      <div className="about-copy reveal"><span className="eyebrow">WHY CUSTOMERS CHOOSE US</span><h2><span className="headline-line">Made for the moments</span><em><span className="headline-line">you don’t want to forget.</span></em></h2><p>PassionFlow Studio turns the photos, stories, and little details you already love into meaningful gifts that feel completely personal.</p><a className="button-primary about-button" href={shop} target="_blank" rel="noreferrer">See the whole shop <ArrowRight size={17}/></a></div>
      <div className="trust-grid"><div><span className="trust-icon"><Download/></span><span className="trust-copy"><h3>Instant Digital Download</h3></span></div><div><span className="trust-icon"><Pencil/></span><span className="trust-copy"><h3>Beginner-Friendly Canva Editing</h3></span></div><div><span className="trust-icon"><Sparkles/></span><span className="trust-copy"><h3>No Design Experience Needed</h3></span></div><div><span className="trust-icon"><Heart/></span><span className="trust-copy"><h3>Designed to Feel Personal</h3></span></div><div><span className="trust-icon"><CirclePlay/></span><span className="trust-copy"><h3>Step-by-Step Video Tutorial for Every Product</h3></span></div><div><span className="trust-icon"><Gift/></span><span className="trust-copy"><h3>Made for Gifting Moments of Every Occasion</h3></span></div></div>
    </section>
    <section className="contact-band"><div className="reveal"><span className="eyebrow">STAY IN THE FLOW</span><h2>Never miss <em>a gifting moment.</em></h2><p>Get early access to new designs, seasonal gifting ideas, and special offers.</p></div><form className="signup-form" onSubmit={joinEmailList}><div className="signup-fields"><label htmlFor="signup-email">Your email address</label><input id="signup-email" type="email" value={subscriberEmail} onChange={event => { setSubscriberEmail(event.target.value); if (signupStatus !== 'idle') setSignupStatus('idle'); }} placeholder="Your email address" autoComplete="email" required disabled={signupStatus === 'loading'}/><button type="submit" disabled={signupStatus === 'loading'}>{signupStatus === 'loading' ? 'Joining…' : 'Join the list'}</button></div><p className={`signup-message ${signupStatus}`}>{signupStatus === 'success' ? 'Thank you! Stay tuned, you will now receive discounts on your email :)' : signupStatus === 'error' ? 'Something went wrong. Please try again in a moment.' : 'Join for new designs, gifting ideas, and subscriber-only discounts.'}</p></form></section>
    <footer>
      <div className="footer-brand"><a href="#top" className="wordmark"><span>PASSIONFLOW</span><small>STUDIO</small></a><p>Digital gifts that turn memories into something they’ll keep forever.</p></div>
      <div className="footer-links"><strong>QUICK LINKS</strong>{nav.slice(0,4).map(([label,href]) => <a key={href} href={href}>{label}<ArrowRight size={13}/></a>)}</div>
      <div className="footer-links"><strong>LET’S CONNECT</strong><a href="https://instagram.com/passionflow.studio" target="_blank" rel="noreferrer">◎ Instagram</a><a href="https://www.threads.com/@passionflow.studio" target="_blank" rel="noreferrer">@ Threads</a><a href="https://tiktok.com/@passionflow.studio" target="_blank" rel="noreferrer">♪ TikTok</a><a href="https://www.pinterest.com/passionflowstudios/?invite_code=9d3dc126d62c4b23afd819d50f33a377&sender=1142084924162323774" target="_blank" rel="noreferrer">◉ Pinterest</a></div>
      <div className="footer-note"><Gift/><p>Made with heart,<br/>for the people you love.</p></div>
      <div className="copyright"><span>© 2026 PassionFlow Studio. All rights reserved.</span><span><a href="mailto:passionflow.studio@gmail.com">Email</a><a href={shop} target="_blank" rel="noreferrer">Etsy Shop</a></span></div>
    </footer>
  </main>;
}
