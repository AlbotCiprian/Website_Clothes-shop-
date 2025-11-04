import Link from 'next/link';
import type { ReactNode } from 'react';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/shop" className="text-lg font-semibold tracking-tight text-slate-900">
            blueprint
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/shop" className="hover:text-slate-900">
              Shop
            </Link>
            <Link href="/cart" className="hover:text-slate-900">
              Cart
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 text-sm text-slate-500 sm:px-6">
          © {new Date().getFullYear()} Blueprint Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
