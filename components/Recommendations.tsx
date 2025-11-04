import type { Product } from '@prisma/client';
import { ProductCard } from '@/components/ProductCard';

interface RecommendationsProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function Recommendations({ title, subtitle, products }: RecommendationsProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
