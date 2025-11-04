'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Search', icon: Search },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
  { href: '/account', label: 'Account', icon: User }
];

export function MobileNav() {
  const pathname = usePathname();
  const { items: cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 rounded-full border border-slate-200 bg-white/90 backdrop-blur px-4 py-2 shadow-soft sm:hidden" aria-label="Primary">
      <ul className="flex items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  active ? 'text-brand' : 'text-slate-500'
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {item.href === '/cart' && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
