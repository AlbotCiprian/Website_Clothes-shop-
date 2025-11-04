import Image from 'next/image';

export interface UGCItem {
  id: string;
  image: string;
  author: string;
  handle?: string;
}

interface UGCGridProps {
  items: UGCItem[];
}

export function UGCGrid({ items }: UGCGridProps) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900">Styled by you</h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">#BlueprintAthletics</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="group relative overflow-hidden rounded-3xl">
            <Image src={item.image} alt={item.author} width={600} height={600} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 text-sm text-white opacity-0 transition group-hover:opacity-100">
              <div>
                <p className="font-semibold">{item.author}</p>
                {item.handle ? <p className="text-xs text-white/80">{item.handle}</p> : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
