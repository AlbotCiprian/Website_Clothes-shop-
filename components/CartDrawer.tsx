'use client';

import { useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const { items, totalCents } = useCart();
  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.qty, 0), [items]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="View cart">
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="grid max-w-lg gap-6 rounded-l-3xl">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Your cart</h2>
          <p className="text-sm text-slate-500">Fast checkout via MAIB eComm. Delivery anywhere via Nova Poshta.</p>
        </div>
        <ScrollArea className="h-[55vh] rounded-2xl border border-slate-100 p-4">
          <ul className="space-y-4">
            {items.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
                Your cart is empty. Explore the drops and add your favourites.
              </li>
            ) : (
              items.map((item, index) => (
                <li key={`${item.slug}-${index}`} className="flex items-start justify-between gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {item.color ? `Color ${item.color}` : null}
                      {item.color && item.size ? ' · ' : ''}
                      {item.size ? `Size ${item.size}` : null}
                    </p>
                    <p className="text-xs text-slate-500">Qty × {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.priceCents * item.qty, item.currency)}</p>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="text-base font-semibold text-slate-900">{formatCurrency(totalCents)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Secure 3DS payment. Taxes included. Shipping calculated at checkout.</p>
          <Button asChild className="mt-4 w-full">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
