import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { HomeCard } from '@/lib/home-content';

export function ProductCard({ product }: { product: HomeCard }) {
  return (
    <article className="product-card">
      <a className="product-image" href={product.url} target="_blank" rel="noreferrer" aria-label={`Shop ${product.name} on Etsy`}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 680px) 33vw, 33vw" />
        {product.badge && <span className="badge">{product.badge}</span>}
      </a>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <a href={product.url} target="_blank" rel="noreferrer">Shop now <ArrowRight size={15} /></a>
      </div>
    </article>
  );
}
