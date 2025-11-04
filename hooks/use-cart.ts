'use client';

import { useEffect, useState } from 'react';
import type { CartItem } from '@/lib/cart';
import { readCart, subscribe } from '@/lib/cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
    const unsubscribe = subscribe(setItems);
    const handler = () => setItems(readCart());
    window.addEventListener('storage', handler);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handler);
    };
  }, []);

  const totalCents = items.reduce((acc, item) => acc + item.priceCents * item.qty, 0);

  return { items, totalCents };
}
