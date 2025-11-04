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
      stock: 25,
      testimonials: [
        {
          quote: 'The fit is unreal – cosy without overheating on the way to the gym.',
          author: 'Ana P.',
          role: 'Pilates coach'
        },
        {
          quote: 'Pairing this with the chalk joggers gives a premium monochrome look.',
          author: 'Igor T.',
          role: 'CrossFit athlete'
        }
      ],
      faqs: [
        { question: 'Is the fabric pre-washed?', answer: 'Yes, every hoodie is pre-washed to minimise shrinkage.' },
        { question: 'How heavy is the hoodie?', answer: 'Mid-heavy 420gsm fleece with brushed interior.' }
      ],
      ugc: [
        {
          image: 'https://res.cloudinary.com/demo/image/upload/v1700000000/ugc-hoodie-1.jpg',
          author: 'Cristina',
          handle: '@cristina.lifts'
        },
        {
          image: 'https://res.cloudinary.com/demo/image/upload/v1700000000/ugc-hoodie-2.jpg',
          author: 'Mark',
          handle: '@mark.strength'
        }
      ]
    },
    {
      slug: 'oversized-hoodie-cream',
      name: 'Oversized Hoodie — Cream',
      description: 'Soft brushed fleece hoodie in cream.',
      priceCents: 12900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/hoodie-cream.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#f5f5dc'],
      stock: 18,
      testimonials: [
        {
          quote: 'Perfect neutral layer that I can style with leggings or denim.',
          author: 'Diana M.',
          role: 'Content creator'
        }
      ],
      faqs: [
        { question: 'Does the cream colour stain easily?', answer: 'Fabric has a water-resistant coating to repel marks.' }
      ],
      ugc: [
        {
          image: 'https://res.cloudinary.com/demo/image/upload/v1700000000/ugc-hoodie-cream.jpg',
          author: 'Julia',
          handle: '@julia.moves'
        }
      ]
    },
    {
      slug: 'ribbed-top-mocha',
      name: 'Ribbed Top — Mocha',
      description: 'Minimal ribbed top with premium stretch.',
      priceCents: 8900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/ribbed-top.jpg'],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#836953'],
      stock: 32,
      testimonials: [
        {
          quote: 'Holds shape after multiple washes and hugs the body just right.',
          author: 'Mirela',
          role: 'Yoga instructor'
        }
      ],
      faqs: [
        { question: 'Is it double layered?', answer: 'Yes, for extra coverage during inversions.' }
      ],
      ugc: []
    },
    {
      slug: 'cargo-pants-olive',
      name: 'Cargo Pants — Olive',
      description: 'Relaxed fit cargo pants with elastic waistband.',
      priceCents: 14900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/cargo-olive.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#556b2f'],
      stock: 20,
      testimonials: [
        {
          quote: 'Stretch panels make deep squats easy. Utility pockets actually usable.',
          author: 'Alex P.',
          role: 'Functional fitness coach'
        }
      ],
      faqs: [
        { question: 'Do they have ankle zips?', answer: 'Yes, for ventilation and easy on/off.' }
      ],
      ugc: []
    },
    {
      slug: 'puffer-jacket-chalk',
      name: 'Puffer Jacket — Chalk',
      description: 'Ultra-light puffer with water-resistant shell.',
      priceCents: 21900,
      images: ['https://res.cloudinary.com/demo/image/upload/v1699999999/puffer-chalk.jpg'],
      sizes: ['S', 'M', 'L'],
      colors: ['#f2f2f2'],
      stock: 12,
      testimonials: [
        {
          quote: 'Warmth without the bulk. Folds into my gym bag effortlessly.',
          author: 'Eugenia',
          role: 'Spin instructor'
        }
      ],
      faqs: [
        { question: 'Is the jacket packable?', answer: 'Yes, includes a drawstring pouch for travel.' }
      ],
      ugc: [
        {
          image: 'https://res.cloudinary.com/demo/image/upload/v1700000000/ugc-puffer.jpg',
          author: 'Vlad',
          handle: '@vlad.trails'
        }
      ]
    }
  ];

  for (const product of products) {
    const { testimonials, faqs, ugc, ...productData } = product;
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: productData
    });

    await prisma.testimonial.deleteMany({ where: { productId: created.id } });
    await prisma.faq.deleteMany({ where: { productId: created.id } });
    await prisma.uGCAsset.deleteMany({ where: { productId: created.id } });

    if (testimonials?.length) {
      await prisma.testimonial.createMany({
        data: testimonials.map((testimonial) => ({ ...testimonial, productId: created.id }))
      });
    }

    if (faqs?.length) {
      await prisma.faq.createMany({
        data: faqs.map((faq) => ({ ...faq, productId: created.id }))
      });
    }

    if (ugc?.length) {
      await prisma.uGCAsset.createMany({
        data: ugc.map((asset) => ({ ...asset, productId: created.id }))
      });
    }
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
