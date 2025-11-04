import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

interface SuccessPageProps {
  searchParams?: { o?: string };
}

export const revalidate = 0;

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams?.o;
  if (!orderId) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        <h1 className="font-display text-3xl font-bold text-slate-900">Nu avem comanda</h1>
        <p className="mt-2">Linkul nu conține un ID de comandă. Verifică emailul de confirmare sau contactează-ne.</p>
        <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white">
          Înapoi la shop
        </Link>
      </section>
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        <h1 className="font-display text-3xl font-bold text-slate-900">Comanda nu există</h1>
        <p className="mt-2">ID-ul introdus nu a fost găsit. Dacă plata a fost procesată, contactează support@blueprint.</p>
        <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white">
          Înapoi la shop
        </Link>
      </section>
    );
  }

  const trackingUrl = order.shipmentTTN
    ? `https://novaposhta.ua/track/${order.shipmentTTN}`
    : 'https://novaposhta.ua/track';

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">Comandă confirmată</p>
        <h1 className="font-display text-3xl font-bold text-slate-900">Mulțumim, {order.customerName.split(' ')[0] ?? 'athlete'}!</h1>
        <p className="text-sm text-slate-600">
          Plata prin MAIB eComm a fost înregistrată. {order.shipmentTTN ? 'Am generat deja livrarea Nova Poshta.' : 'Livrarea Nova Poshta se generează în câteva minute.'}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Detalii comandă</h2>
          <p className="mt-2 font-semibold text-slate-900">#{order.number}</p>
          <p>Total: {formatCurrency(order.totalCents, order.currency)}</p>
          <p>Livrare: {order.np_deliveryType === 'Locker' ? 'Locker Nova Poshta' : 'Depozit Nova Poshta'}</p>
          <p>{order.np_city}</p>
          <p>{order.np_warehouse}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tracking Nova Poshta</h2>
          {order.shipmentTTN ? (
            <>
              <p className="mt-2 text-lg font-semibold text-slate-900">TTN {order.shipmentTTN}</p>
              <p>Poți urmări livrarea folosind butonul de mai jos.</p>
              <Link
                href={trackingUrl}
                target="_blank"
                className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white"
              >
                Deschide tracking
              </Link>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Confirmăm încă plata cu Nova Poshta. Vei primi TTN-ul pe email.</p>
          )}
        </div>
      </div>
      <Link href="/shop" className="inline-flex rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700">
        Continuă cumpărăturile
      </Link>
    </section>
  );
}
