import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.getAll('slug').filter(Boolean);
  if (!slugs.length) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } }
  });

  const ordered = slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  return NextResponse.json({ products: ordered });
}
