# Blueprint Clothes Shop

Opinionated Next.js blueprint for launching an Instagram-first clothing storefront with MAIB eComm payments and Nova Poshta fulfilment.

## Features

- **Next.js App Router** with React Server Components and Tailwind UI.
- **Prisma + PostgreSQL** data layer with seed products ready for demo.
- **One-page checkout** optimised for mobile with MAIB redirect flow.
- **MAIB eComm webhook** that triggers Nova Poshta shipment creation automatically.
- **Local cart storage** for frictionless guest checkout.

## Getting started

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Copy `.env.example` to `.env` and fill in real credentials.

## MAIB eComm integration

Implementation expects the MAIB gateway to accept JSON payloads with a SHA-256 HMAC signature. Update `lib/maib.ts` with the exact fields and signature algorithm provided by your account manager.

Incoming webhook events must include the `x-maib-signature` header. The helper validates payloads before updating the order.

## Nova Poshta integration

`lib/novaPoshta.ts` provides a minimal helper that creates an Internet Document (TTN) after payment approval. Extend the payload with your sender reference data and optional delivery options (locker vs courier).

## Folder structure

```
app/
  (shop)/
    layout.tsx
    product/[slug]/page.tsx
    shop/page.tsx
  cart/page.tsx
  checkout/page.tsx
  api/
    checkout/route.ts
    webhooks/maib/route.ts
    shipping/nova-poshta/route.ts
components/
  AddToCartButton.tsx
  CheckoutForm.tsx
  ProductCard.tsx
  ProductGrid.tsx
lib/
  cart.ts
  db.ts
  maib.ts
  novaPoshta.ts
  utils.ts
prisma/
  schema.prisma
  seed.ts
```

## Next steps

- Hook up real MAIB and Nova Poshta credentials.
- Implement auth (NextAuth) if you need customer accounts.
- Add marketing content, FAQs, and brand assets.
- Harden against abuse (rate limiting, bot filtering) before going live.
