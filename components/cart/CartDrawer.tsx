'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, Download, X } from 'lucide-react';
import { formatMoney } from '@/lib/money';
import { slugForHandle } from '@/lib/catalog';
import { useCart } from './CartProvider';

export function CartDrawer() {
  const { cart, isOpen, closeCart, busy, error, clearError, removeLine, checkout } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Native <dialog> gives focus trapping, Esc to close and inert background.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <dialog
      ref={dialogRef}
      className="cart-drawer"
      aria-labelledby="cart-title"
      onClose={closeCart}
      onClick={event => { if (event.target === dialogRef.current) closeCart(); }}
    >
      <div className="cart-panel">
        <header className="cart-head">
          <h2 id="cart-title">Your cart {cart && cart.totalQuantity > 0 && <span>({cart.totalQuantity})</span>}</h2>
          <button type="button" className="cart-icon-button" onClick={closeCart} aria-label="Close cart"><X size={20} /></button>
        </header>

        {error && (
          <div className="cart-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={clearError} aria-label="Dismiss message"><X size={14} /></button>
          </div>
        )}

        {isEmpty ? (
          <div className="cart-empty">
            <p className="cart-empty-title">Your cart is empty.</p>
            <p>Find a gift made from your favorite memories.</p>
            <Link className="button-primary" href="/#couples" onClick={closeCart}>Shop gifts <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines" aria-busy={busy}>
              {lines.map(line => {
                const image = line.merchandise.image;
                const href = `/products/${slugForHandle(line.merchandise.product.handle)}`;
                return (
                  <li key={line.id} className="cart-line">
                    <Link href={href} className="cart-line-image" onClick={closeCart}>
                      {image && <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill sizes="84px" />}
                    </Link>
                    <div className="cart-line-body">
                      <Link href={href} className="cart-line-title" onClick={closeCart}>{line.merchandise.product.title}</Link>
                      <span className="cart-line-meta"><Download size={12} /> Digital download</span>
                      {!line.merchandise.availableForSale && <span className="cart-line-warning">No longer available — please remove.</span>}
                      <div className="cart-line-controls">
                        <button type="button" className="cart-remove" onClick={() => removeLine(line)} disabled={busy}>Remove</button>
                      </div>
                    </div>
                    <strong className="cart-line-price">{formatMoney(line.cost.totalAmount)}</strong>
                  </li>
                );
              })}
            </ul>

            <div className="cart-foot">
              <div className="cart-subtotal"><span>Subtotal</span><strong>{cart && formatMoney(cart.cost.subtotalAmount)}</strong></div>
              <p className="cart-note">Instant digital delivery. Taxes and discounts are calculated at checkout.</p>
              <button type="button" className="button-primary cart-checkout" onClick={checkout} disabled={busy || lines.some(line => !line.merchandise.availableForSale)}>
                {busy ? 'Updating…' : 'Secure checkout'} {!busy && <ArrowRight size={16} />}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
