import Image from 'next/image';
import { heroGrid } from '@/lib/home-content';

type Props = {
  // Center tile: small caps lead-in, then the wine-italic line.
  lead: string;
  message: string;
  priority?: boolean;
  sizes?: string;
};

// The 3×3 grid of real gifts with a gradient message tile in the center
// (homepage hero, All Access). Same styling everywhere via .hero-grid.
export function GiftGrid({ lead, message, priority = false, sizes = '(max-width: 680px) 32vw, (max-width: 1100px) 27vw, 216px' }: Props) {
  return (
    <div className="hero-grid">
      {heroGrid.map((tile, index) => tile === 'message'
        ? <div className="hero-grid-message" key="message"><span>{lead}</span><em>{message}</em></div>
        : <div className="hero-grid-tile" key={tile.src}><Image src={tile.src} alt={tile.alt} fill priority={priority && index < 3} sizes={sizes} /></div>)}
    </div>
  );
}
