import { subDays } from 'date-fns';
import { prisma } from '@/lib/db';

interface RecommendationOptions {
  productId: string;
  limit?: number;
}

export async function getTrendingProducts(limit = 4) {
  const sevenDaysAgo = subDays(new Date(), 7);
  const items = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { Order: { createdAt: { gte: sevenDaysAgo } } },
    _sum: { qty: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: limit
  });

  const productIds = items.map((item) => item.productId);
  if (!productIds.length) {
    return prisma.product.findMany({ take: limit, orderBy: { createdAt: 'desc' } });
  }

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  return productIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
}

export async function getComplementaryProducts({ productId, limit = 4 }: RecommendationOptions) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return [];

  return prisma.product.findMany({
    where: {
      id: { not: productId },
      OR: [
        { colors: { hasSome: product.colors } },
        { priceCents: { gte: product.priceCents - 5000, lte: product.priceCents + 5000 } }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    take: limit
  });
}

export async function logEvent({ sessionId, type, productId }: { sessionId: string; type: 'view' | 'add'; productId?: string }) {
  try {
    await prisma.event.create({
      data: {
        sessionId,
        type,
        productId
      }
    });
  } catch (error) {
    console.error('Failed to log event', error);
  }
}

export async function getSessionRecommendations(sessionId: string, limit = 4) {
  const recentEvents = await prisma.event.findMany({
    where: { sessionId, productId: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  const lastProductId = recentEvents[0]?.productId;
  if (!lastProductId) {
    return getTrendingProducts(limit);
  }
  return getComplementaryProducts({ productId: lastProductId, limit });
}
