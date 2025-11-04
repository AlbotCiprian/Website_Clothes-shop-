'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FiltersProps {
  sizes: string[];
  colors: string[];
}

const priceRanges = [
  { label: 'Under 1000 MDL', min: 0, max: 100000 },
  { label: '1000 - 2000 MDL', min: 100000, max: 200000 },
  { label: '2000 - 3500 MDL', min: 200000, max: 350000 },
  { label: 'Above 3500 MDL', min: 350000, max: 0 }
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New drops' },
  { value: 'price_asc', label: 'Price: Low to high' },
  { value: 'price_desc', label: 'Price: High to low' }
];

export function Filters({ sizes, colors }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedSize = searchParams.get('size') ?? '';
  const selectedColor = searchParams.get('color') ?? '';
  const selectedSort = searchParams.get('sort') ?? 'featured';
  const priceMin = Number(searchParams.get('price_min') ?? '0');
  const priceMax = Number(searchParams.get('price_max') ?? '0');

  const activeFilters = useMemo(() => {
    const tokens: string[] = [];
    if (selectedSize) tokens.push(`Size ${selectedSize}`);
    if (selectedColor) tokens.push(`Color ${selectedColor}`);
    if (priceMin > 0 || priceMax > 0) tokens.push('Price');
    return tokens;
  }, [selectedColor, selectedSize, priceMin, priceMax]);

  const applyParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams, startTransition]
  );

  const onClear = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router, startTransition]);

  const FilterContent = (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              size="sm"
              variant={selectedSize === size ? 'default' : 'outline'}
              onClick={() => applyParam({ size: selectedSize === size ? null : size })}
              className="rounded-full"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => applyParam({ color: selectedColor === color ? null : color })}
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                selectedColor === color
                  ? 'border-brand bg-brand text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              {color}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {priceRanges.map((range) => (
            <Button
              key={range.label}
              variant={priceMin === range.min && priceMax === range.max ? 'default' : 'outline'}
              className="justify-start"
              onClick={() =>
                applyParam({
                  price_min: priceMin === range.min ? null : String(range.min),
                  price_max: priceMax === range.max ? null : String(range.max)
                })
              }
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">Sort</span>
        <select
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          value={selectedSort}
          onChange={(event) => applyParam({ sort: event.target.value })}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button variant="ghost" className="w-full" onClick={onClear}>
        Reset filters
      </Button>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <Badge variant="outline" className="flex items-center gap-2 rounded-full border-dashed border-slate-300 bg-slate-50 text-slate-600">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </Badge>
        {activeFilters.map((token) => (
          <span key={token} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {token}
          </span>
        ))}
        {activeFilters.length === 0 && (
          <span className="text-xs text-slate-500">Refine by color, size, price</span>
        )}
      </div>
      <div className="hidden max-w-xl flex-1 gap-6 sm:flex">
        {FilterContent}
      </div>
      <div className="flex items-center gap-2 sm:hidden">
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Open filters" className="rounded-full">
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem]">
            <div className="space-y-6 overflow-y-auto pb-8">{FilterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
