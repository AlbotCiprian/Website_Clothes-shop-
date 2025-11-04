'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@prisma/client';
import { ProductCard } from '@/components/ProductCard';

const STORAGE_KEY = 'blueprint-recently-viewed';

function readList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

interface RecentlyViewedProps {
  currentSlug: string;
}

export function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = readList().filter(Boolean);
    const updated = Array.from(new Set([...existing.filter((slug) => slug !== currentSlug), currentSlug])).slice(-8);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const slugs = updated.filter((slug) => slug !== currentSlug).slice(-4);
    if (!slugs.length) return;

    const params = new URLSearchParams();
    slugs.forEach((slug) => params.append('slug', slug));

    fetch(`/api/products/recent?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, [currentSlug]);

  if (!products.length) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-slate-900">Recently viewed</h2>
        <p className="text-sm text-slate-500">Pick up where you left off across Instagram drops.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
