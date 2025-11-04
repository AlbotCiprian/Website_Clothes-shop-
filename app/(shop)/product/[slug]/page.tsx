import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { ProductPurchasePanel } from '@/components/ProductPurchasePanel';
import { Gallery } from '@/components/Gallery';
import { UspBadges } from '@/components/UspBadges';
import { Testimonials } from '@/components/Testimonials';
import { Faq } from '@/components/Faq';
import { UGCGrid } from '@/components/UGCGrid';
import { Recommendations } from '@/components/Recommendations';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { getComplementaryProducts, getTrendingProducts } from '@/lib/reco';

interface ProductPageProps {
  params: { slug: string };
  searchParams?: { color?: string; size?: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) {
    return { title: 'Product not found' };
  }

  const title = `${product.name} — Blueprint Athletics`;
  const description = product.description ?? 'Premium performance wear with MAIB checkout and Nova Poshta delivery.';
  const image = product.images[0] ?? '/og-default.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = params;
  const color = searchParams?.color;
  const size = searchParams?.size;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://example.com';

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      testimonials: true,
      faqs: true,
      ugcAssets: { where: { featured: true }, take: 6 }
    }
  });
  if (!product) {
    notFound();
  }

  const [complementary, trending] = await Promise.all([
    getComplementaryProducts({ productId: product.id, limit: 4 }),
    getTrendingProducts(4)
  ]);

  const preselectedColor = color && product.colors.includes(color) ? color : product.colors[0];
  const preselectedSize = size && product.sizes.includes(size) ? size : product.sizes[0];
  const reviewCount = product.testimonials.length;
  const averageRating =
    reviewCount > 0
      ? product.testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) / reviewCount
      : 0;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    brand: {
      '@type': 'Brand',
      name: 'Blueprint Athletics'
    },
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating.toFixed(1),
            reviewCount,
            bestRating: '5',
            worstRating: '1'
          }
        }
      : {})
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Shop',
        item: `${baseUrl}/shop`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.name,
        item: `${baseUrl}/product/${product.slug}`
      }
    ]
  };

  return (
    <div className="space-y-12">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wide text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-brand">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-900">{product.name}</li>
        </ol>
      </nav>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Gallery images={product.images} name={product.name} />
        <div className="space-y-8">
          <ProductPurchasePanel product={product} initialColor={preselectedColor} initialSize={preselectedSize} />
          <UspBadges />
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Speedy fulfilment</p>
            <p>Once MAIB confirms payment, our Nova Poshta integration auto-generates your TTN within minutes.</p>
          </div>
        </div>
      </div>
      <Testimonials
        testimonials={product.testimonials}
        averageRating={averageRating > 0 ? averageRating : undefined}
        reviewCount={reviewCount || undefined}
      />
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-slate-900">Why athletes love it</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Four-way stretch and moisture control keeps you cool mid-session.</li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Laser-cut hems prevent chafing while maintaining structure.</li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Pair with Blueprint Seamless hoodie for a full studio-to-street set.</li>
        </ul>
      </section>
      <Recommendations title="Completează look-ul" subtitle="Style it cu piesele recomandate" products={complementary} />
      <Recommendations title="Trending acum" subtitle="Ce comandă comunitatea Blueprint în ultimele zile" products={trending} />
      <UGCGrid
        items={product.ugcAssets.map((asset) => ({
          id: asset.id,
          image: asset.image,
          author: asset.author,
          handle: asset.handle ?? undefined
        }))}
      />
      <Faq
        items={product.faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer
        }))}
      />
      <RecentlyViewed currentSlug={product.slug} />
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify([productJsonLd, breadcrumbJsonLd])}
      </script>
    </div>
  );
}
