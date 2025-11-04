import { prisma } from '@/lib/db';
import { ProductGrid } from '@/components/ProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop — Blueprint Clothes Shop',
  description: 'Curated apparel drops optimized for Instagram checkout.'
};

export const revalidate = 120;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Latest drops</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Choose your colour and size straight from Instagram posts. Every product page is tuned for
          lightning-fast checkout on mobile.
        </p>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
