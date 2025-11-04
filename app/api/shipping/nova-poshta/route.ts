import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNPShipment } from '@/lib/novaPoshta';

export async function POST(request: Request) {
  const { orderId } = (await request.json()) as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (!order.np_city || !order.np_warehouse) {
    return NextResponse.json({ error: 'Order is missing Nova Poshta details' }, { status: 400 });
  }

  const ttn = await createNPShipment({ order });
  await prisma.order.update({
    where: { id: orderId },
    data: { shipmentStatus: 'created', shipmentTTN: ttn }
  });

  return NextResponse.json({ ttn });
}
