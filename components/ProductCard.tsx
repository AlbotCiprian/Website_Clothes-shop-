'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/AddToCartButton';

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
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <Link href={productHref} className="relative block aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0] ?? '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <header className="space-y-1">
          <Link href={productHref} className="text-base font-medium text-slate-900 hover:underline">
            {product.name}
          </Link>
          <p className="text-sm text-slate-500">{(product.priceCents / 100).toFixed(2)} {product.currency}</p>
        </header>
        <div className="flex flex-wrap gap-3 text-xs">
          <div>
            <span className="font-medium text-slate-700">Colour:</span>
            <div className="mt-1 flex gap-1">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-6 w-6 rounded-full border ${
                    selectedColor === color ? 'border-slate-900 ring-2 ring-slate-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select colour ${color}`}
                  title={color}
                />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">{selectedColor}</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">Size:</span>
            <div className="mt-1 flex gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[2.5rem] rounded-full border px-2 py-1 font-medium transition ${
                    selectedSize === size
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <AddToCartButton
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          className="mt-auto"
        />
      </div>
    </article>
  );
}
