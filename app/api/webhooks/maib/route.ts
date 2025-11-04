import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNPShipment } from '@/lib/novaPoshta';
import { verifyMaibSignature } from '@/lib/maib';

export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get('x-maib-signature');

  if (!verifyMaibSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { orderId, status } = payload as { orderId?: string; status?: string };
  if (!orderId || !status) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (status === 'approved') {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'paid' }
    });

    if (order.np_city && order.np_warehouse) {
      try {
        const ttn = await createNPShipment({ order });
        await prisma.order.update({
          where: { id: orderId },
          data: { shipmentStatus: 'created', shipmentTTN: ttn }
        });
      } catch (error) {
        console.error(error);
      }
    }
  } else if (status === 'declined') {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'failed' }
    });
  }

  return NextResponse.json({ ok: true });
}
