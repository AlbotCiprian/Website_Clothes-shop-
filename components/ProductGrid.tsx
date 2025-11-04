'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Product } from '@prisma/client';
import { ProductCard } from '@/components/ProductCard';
import { EXPERIMENT_PLP_GRID, PRODUCT_PAGE_SIZE } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  initialProducts: Product[];
  initialHasMore: boolean;
  searchParams: Record<string, string>;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  hasMore: boolean;
}

export function ProductGrid({ initialProducts, initialHasMore, searchParams }: ProductGridProps) {
  const queryParams = useMemo(() => ({ ...searchParams }), [searchParams]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery<ProductsResponse>({
    queryKey: ['products', queryParams],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams(queryParams);
      params.set('page', String(pageParam));
      const response = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return (await response.json()) as ProductsResponse;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialData: {
      pages: [
        {
          products: initialProducts,
          hasMore: initialHasMore,
          page: 0
        }
      ],
      pageParams: [0]
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const products = query.data?.pages.flatMap((page) => page.products) ?? [];

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No products yet. Seed the database to preview the storefront.
      </div>
    );
  }

  const gridClass = EXPERIMENT_PLP_GRID
    ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-4'
    : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3';

  return (
    <div className="space-y-8">
      <div className={gridClass} data-experiment={EXPERIMENT_PLP_GRID ? 'plp-grid' : 'control'}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {query.isFetchingNextPage &&
          Array.from({ length: PRODUCT_PAGE_SIZE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-full rounded-3xl border border-slate-200 bg-slate-100/60 animate-pulse"
              aria-hidden
            />
          ))}
      </div>
      <div ref={sentinelRef} className={cn('h-10 w-full', query.hasNextPage ? 'opacity-100' : 'opacity-0')} aria-hidden />
    </div>
  );
}
