'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics/track';
import type { CommerceItem } from '@/lib/analytics/events';
import { attributionToCartAttributes, captureAttribution, getAttribution } from '@/lib/attribution';
import { addLines, CartError, createCart, fetchCart, publicCartToken, removeLines, updateAttributes, updateLines } from '@/lib/shopify/cart';
import type { Cart, CartAttribute, CartLine, CartWarning } from '@/lib/shopify/types';

const CART_ID_KEY = 'pf_cart_id';

// What a product page knows about the item it's selling. `sellingPlanId`
// makes the line a subscription (All Access).
export type PurchasableItem = Omit<CommerceItem, 'quantity' | 'price' | 'currency'> & { sellingPlanId?: string };

const toLineInput = (item: PurchasableItem, quantity = 1) => ({
  merchandiseId: item.variantId,
  quantity,
  ...(item.sellingPlanId ? { sellingPlanId: item.sellingPlanId } : {}),
});

type CartContextValue = {
  cart: Cart | null;
  ready: boolean;
  isOpen: boolean;
  busy: boolean;
  pendingVariantId: string | null;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
  addItem: (item: PurchasableItem, quantity?: number) => Promise<boolean>;
  buyNow: (item: PurchasableItem) => Promise<boolean>;
  upgradeToBundle: (fromVariantId: string, bundle: PurchasableItem) => Promise<boolean>;
  updateQuantity: (line: CartLine, quantity: number) => Promise<void>;
  removeLine: (line: CartLine) => Promise<void>;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
};

const storage = {
  get: () => { try { return localStorage.getItem(CART_ID_KEY); } catch { return null; } },
  set: (id: string) => { try { localStorage.setItem(CART_ID_KEY, id); } catch { /* private mode */ } },
  clear: () => { try { localStorage.removeItem(CART_ID_KEY); } catch { /* private mode */ } },
};

export const lineToItem = (line: CartLine, quantity = line.quantity): CommerceItem => ({
  productId: line.merchandise.product.id,
  variantId: line.merchandise.id,
  handle: line.merchandise.product.handle,
  title: line.merchandise.product.title,
  price: Number(line.cost.amountPerQuantity.amount),
  currency: line.cost.amountPerQuantity.currencyCode,
  quantity,
});

const findLine = (cart: Cart, variantId: string) => cart.lines.find(line => line.merchandise.id === variantId);

const sameAttributes = (cart: Cart, wanted: CartAttribute[]) =>
  wanted.every(({ key, value }) => cart.attributes.some(attr => attr.key === key && attr.value === value));

