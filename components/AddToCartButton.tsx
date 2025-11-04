'use client';

import { useState } from 'react';
import type { Product } from '@prisma/client';
import { addToCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: string | null;
  selectedSize?: string | null;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, selectedSize, className }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      slug: product.slug,
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      qty: 1,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={cn(
        'flex h-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
        className
      )}
    >
      {isAdded ? 'Added!' : 'Add to cart'}
    </button>
  );
}
