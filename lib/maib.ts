import crypto from 'node:crypto';

interface CreateMaibPaymentInput {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
}

interface CreateMaibPaymentResponse {
  id: string;
  redirectUrl: string;
}

function buildSignature(payload: Record<string, unknown>) {
  const secret = process.env.MAIB_SECRET;
  const filtered = Object.entries(payload)
    .filter(([key]) => key !== 'signature')
    .reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  const data = Object.keys(filtered)
    .sort()
    .map((key) => `${key}=${filtered[key] ?? ''}`)
    .join('&');

  if (!secret) {
    console.warn('MAIB_SECRET is not configured. Using mock signature.');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export async function createMaibPayment(input: CreateMaibPaymentInput): Promise<CreateMaibPaymentResponse> {
  const gatewayUrl = process.env.MAIB_GATEWAY_URL;

  const payload = {
    merchantId: process.env.MAIB_MERCHANT_ID,
    amount: input.amount,
    currency: input.currency,
    orderId: input.orderId,
    description: input.description,
    returnUrl: process.env.MAIB_RETURN_URL,
    callbackUrl: process.env.MAIB_CALLBACK_URL
  } satisfies Record<string, unknown>;

  const signature = buildSignature(payload);

  if (!gatewayUrl) {
    const redirectUrl = process.env.MAIB_RETURN_URL ?? 'http://localhost:3000/checkout?status=mock';
    console.warn('MAIB_GATEWAY_URL is not configured. Returning mock redirect URL.');
    return { id: `mock-${input.orderId}`, redirectUrl };
  }

  const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, signature })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MAIB create payment failed: ${body}`);
  }

  const data = (await response.json()) as { paymentId: string; redirectUrl: string };
  return { id: data.paymentId, redirectUrl: data.redirectUrl };
}

export function verifyMaibSignature(payload: Record<string, unknown>, signature?: string | null) {
  if (!signature) return false;
  const expected = buildSignature(payload);
  const provided = Buffer.from(signature, 'utf8');
  const anticipated = Buffer.from(expected, 'utf8');
  if (provided.length !== anticipated.length) {
    return false;
  }
  return crypto.timingSafeEqual(provided, anticipated);
}
