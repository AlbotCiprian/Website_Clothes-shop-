'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  currency: string;
  thumb: string | null;
}

export function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const topResult = useMemo(() => results[0], [results]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Search products">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full rounded-b-3xl border-b bg-white p-8 sm:mx-auto sm:max-w-3xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900">Search</h2>
            {topResult && (
              <Button asChild variant="ghost" className="text-sm font-semibold text-brand">
                <Link href={`/product/${topResult.slug}`} onClick={() => setOpen(false)}>
                  View top result
                </Link>
              </Button>
            )}
          </div>
          <Input
            autoFocus
            placeholder="Search leggings, hoodies, accessories..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search catalogue"
          />
          <div className="space-y-2">
            {loading && <p className="text-sm text-slate-500">Searching...</p>}
            {!loading && query && results.length === 0 && (
              <p className="text-sm text-slate-500">No products found. Try a different keyword.</p>
            )}
            <ul className="space-y-3">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-brand-accent"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-semibold text-slate-900">{product.name}</span>
                    <span className="text-sm text-slate-500">{formatCurrency(product.priceCents, product.currency)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
