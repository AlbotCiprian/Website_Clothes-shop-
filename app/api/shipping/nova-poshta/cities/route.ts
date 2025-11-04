import { NextResponse } from 'next/server';
import { fetchNPCities } from '@/lib/novaPoshta';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') ?? '').toLowerCase();
    const cities = await fetchNPCities();
    const filtered = query
      ? cities.filter((city) => city.Description.toLowerCase().includes(query)).slice(0, 30)
      : cities.slice(0, 100);

    return NextResponse.json({
      cities: filtered.map((city) => ({ id: city.Ref, name: city.Description }))
    });
  } catch (error) {
    console.error('NP cities error', error);
    return NextResponse.json({ cities: [] }, { status: 500 });
  }
}
