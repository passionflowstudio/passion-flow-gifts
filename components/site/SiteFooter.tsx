import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { brand, etsy, nav, socials } from '@/lib/site-config';
import { Wordmark } from './Wordmark';

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><Wordmark /><p>Digital gifts that turn memories into something they’ll keep forever.</p></div>
      <div className="footer-links">
        <strong>QUICK LINKS</strong>
        {nav.slice(0, 4).map(item => <Link key={item.href} href={item.href}>{item.label}<ArrowRight size={13} /></Link>)}
      </div>
      <div className="footer-links">
        <strong>LET’S CONNECT</strong>
        {socials.map(social => <a key={social.href} href={social.href} target="_blank" rel="noreferrer">{social.label}</a>)}
      </div>
      <div className="footer-note"><Gift /><p>Made with heart,<br />for the people you love.</p></div>
      <div className="copyright">
        <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
        <span><a href={`mailto:${brand.email}`}>Email</a><a href={etsy.shop} target="_blank" rel="noreferrer">Etsy Shop</a></span>
      </div>
    </footer>
  );
}
