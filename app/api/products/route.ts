import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PRODUCT_PAGE_SIZE } from '@/lib/constants';

export const runtime = 'nodejs';

type SortOption = 'featured' | 'new' | 'price_asc' | 'price_desc';

function getOrder(sort: SortOption) {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '0');
  const color = searchParams.get('color') ?? undefined;
  const size = searchParams.get('size') ?? undefined;
  const sort = (searchParams.get('sort') as SortOption | null) ?? 'featured';
  const priceMin = Number(searchParams.get('price_min') ?? '0');
  const priceMax = Number(searchParams.get('price_max') ?? '0');

  const filters: Parameters<typeof prisma.product.findMany>[0]['where'] = {};

  if (color) {
    filters.colors = { has: color };
  }
  if (size) {
    filters.sizes = { has: size };
  }
  if (priceMin > 0 || priceMax > 0) {
    filters.priceCents = {
      gte: priceMin > 0 ? priceMin : undefined,
      lte: priceMax > 0 ? priceMax : undefined
    };
  }

  const products = await prisma.product.findMany({
    where: filters,
    orderBy: getOrder(sort),
    skip: page * PRODUCT_PAGE_SIZE,
    take: PRODUCT_PAGE_SIZE + 1
  });

  const hasMore = products.length > PRODUCT_PAGE_SIZE;

  return NextResponse.json({
    products: products.slice(0, PRODUCT_PAGE_SIZE),
    page,
    hasMore
  });
}
