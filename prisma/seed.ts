import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      slug: 'oversized-hoodie-black',
      name: 'Oversized Hoodie — Black',
      description: 'Heavyweight fleece hoodie in jet black.',
      priceCents: 12900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/hoodie-black.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#000000'],
      stock: 25
    },
    {
      slug: 'oversized-hoodie-cream',
      name: 'Oversized Hoodie — Cream',
      description: 'Soft brushed fleece hoodie in cream.',
      priceCents: 12900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/hoodie-cream.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#f5f5dc'],
      stock: 18
    },
    {
      slug: 'ribbed-top-mocha',
      name: 'Ribbed Top — Mocha',
      description: 'Minimal ribbed top with premium stretch.',
      priceCents: 8900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/ribbed-top.jpg'],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#836953'],
      stock: 32
    },
    {
      slug: 'cargo-pants-olive',
      name: 'Cargo Pants — Olive',
      description: 'Relaxed fit cargo pants with elastic waistband.',
      priceCents: 14900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/cargo-olive.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#556b2f'],
      stock: 20
    },
    {
      slug: 'puffer-jacket-chalk',
      name: 'Puffer Jacket — Chalk',
      description: 'Ultra-light puffer with water-resistant shell.',
      priceCents: 21900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/puffer-chalk.jpg'],
      sizes: ['S', 'M', 'L'],
      colors: ['#f2f2f2'],
      stock: 12
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
