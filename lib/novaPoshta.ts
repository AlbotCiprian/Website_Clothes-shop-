interface CreateNPShipmentInput {
  order: {
    id: string;
    number: number;
    customerName: string;
    phone: string;
    np_city: string | null;
    np_warehouse: string | null;
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
      ServiceType: 'WarehouseWarehouse',
      SeatsAmount: '1',
      CargoType: 'Parcel',
      Weight: '1',
      Description: `Clothes order #${order.number}`,
      RecipientCityName: order.np_city ?? '',
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
