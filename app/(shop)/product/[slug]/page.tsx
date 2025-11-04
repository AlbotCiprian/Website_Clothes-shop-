import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductPurchasePanel } from '@/components/ProductPurchasePanel';
import { formatCurrency } from '@/lib/utils';

interface ProductPageProps {
  params: { slug: string };
  searchParams?: { color?: string; size?: string };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = params;
  const color = searchParams?.color;
  const size = searchParams?.size;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    notFound();
  }

  const preselectedColor = color && product.colors.includes(color) ? color : product.colors[0];
  const preselectedSize = size && product.sizes.includes(size) ? size : product.sizes[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <Image
            src={product.images[0] ?? '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {product.images.slice(0, 3).map((image, index) => (
            <div key={image ?? index} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={image ?? '/placeholder.svg'} alt={product.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
          <p className="text-lg font-medium text-slate-700">{formatCurrency(product.priceCents, product.currency)}</p>
          {product.description && <p className="text-sm text-slate-600">{product.description}</p>}
        </div>
        <ProductPurchasePanel
          product={product}
          initialColor={preselectedColor}
          initialSize={preselectedSize}
        />
        <div className="space-y-2 text-sm text-slate-500">
          <p>Free delivery to Nova Poshta lockers across Moldova.</p>
          <p>3D Secure payment via MAIB ensures safe checkout.</p>
        </div>
      </div>
    </div>
  );
}
