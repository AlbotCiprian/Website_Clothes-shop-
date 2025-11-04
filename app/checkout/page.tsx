'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function CheckoutPage() {
  const { items, totalCents } = useCart();
  const currency = items[0]?.currency ?? 'MDL';

  const steps = useMemo(
    () => [
      { label: 'Cart', active: false },
      { label: 'Checkout', active: true },
      { label: 'MAIB Secure Pay', active: false }
    ],
    []
  );

  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">Blueprint Checkout</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Finish in under 90 seconds</h1>
          <p className="mt-2 text-sm text-slate-600">
            Pay securely with MAIB eComm. We instantly create your Nova Poshta shipment once payment is approved.
          </p>
          <ol className="mt-4 flex items-center gap-4 text-xs uppercase tracking-wide text-slate-500">
            {steps.map((step, index) => (
              <li key={step.label} className={`flex items-center gap-2 ${step.active ? 'text-brand' : ''}`}>
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${step.active ? 'border-brand bg-brand text-white' : 'border-slate-200 text-slate-500'}`}>
                  {index + 1}
                </span>
                {step.label}
                {index < steps.length - 1 ? <span className="text-slate-300">→</span> : null}
              </li>
            ))}
          </ol>
        </header>
        <CheckoutForm items={items} />
      </div>
      <aside className="space-y-5">
        <div className="sticky top-28 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
            <Link href="/cart" className="text-xs font-semibold uppercase tracking-wide text-brand">
              Edit cart
            </Link>
          </div>
          {!items.length ? (
            <p className="text-sm text-slate-500">
              Cart is empty. <Link href="/shop" className="underline">Browse the collection.</Link>
            </p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600">
              {items.map((item, index) => (
                <li key={`${item.slug}-${index}`} className="flex justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Qty × {item.qty}
                      {item.size ? ` · Size ${item.size}` : ''}
                      {item.color ? ` · Color ${item.color}` : ''}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900">{formatCurrency(item.priceCents * item.qty, item.currency)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(totalCents, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery</span>
              <span>Calculated after TTN</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Total due</span>
              <span>{formatCurrency(totalCents, currency)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Payments are processed via MAIB 3D Secure. Once approved, we email you a receipt and Nova Poshta tracking number.
          </p>
        </div>
      </aside>
    </section>
  );
}
