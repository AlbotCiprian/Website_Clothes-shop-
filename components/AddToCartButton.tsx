'use client';

import { useState } from 'react';
import type { Product } from '@prisma/client';
import { addToCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';

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
    <Button onClick={handleAdd} className={className} size="lg">
      {isAdded ? 'Added!' : 'Add to cart'}
    </Button>
  );
}
