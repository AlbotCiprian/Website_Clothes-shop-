'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import type { CartItem } from '@/lib/cart';
import { readCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
  const currency = items[0]?.currency ?? 'MDL';

  return (
    <section className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Fast checkout</h1>
          <p className="text-sm text-slate-600">Enter delivery details and pay securely via MAIB eComm.</p>
        </header>
        <CheckoutForm />
      </div>
      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        {!items.length ? (
          <p className="text-sm text-slate-500">
            Cart is empty. <Link href="/shop" className="underline">Browse the collection.</Link>
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {items.map((item, index) => (
              <li key={`${item.slug}-${index}`} className="flex justify-between">
                <span>
                  {item.name}
                  {item.size ? ` · ${item.size}` : ''}
                  {item.color ? ` · ${item.color}` : ''}
                </span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(item.priceCents * item.qty, item.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
        <p className="text-xs text-slate-500">
          After successful payment you will receive a Nova Poshta tracking number instantly.
        </p>
      </aside>
    </section>
  );
}
