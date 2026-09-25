'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button type="button" className="cart-button" onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
      <ShoppingBag size={20} strokeWidth={1.6} />
      {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
    </button>
  );
}
