import { getCachedCities, getCachedWarehouses, setCachedCities, setCachedWarehouses, type NPCity, type NPWarehouse } from '@/lib/npCache';

interface CreateNPShipmentInput {
  order: {
    id: string;
    number: number;
    customerName: string;
    phone: string;
    np_city: string | null;
    np_warehouse: string | null;
    np_deliveryType?: string | null;
    np_city_ref?: string | null;
    np_warehouse_ref?: string | null;
  };
}

export async function createNPShipment({ order }: CreateNPShipmentInput) {
  const apiUrl = process.env.NP_API_URL;
  const apiKey = process.env.NP_API_KEY;
  if (!apiUrl || !apiKey) {
    throw new Error('Nova Poshta credentials not configured');
  }

  const payload = {
    apiKey,
    modelName: 'InternetDocument',
    calledMethod: 'save',
    methodProperties: {
      PayerType: 'Recipient',
      PaymentMethod: 'NonCash',
      DateTime: new Date().toISOString().slice(0, 10),
      ServiceType: order.np_deliveryType === 'Locker' ? 'WarehousePostomat' : 'WarehouseWarehouse',
      SeatsAmount: '1',
      CargoType: 'Parcel',
      Weight: '1',
      Description: `Clothes order #${order.number}`,
      CityRecipient: order.np_city_ref ?? undefined,
      RecipientCityName: order.np_city ?? '',
      RecipientAddress: order.np_warehouse_ref ?? undefined,
      RecipientAddressName: order.np_warehouse ?? '',
      RecipientName: order.customerName,
      RecipientPhone: order.phone
    }
  } satisfies Record<string, unknown>;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as { success: boolean; data?: Array<{ IntDocNumber: string }>; errors?: string[] };
  if (!data.success) {
    const errorMessage = data.errors?.join(', ') ?? 'Nova Poshta save failed';
    throw new Error(errorMessage);
  }

  return data.data?.[0]?.IntDocNumber ?? '';
}

async function callNovaPoshta<T>(payload: Record<string, unknown>) {
  const apiUrl = process.env.NP_API_URL;
  const apiKey = process.env.NP_API_KEY;
  if (!apiUrl || !apiKey) {
    throw new Error('Nova Poshta credentials not configured');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, ...payload })
  });
  if (!response.ok) {
    throw new Error('Nova Poshta request failed');
  }
  return (await response.json()) as { success: boolean; data: T; errors?: string[] };
}

export async function fetchNPCities(): Promise<NPCity[]> {
  const cached = getCachedCities();
  if (cached) return cached;

  const response = await callNovaPoshta<NPCity[]>({
    modelName: 'Address',
    calledMethod: 'getCities',
    methodProperties: { Limit: 500 }
  });

  if (!response.success) {
    throw new Error(response.errors?.join(', ') ?? 'Failed to fetch cities');
  }

  const cities = response.data;
  setCachedCities(cities);
  return cities;
}

export async function fetchNPWarehouses({
  cityRef,
  type
}: {
  cityRef: string;
  type?: 'Locker' | 'Warehouse';
}): Promise<NPWarehouse[]> {
  const cacheKey = `${cityRef}-${type ?? 'all'}`;
  const cached = getCachedWarehouses(cacheKey);
  if (cached) return cached;

  const response = await callNovaPoshta<NPWarehouse[]>({
    modelName: 'Address',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityRef: cityRef,
      TypeOfWarehouse: type === 'Locker' ? 'Postomat' : undefined,
      Limit: 200
    }
  });

  if (!response.success) {
    throw new Error(response.errors?.join(', ') ?? 'Failed to fetch warehouses');
  }

  const warehouses = response.data;
  setCachedWarehouses(cacheKey, warehouses);
  return warehouses;
}
