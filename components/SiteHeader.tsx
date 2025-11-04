'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchDrawer } from '@/components/SearchDrawer';
import { CartDrawer } from '@/components/CartDrawer';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections/men', label: 'Men' },
  { href: '/collections/women', label: 'Women' },
  { href: '/stories', label: 'Stories' }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="sm:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="max-w-xs rounded-r-3xl">
              <nav className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  className="block rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-accent hover:text-brand"
                >
                  Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-tight text-slate-900">
            <Flame className="h-5 w-5 text-brand-accent" />
            Blueprint
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname.startsWith(link.href)
                    ? 'text-slate-900'
                    : 'text-slate-600 transition hover:text-slate-900'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchDrawer />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
