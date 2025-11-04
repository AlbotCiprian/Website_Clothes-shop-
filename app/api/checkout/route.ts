import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createMaibPayment } from '@/lib/maib';

const cartItemSchema = z.object({
  slug: z.string(),
  productId: z.string().optional(),
  name: z.string().optional(),
  priceCents: z.number().int().optional(),
  currency: z.string().optional(),
  qty: z.number().int().positive(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional()
});

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6),
  customerName: z.string().min(2),
  address: z.string().optional().nullable(),
  deliveryType: z.enum(['Locker', 'Warehouse']).optional(),
  np_city: z.string().optional().nullable(),
  np_city_ref: z.string().optional().nullable(),
  np_warehouse: z.string().optional().nullable(),
  np_warehouse_ref: z.string().optional().nullable(),
  items: z.array(cartItemSchema).min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parse = checkoutSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.issues }, { status: 400 });
  }

  const {
    email,
    phone,
    customerName,
    address,
    deliveryType,
    np_city,
    np_city_ref,
    np_warehouse,
    np_warehouse_ref,
    items
  } = parse.data;

  const slugs = items.map((item) => item.slug);
  const products = await prisma.product.findMany({ where: { slug: { in: slugs } } });

  if (products.length !== slugs.length) {
    const missing = slugs.filter((slug) => !products.some((product) => product.slug === slug));
    return NextResponse.json({ error: `Products not found: ${missing.join(', ')}` }, { status: 404 });
  }

  const enriched = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug)!;
    return {
      ...item,
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency
    };
  });

  const totalCents = enriched.reduce((sum, item) => sum + item.priceCents * item.qty, 0);

  const order = await prisma.order.create({
    data: {
      email,
      phone,
      customerName,
      address: address ?? undefined,
      np_city: np_city ?? undefined,
      np_warehouse: np_warehouse ?? undefined,
      np_city_ref: np_city_ref ?? undefined,
      np_warehouse_ref: np_warehouse_ref ?? undefined,
      np_deliveryType: deliveryType ?? 'Locker',
      totalCents,
      currency: enriched[0]?.currency ?? 'MDL',
      items: {
        create: enriched.map((item) => ({
          productId: item.productId!,
          name: item.name!,
          slug: item.slug,
          size: item.size ?? undefined,
          color: item.color ?? undefined,
          qty: item.qty,
          priceCents: item.priceCents
        }))
      }
    }
  });

  const payment = await createMaibPayment({
    orderId: order.id,
    amount: totalCents,
    currency: order.currency,
    description: `Order #${order.number}`
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: payment.id }
  });

  return NextResponse.json({ redirectUrl: payment.redirectUrl });
}
