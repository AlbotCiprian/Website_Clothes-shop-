import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { MobileNav } from '@/components/MobileNav';
import { Separator } from '@/components/ui/separator';
import { QueryProvider } from '@/components/providers/query-provider';
import { AssistantChat } from '@/components/AssistantChat';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand">
        Skip to content
      </a>
      <QueryProvider>
        <SiteHeader />
        <main id="main" className="container flex-1 pb-32 pt-10">
          <div className="mx-auto w-full max-w-screen-xl space-y-12">{children}</div>
        </main>
      </QueryProvider>
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-12 backdrop-blur">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="space-y-4">
              <Link href="/" className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
                Blueprint Athletics
              </Link>
              <p className="max-w-sm text-sm text-slate-600">
                Built for Instagram-first launches. Pay with MAIB eComm. Delivered fast via Nova Poshta lockers or couriers.
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/collections/new" className="transition hover:text-brand">New releases</Link></li>
                <li><Link href="/stories" className="transition hover:text-brand">Stories</Link></li>
                <li><Link href="/faq" className="transition hover:text-brand">FAQ</Link></li>
              </ul>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="transition hover:text-brand">Shipping &amp; returns</Link></li>
                <li><Link href="/contact" className="transition hover:text-brand">Contact</Link></li>
                <li><Link href="/privacy" className="transition hover:text-brand">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Blueprint Athletics. All rights reserved.</p>
        </div>
      </footer>
      <MobileNav />
      <AssistantChat />
    </div>
  );
}
