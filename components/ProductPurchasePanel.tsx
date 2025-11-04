'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/AddToCartButton';
import { StickyATC } from '@/components/StickyATC';
import { formatCurrency } from '@/lib/utils';

interface ProductPurchasePanelProps {
  product: Product;
  initialColor: string;
  initialSize: string;
}

export function ProductPurchasePanel({ product, initialColor, initialSize }: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const priceLabel = useMemo(
    () => formatCurrency(product.priceCents, product.currency),
    [product.priceCents, product.currency]
  );

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-lg font-semibold text-slate-800">{priceLabel}</p>
      </div>
      {product.description ? <p className="text-sm text-slate-600">{product.description}</p> : null}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Color</p>
          <div className="mt-2 flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`h-9 w-9 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
                  selectedColor === color ? 'border-brand ring-2 ring-brand/40' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Selected: {selectedColor}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[2.75rem] rounded-full border px-3 py-1 text-sm font-semibold transition ${
                  selectedSize === size
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Swipe for size chart — true to size.</p>
        </div>
      </div>
      <AddToCartButton
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        className="w-full"
      />
      <StickyATC product={product} selectedColor={selectedColor} selectedSize={selectedSize} />
    </div>
  );
}
