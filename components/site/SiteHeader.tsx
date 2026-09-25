'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { etsy, nav } from '@/lib/site-config';
import { Wordmark } from './Wordmark';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Wordmark />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <a className="shop-link desktop-shop" href={etsy.shop} target="_blank" rel="noreferrer">Shop Etsy <ArrowRight size={16} /></a>
    </header>
  );
}
