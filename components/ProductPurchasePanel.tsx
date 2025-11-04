'use client';

import { useState } from 'react';
import type { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/AddToCartButton';

interface ProductPurchasePanelProps {
  product: Product;
  initialColor: string;
  initialSize: string;
}

export function ProductPurchasePanel({ product, initialColor, initialSize }: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState(initialSize);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-sm">
        <p className="font-medium text-slate-700">Colour</p>
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`h-8 w-8 rounded-full border ${
                selectedColor === color ? 'border-slate-900 ring-2 ring-slate-900' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select colour ${color}`}
              title={color}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500">Selected: {selectedColor}</p>
      </div>
      <div className="space-y-2 text-sm">
        <p className="font-medium text-slate-700">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`min-w-[2.5rem] rounded-full border px-3 py-1 text-sm font-medium transition ${
                selectedSize === size
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">Selected: {selectedSize}</p>
      </div>
      <AddToCartButton product={product} selectedColor={selectedColor} selectedSize={selectedSize} />
    </div>
  );
}
