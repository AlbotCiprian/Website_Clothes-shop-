'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartItem } from '@/lib/cart';
import { readCart, removeFromCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const handleRemove = (index: number) => {
    removeFromCart(index);
    setItems(readCart());
  };

  const subtotal = items.reduce((total, item) => total + item.priceCents * item.qty, 0);
  const currency = items[0]?.currency ?? 'MDL';

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Your cart</h1>
        <p className="text-sm text-slate-600">Checkout in a few taps — no account needed.</p>
      </header>
      {!items.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cart is empty. Browse the <Link href="/shop" className="underline">latest drops</Link>.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={`${item.slug}-${index}`} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-base font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.color ? `Colour: ${item.color}` : null}
                    {item.color && item.size ? ' · ' : null}
                    {item.size ? `Size: ${item.size}` : null}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatCurrency(item.priceCents, item.currency)} × {item.qty}
                  </p>
                </div>
                <button className="text-xs font-semibold text-rose-600" onClick={() => handleRemove(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{formatCurrency(subtotal, currency)}</span>
            </div>
            <Link
              href="/checkout"
              className="flex h-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