function explain(error: unknown, warnings: CartWarning[] = []) {
  if (warnings.length) return warnings.map(w => w.message).join(' ');
  if (error instanceof CartError) {
    if (error.code === 'network') return 'We couldn’t reach the store. Check your connection and try again.';
    return error.message || 'The store couldn’t update your cart. Please try again.';
  }
  return 'Something went wrong updating your cart. Please try again.';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingVariantId, setPendingVariantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cartRef = useRef<Cart | null>(null);

  const commit = useCallback((next: Cart | null) => {
    cartRef.current = next;
    setCart(next);
    if (next) storage.set(next.id);
    else storage.clear();
  }, []);

  // Re-read the cart from Shopify: picks up price changes and clears carts that
  // no longer exist (e.g. converted to an order at checkout).
  const refresh = useCallback(async () => {
    const id = storage.get();
    if (!id) return commit(null);
    try {
      commit(await fetchCart(id));
    } catch {
      // Keep the last confirmed cart on a transient network failure.
    }
  }, [commit]);

  useEffect(() => {
    captureAttribution();
    (async () => {
      await refresh();
      // Keep attribution on an existing cart current (e.g. returning from a new ad click).
      const current = cartRef.current;
      const wanted = attributionToCartAttributes(getAttribution());
      if (current && wanted.length && !sameAttributes(current, wanted)) {
        try { commit((await updateAttributes(current.id, wanted)).cart); } catch { /* non-blocking */ }
      }
      setReady(true);
    })();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh, commit]);

  const addItem = useCallback(async (item: PurchasableItem, quantity = 1) => {
    setBusy(true);
    setPendingVariantId(item.variantId);
    setError(null);
    const previousQuantity = cartRef.current ? findLine(cartRef.current, item.variantId)?.quantity ?? 0 : 0;
    const lines = [toLineInput(item, quantity)];
    const attributes = attributionToCartAttributes(getAttribution());
    let warnings: CartWarning[] = [];
    try {
      let result;
      try {
        result = cartRef.current ? await addLines(cartRef.current.id, lines) : await createCart(lines, attributes);
      } catch (error) {
        // Stale or expired cart: start a fresh one with this item.
        if (error instanceof CartError && error.code === 'not_found' && cartRef.current) result = await createCart(lines, attributes);
        else throw error;
      }
      warnings = result.warnings;
      const line = findLine(result.cart, item.variantId);
      // Only a line Shopify actually increased counts as success.
      if (!line || line.quantity < previousQuantity + quantity) throw new CartError('This item couldn’t be added to your cart.', 'unavailable');
      commit(result.cart);
      setIsOpen(true);
      track({ name: 'product_added_to_cart', item: lineToItem(line, quantity), cartToken: publicCartToken(result.cart.id), source: 'add_to_cart' });
      return true;
    } catch (error) {
      setError(explain(error, warnings));
      return false;
    } finally {
      setBusy(false);
      setPendingVariantId(null);
    }
  }, [commit]);

  // Buy Now uses its own single-item cart so the shopper's main cart is untouched.
  const buyNow = useCallback(async (item: PurchasableItem) => {
    setBusy(true);
    setPendingVariantId(item.variantId);
    setError(null);
    let warnings: CartWarning[] = [];
    try {
      const result = await createCart([toLineInput(item)], attributionToCartAttributes(getAttribution()));
      warnings = result.warnings;
      const line = findLine(result.cart, item.variantId);
      if (!line) throw new CartError('This item is currently unavailable.', 'unavailable');
      if (!result.cart.checkoutUrl) throw new CartError('Checkout is unavailable right now. Please try again.', 'rejected');
      const cartToken = publicCartToken(result.cart.id);
      const confirmed = lineToItem(line);
      track({ name: 'product_added_to_cart', item: confirmed, cartToken, source: 'buy_now' });
      track({ name: 'checkout_started', items: [confirmed], value: Number(result.cart.cost.totalAmount.amount), currency: result.cart.cost.totalAmount.currencyCode, cartToken, source: 'buy_now' });
      window.location.assign(result.cart.checkoutUrl);
      return true;
    } catch (error) {
      setError(explain(error, warnings));
      setBusy(false);
      setPendingVariantId(null);
      return false;
    }
  }, []);

  // Swap a single product already in the cart for its bundle in one Shopify
  // mutation, so the shopper never pays for both.
  const upgradeToBundle = useCallback(async (fromVariantId: string, bundle: PurchasableItem) => {
    const current = cartRef.current;
    const fromLine = current ? findLine(current, fromVariantId) : undefined;
    if (!current || !fromLine) return addItem(bundle);
    setBusy(true);
    setPendingVariantId(bundle.variantId);
    setError(null);
    try {
      const result = await updateLines(current.id, [{ id: fromLine.id, merchandiseId: bundle.variantId, quantity: 1 }]);
      const bundleLine = findLine(result.cart, bundle.variantId);
      if (!bundleLine || findLine(result.cart, fromVariantId)) throw new CartError('We couldn’t upgrade your cart. Please try again.', 'rejected');
      commit(result.cart);
      setIsOpen(true);
      const cartToken = publicCartToken(result.cart.id);
      track({ name: 'product_removed_from_cart', item: lineToItem(fromLine), cartToken });
      track({ name: 'product_added_to_cart', item: lineToItem(bundleLine, 1), cartToken, source: 'bundle_upgrade' });
      return true;
    } catch (error) {
      if (error instanceof CartError && error.code === 'not_found') commit(null);
      setError(explain(error));
      return false;
    } finally {
      setBusy(false);
      setPendingVariantId(null);
    }
  }, [addItem, commit]);

  const updateQuantity = useCallback(async (line: CartLine, quantity: number) => {
    const current = cartRef.current;
    if (!current) return;
    setBusy(true);
    setError(null);
    try {
      const result = quantity <= 0 ? await removeLines(current.id, [line.id]) : await updateLines(current.id, [{ id: line.id, quantity }]);
      commit(result.cart);
      const delta = quantity - line.quantity;
      const cartToken = publicCartToken(result.cart.id);
      if (delta < 0) track({ name: 'product_removed_from_cart', item: lineToItem(line, -delta), cartToken });
      if (delta > 0) track({ name: 'product_added_to_cart', item: lineToItem(line, delta), cartToken, source: 'add_to_cart' });
    } catch (error) {
      if (error instanceof CartError && error.code === 'not_found') commit(null);
      setError(explain(error));
    } finally {
      setBusy(false);
    }
  }, [commit]);

  const removeLine = useCallback((line: CartLine) => updateQuantity(line, 0), [updateQuantity]);

  const checkout = useCallback(async () => {
    const current = cartRef.current;
    if (!current || current.totalQuantity === 0) return;
    setBusy(true);
    setError(null);
    try {
      // Confirm the cart still exists and has current prices before handing off.
      let confirmed = await fetchCart(current.id);
      if (!confirmed) {
        commit(null);
        throw new CartError('Your cart expired. Please add your items again.', 'not_found');
      }
      const wanted = attributionToCartAttributes(getAttribution());
      if (wanted.length && !sameAttributes(confirmed, wanted)) confirmed = (await updateAttributes(confirmed.id, wanted)).cart;
      commit(confirmed);
      track({ name: 'checkout_started', items: confirmed.lines.map(line => lineToItem(line)), value: Number(confirmed.cost.totalAmount.amount), currency: confirmed.cost.totalAmount.currencyCode, cartToken: publicCartToken(confirmed.id), source: 'cart' });
      window.location.assign(confirmed.checkoutUrl);
    } catch (error) {
      setError(explain(error));
      setBusy(false);
    }
  }, [commit]);

  const openCart = useCallback(() => {
    setIsOpen(true);
    refresh();
  }, [refresh]);

  // Report cart views when the drawer opens with items in it.
  useEffect(() => {
    const current = cartRef.current;
    if (!isOpen || !current || current.totalQuantity === 0) return;
    track({ name: 'cart_viewed', items: current.lines.map(line => lineToItem(line)), value: Number(current.cost.totalAmount.amount), currency: current.cost.totalAmount.currencyCode, cartToken: publicCartToken(current.id) });
  }, [isOpen]);

  const value = useMemo<CartContextValue>(() => ({
    cart, ready, isOpen, busy, pendingVariantId, error,
    openCart,
    closeCart: () => setIsOpen(false),
    clearError: () => setError(null),
    addItem, buyNow, upgradeToBundle, updateQuantity, removeLine, checkout,
  }), [cart, ready, isOpen, busy, pendingVariantId, error, openCart, addItem, buyNow, upgradeToBundle, updateQuantity, removeLine, checkout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
