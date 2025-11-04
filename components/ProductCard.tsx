'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const productHref = useMemo(() => {
    const params = new URLSearchParams({
      color: selectedColor ?? '',
      size: selectedSize ?? ''
    });
    return `/product/${product.slug}?${params.toString()}`;
  }, [product.slug, selectedColor, selectedSize]);

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft/0 transition-shadow hover:shadow-soft"
    >
      <Link href={productHref} className="relative block aspect-[3/4] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Image
            src={product.images[0] ?? '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 33vw, 100vw"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10 opacity-0 transition group-hover:opacity-100" />
        <Badge className="absolute left-4 top-4 bg-black/70 text-white shadow-soft">New drop</Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <header className="space-y-1.5">
          <Link href={productHref} className="font-display text-lg font-semibold text-slate-900 transition hover:text-brand">
            {product.name}
          </Link>
          <p className="text-sm text-slate-500">{formatCurrency(product.priceCents, product.currency)}</p>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wide text-slate-500">Color</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'h-7 w-7 rounded-full border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
                    selectedColor === color && 'border-brand ring-2 ring-brand/50'
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wide text-slate-500">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'min-w-[2.5rem] rounded-full border px-3 py-1 text-xs font-semibold transition',
                    selectedSize === size ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-slate-50 text-slate-600'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            href={productHref}
            className="text-sm font-semibold uppercase tracking-wide text-slate-500 transition hover:text-brand"
          >
            View details
          </Link>
          <AddToCartButton
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            className="flex-1"
          />
        </div>
      </div>
    </motion.article>
  );
}
