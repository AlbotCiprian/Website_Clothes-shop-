import { NextResponse } from 'next/server';
import { fetchNPWarehouses } from '@/lib/novaPoshta';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityRef = searchParams.get('cityRef');
    const typeParam = searchParams.get('type');
    if (!cityRef) {
      return NextResponse.json({ warehouses: [] }, { status: 400 });
    }
    const type = typeParam === 'Locker' ? 'Locker' : typeParam === 'Warehouse' ? 'Warehouse' : undefined;
    const warehouses = await fetchNPWarehouses({ cityRef, type });

    return NextResponse.json({
      warehouses: warehouses.map((warehouse) => ({
        id: warehouse.Ref,
        name: warehouse.Description,
        type: warehouse.TypeOfWarehouse
      }))
    });
  } catch (error) {
    console.error('NP warehouses error', error);
    return NextResponse.json({ warehouses: [] }, { status: 500 });
  }
}
