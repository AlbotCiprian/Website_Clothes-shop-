import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { ProductGrid } from '@/components/ProductGrid';
import { Filters } from '@/components/Filters';
import { PRODUCT_PAGE_SIZE } from '@/lib/constants';
import { getTrendingProducts } from '@/lib/reco';
import { Recommendations } from '@/components/Recommendations';

type SortOption = 'featured' | 'new' | 'price_asc' | 'price_desc';

function buildOrder(sort: SortOption) {
  switch (sort) {
    case 'price_asc':
      return { priceCents: 'asc' } as const;
    case 'price_desc':
      return { priceCents: 'desc' } as const;
    case 'new':
      return { createdAt: 'desc' } as const;
    case 'featured':
    default:
      return { updatedAt: 'desc' } as const;
  }
}

export const metadata: Metadata = {
  title: 'Shop the collection',
  description: 'Performance apparel optimised for mobile checkout and Nova Poshta delivery.'
};

export const revalidate = 60;

interface ShopPageProps {
  searchParams?: Record<string, string | string[]>;
}

export default async function ShopPage({ searchParams = {} }: ShopPageProps) {
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );

  const color = params.color ?? undefined;
  const size = params.size ?? undefined;
  const sort = (params.sort as SortOption | undefined) ?? 'featured';
  const priceMin = params.price_min ? Number(params.price_min) : undefined;
  const priceMax = params.price_max ? Number(params.price_max) : undefined;

  const where: Parameters<typeof prisma.product.findMany>[0]['where'] = {};
  if (color) {
    where.colors = { has: color };
  }
  if (size) {
    where.sizes = { has: size };
  }
  if (priceMin || priceMax) {
    where.priceCents = {
      gte: priceMin,
      lte: priceMax && priceMax > 0 ? priceMax : undefined
    };
  }

  const [productsWithPagination, facets, trending] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrder(sort),
      take: PRODUCT_PAGE_SIZE + 1
    }),
    prisma.product.findMany({ select: { colors: true, sizes: true } }),
    getTrendingProducts(4)
  ]);

  const initialProducts = productsWithPagination.slice(0, PRODUCT_PAGE_SIZE);
  const initialHasMore = productsWithPagination.length > PRODUCT_PAGE_SIZE;

  const uniqueColors = Array.from(new Set(facets.flatMap((product) => product.colors)))
    .filter(Boolean)
    .sort();
  const uniqueSizes = Array.from(new Set(facets.flatMap((product) => product.sizes)))
    .filter(Boolean)
    .sort();

  const heroStats = [
    { label: 'Average delivery', value: '24h to NP lockers' },
    { label: 'Checkout speed', value: '< 90 seconds' },
    { label: 'Returning athletes', value: '78%' }
  ];

  const normalizedParams: Record<string, string> = {
    ...params,
    sort
  };
  delete normalizedParams.page;

  return (
    <section className="space-y-10">
      <header className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Blueprint Athletics</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Engineered for motion. Styled for every scroll.
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            Explore gym-to-street staples built with moisture control fabrics, adaptive stretch, and ultra-soft textures. Optimised for mobile checkout with secure MAIB payments and Nova Poshta delivery.
          </p>
        </div>
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {heroStats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
              <p className="font-display text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </header>
      <Filters sizes={uniqueSizes} colors={uniqueColors} />
      <ProductGrid initialProducts={initialProducts} initialHasMore={initialHasMore} searchParams={normalizedParams} />
      <Recommendations title="Top sellers" subtitle="Cele mai populare piese din ultimele 7 zile" products={trending} />
    </section>
  );
}
