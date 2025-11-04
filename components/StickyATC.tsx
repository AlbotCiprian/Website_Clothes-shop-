'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatCurrency } from '@/lib/utils';

interface StickyATCProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
}

export function StickyATC({ product, selectedColor, selectedSize }: StickyATCProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const trigger = window.scrollY > 340;
      setVisible(trigger);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur sm:hidden"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Ready to ship</p>
              <p className="text-base font-semibold text-slate-900">{formatCurrency(product.priceCents, product.currency)}</p>
            </div>
            <AddToCartButton
              product={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              className="flex-1"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
