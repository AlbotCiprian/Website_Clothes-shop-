interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  averageRating?: number;
  reviewCount?: number;
}

export function Testimonials({ testimonials, averageRating = 4.9, reviewCount = testimonials.length }: TestimonialsProps) {
  if (!testimonials.length) return null;

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Athletes say it best</h2>
        <p className="text-sm text-slate-500">
          Rated <span itemProp="ratingValue">{averageRating.toFixed(1)}</span>/5 from{' '}
          <span itemProp="reviewCount">{reviewCount}</span> verified orders.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.id} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <blockquote className="text-sm text-slate-600">“{testimonial.quote}”</blockquote>
            <figcaption className="text-sm font-semibold text-slate-900">
              {testimonial.author}
              {testimonial.role ? <span className="block text-xs font-normal text-slate-500">{testimonial.role}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      <meta itemProp="ratingValue" content={averageRating.toFixed(1)} />
      <meta itemProp="reviewCount" content={String(reviewCount)} />
    </section>
  );
}
